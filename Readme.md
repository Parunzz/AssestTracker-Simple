# Family Asset Tracker

## File Structure
```
asset-tracker/
├── server.py          ← Python backend
├── index.html         ← HTML structure only
├── css/
│   └── style.css      ← All styles
├── js/
│   ├── lang.js        ← Thai/English translations
│   ├── app.js         ← Shared utilities & API
│   ├── profiles.js    ← Profile screen logic
│   └── dashboard.js   ← Asset dashboard logic
└── data/              ← Auto-created on first run
    ├── db.json        ← All profile & asset data
    └── images/        ← Uploaded images saved here
```

## Setup in Termux

```bash
# 1. Install Python (if not already)
pkg install python

# 2. Go to the folder
cd ~/asset-tracker

# 3. Start the server
python3 server.py
```

## Access

- **This device:**  http://localhost:8080
- **Other devices (Tailscale):** http://<your-tailscale-ip>:8080

## Features
- Family profiles with photos
- Add assets with image upload
- Thai / English language switch
- Data + images saved on device (shared across all 5 devices via Tailscale)
- Export to CSV

## Stop server
Press `Ctrl + C`