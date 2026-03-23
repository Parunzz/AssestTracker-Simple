"""
Asset Tracker - Python Backend
Run: python3 server.py
Access: http://localhost:8080
"""

import json
import os
import base64
import uuid
import mimetypes
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime

# ── CONFIG ──────────────────────────────────────────────
PORT       = 8080
DATA_DIR   = os.path.join(os.path.dirname(__file__), "data")
IMG_DIR    = os.path.join(DATA_DIR, "images")
DB_FILE    = os.path.join(DATA_DIR, "db.json")
STATIC_DIR = os.path.dirname(__file__)

# ── SETUP FOLDERS ────────────────────────────────────────
os.makedirs(IMG_DIR, exist_ok=True)

# ── DATABASE HELPERS ─────────────────────────────────────
def load_db():
    if not os.path.exists(DB_FILE):
        return {"profiles": [], "assets": {}}
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(db):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

# ── IMAGE HELPERS ────────────────────────────────────────
def save_image(base64_data):
    """Save base64 image to disk, return filename."""
    if not base64_data or not base64_data.startswith("data:image"):
        return None
    try:
        header, data = base64_data.split(",", 1)
        ext = header.split("/")[1].split(";")[0]   # e.g. jpeg, png
        filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(IMG_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(data))
        return filename
    except Exception as e:
        print(f"[IMG] Save failed: {e}")
        return None

def delete_image(filename):
    if not filename:
        return
    path = os.path.join(IMG_DIR, filename)
    if os.path.exists(path):
        os.remove(path)

