/* ─────────────────────────────────────────
   app.js  —  Shared utilities & API calls
   ───────────────────────────────────────── */

// ── FORMAT ───────────────────────────────
function fmt(n) {
  return "฿" + Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function initials(name) {
  return (name || "?").split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "?";
}

function escHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── TOAST ────────────────────────────────
function toast(msg, type = "") {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

// ── IMAGE FILE → BASE64 ───────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsDataURL(file);
  });
}

// ── API HELPERS ───────────────────────────
const API = {
  async get(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  },

  async post(path, body) {
    const res = await fetch(path, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    return res.json();
  },

  async del(path) {
    const res = await fetch(path, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
    return res.json();
  }
};

// ── SCREEN SWITCHER ───────────────────────
function showScreen(name) {
  document.querySelectorAll(".screen").forEach(s => {
    s.style.display = s.id === `screen-${name}` ? "block" : "none";
  });
}

// ── CSV EXPORT ────────────────────────────
function downloadCSV(rows, filename) {
  const csv  = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}