# ── REQUEST HANDLER ──────────────────────────────────────
class Handler(BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {fmt % args}")

    # ── ROUTING ──────────────────────────────────────────
    def do_GET(self):
        parsed = urlparse(self.path)
        path   = parsed.path.rstrip("/") or "/"

        if path == "/":
            self.serve_file("index.html", "text/html")
        elif path.startswith("/api/"):
            self.handle_api_get(path)
        elif path.startswith("/data/images/"):
            self.serve_image(path)
        else:
            # Serve static files (css, js)
            filepath = os.path.join(STATIC_DIR, path.lstrip("/"))
            if os.path.exists(filepath) and os.path.isfile(filepath):
                mime, _ = mimetypes.guess_type(filepath)
                self.serve_file(path.lstrip("/"), mime or "text/plain")
            else:
                self.send_error(404, "Not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        path   = parsed.path
        if path.startswith("/api/"):
            self.handle_api_post(path)
        else:
            self.send_error(404, "Not found")

    def do_DELETE(self):
        parsed = urlparse(self.path)
        path   = parsed.path
        if path.startswith("/api/"):
            self.handle_api_delete(path)
        else:
            self.send_error(404, "Not found")

    # ── OPTIONS (CORS preflight) ──────────────────────────
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors()
        self.end_headers()

    # ── STATIC FILE SERVING ───────────────────────────────
    def serve_file(self, relative_path, content_type):
        filepath = os.path.join(STATIC_DIR, relative_path)
        try:
            with open(filepath, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_cors()
            self.end_headers()
            self.wfile.write(content)
        except FileNotFoundError:
            self.send_error(404, f"File not found: {relative_path}")

    def serve_image(self, path):
        filename = os.path.basename(path)
        filepath = os.path.join(IMG_DIR, filename)
        if not os.path.exists(filepath):
            self.send_error(404, "Image not found")
            return
        mime, _ = mimetypes.guess_type(filepath)
        with open(filepath, "rb") as f:
            data = f.read()
        self.send_response(200)
        self.send_header("Content-Type", mime or "image/jpeg")
        self.send_header("Content-Length", str(len(data)))
        self.send_cors()
        self.end_headers()
        self.wfile.write(data)

    # ── API GET ───────────────────────────────────────────
    def handle_api_get(self, path):
        db = load_db()

        # GET /api/profiles
        if path == "/api/profiles":
            self.json_response(db["profiles"])

        # GET /api/assets/<profile_id>
        elif path.startswith("/api/assets/"):
            pid = path.split("/api/assets/")[1]
            self.json_response(db["assets"].get(pid, []))

        else:
            self.send_error(404, "Unknown API endpoint")

    # ── API POST ──────────────────────────────────────────
    def handle_api_post(self, path):
        body = self.read_body()

        # POST /api/profiles  { name, role, avatar_b64 }
        if path == "/api/profiles":
            db = load_db()
            avatar_file = save_image(body.get("avatar_b64"))
            profile = {
                "id":     uuid.uuid4().hex,
                "name":   body.get("name", "").strip(),
                "role":   body.get("role", "").strip(),
                "avatar": f"/data/images/{avatar_file}" if avatar_file else None,
                "created": datetime.now().isoformat()
            }
            db["profiles"].append(profile)
            db["assets"][profile["id"]] = []
            save_db(db)
            self.json_response(profile, 201)

        # POST /api/assets/<profile_id>  { name, amount, expense, cat, note, img_b64 }
        elif path.startswith("/api/assets/"):
            pid = path.split("/api/assets/")[1]
            db  = load_db()
            if pid not in db["assets"]:
                db["assets"][pid] = []
            img_file = save_image(body.get("img_b64"))
            asset = {
                "id":      uuid.uuid4().hex,
                "name":    body.get("name", "").strip(),
                "amount":  float(body.get("amount", 0)),
                "expense": float(body.get("expense", 0)),
                "cat":     body.get("cat", "other"),
                "note":    body.get("note", "").strip(),
                "img":     f"/data/images/{img_file}" if img_file else None,
                "date":    datetime.now().strftime("%Y-%m-%d")
            }
            db["assets"][pid].insert(0, asset)
            save_db(db)
            self.json_response(asset, 201)

        else:
            self.send_error(404, "Unknown API endpoint")

    # ── API DELETE ────────────────────────────────────────
    def handle_api_delete(self, path):
        db = load_db()

        # DELETE /api/profiles/<id>
        if path.startswith("/api/profiles/"):
            pid = path.split("/api/profiles/")[1]
            profile = next((p for p in db["profiles"] if p["id"] == pid), None)
            if profile:
                # Remove profile avatar image
                if profile.get("avatar"):
                    delete_image(os.path.basename(profile["avatar"]))
                # Remove all asset images for this profile
                for asset in db["assets"].get(pid, []):
                    if asset.get("img"):
                        delete_image(os.path.basename(asset["img"]))
                db["profiles"] = [p for p in db["profiles"] if p["id"] != pid]
                del db["assets"][pid]
                save_db(db)
                self.json_response({"ok": True})
            else:
                self.send_error(404, "Profile not found")

        # DELETE /api/assets/<profile_id>/<asset_id>
        elif path.startswith("/api/assets/"):
            parts = path.split("/api/assets/")[1].split("/")
            if len(parts) == 2:
                pid, aid = parts
                assets = db["assets"].get(pid, [])
                asset  = next((a for a in assets if a["id"] == aid), None)
                if asset:
                    if asset.get("img"):
                        delete_image(os.path.basename(asset["img"]))
                    db["assets"][pid] = [a for a in assets if a["id"] != aid]
                    save_db(db)
                    self.json_response({"ok": True})
                else:
                    self.send_error(404, "Asset not found")
            else:
                self.send_error(400, "Bad request")

        else:
            self.send_error(404, "Unknown API endpoint")

    # ── HELPERS ───────────────────────────────────────────
    def read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        raw    = self.rfile.read(length)
        try:
            return json.loads(raw)
        except Exception:
            return {}

    def json_response(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_cors()
        self.end_headers()
        self.wfile.write(body)

    def send_cors(self):
        self.send_header("Access-Control-Allow-Origin",  "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

# ── MAIN ─────────────────────────────────────────────────
if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), Handler)
    print(f"""
╔══════════════════════════════════════╗
║      Family Asset Tracker            ║
╠══════════════════════════════════════╣
║  Local:   http://localhost:{PORT}      ║
║  Network: http://<tailscale-ip>:{PORT} ║
║  Data:    ./data/                    ║
╚══════════════════════════════════════╝
Press Ctrl+C to stop.
""")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")