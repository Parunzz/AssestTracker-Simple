# Family Asset Tracker (ทรัพย์สินครอบครัว)

A simple, client-side web application for managing and tracking family assets across multiple profiles and asset types.

## 📋 Overview

**Family Asset Tracker** is a web-based application that helps families track their financial assets in one place. It supports multiple family members (profiles) and tracks different types of assets: fixed assets, cryptocurrencies, gold, and stocks.

**Key Features:**
- 👥 Multi-profile support (family members)
- 💰 Multiple asset types (Fixed, Crypto, Gold, Stock)
- 🌍 Internationalization (English & Thai)
- 📱 Responsive design (desktop & mobile)
- 💾 Client-side storage (localStorage - no server needed)
- 📊 Dashboard with asset overview
- 🔍 Asset filtering and search
- 📎 Evidence/documentation attachment support
- 🌙 Clean, modern UI with avatar system

---

## 🏗️ Project Structure

```
AssestTracker-Simple/
├── index.html              # HTML structure (551 lines)
├── css/
│   └── style.css          # All styling (750 lines)
├── js/
│   └── script.js          # All application logic (1,150+ lines)
├── evidence/              # Folder for asset proof files (images, PDFs)
└── README.md              # This file
```

### File Organization

| File | Purpose | Size |
|------|---------|------|
| `index.html` | Semantic HTML structure, layout, forms, modals | ~551 lines |
| `css/style.css` | Styling, responsive design, animations, components | ~750 lines |
| `js/script.js` | Application logic, data management, interactions | ~1,150 lines |

---

## 🔧 How It Works

### 1. **Data Storage** (localStorage)

All data is stored locally in the browser using `localStorage` - no backend server required.

```javascript
const DB = {
  get profiles() { return JSON.parse(localStorage.getItem('profiles') || '[]'); },
  set profiles(v){ localStorage.setItem('profiles', JSON.stringify(v)); },
  get assets() { return JSON.parse(localStorage.getItem('assets') || '[]'); },
  set assets(v) { localStorage.setItem('assets', JSON.stringify(v)); },
  get activeProfile() { return localStorage.getItem('activeProfile') || null; },
  set activeProfile(v){ localStorage.setItem('activeProfile', v); },
}
```

**Stored Objects:**
- **Profiles**: Family member information (name, initials, avatar color)
- **Assets**: Asset records (type, owner, capital, purchase details, evidence)
- **Active Profile**: Currently selected family member

### 2. **Data Models**

#### Profile Object
```javascript
{
  id: 'p1',
  name: 'Dad · พ่อ',
  initials: 'พ',
  color: 'av-c1'  // Avatar color (av-c1 to av-c5)
}
```

#### Asset Object (varies by type)
```javascript
// Fixed Asset (PC, Monitor, etc.)
{
  id: 'a1',
  type: 'fixed',
  name: 'Gaming PC',
  profileId: 'p1',
  category: 'pc',
  price: 65000,
  date: '2023-11-01',
  notes: 'RTX4070',
  evidence: 'receipt.jpg'
}

// Crypto Asset
{
  id: 'a2',
  type: 'crypto',
  name: 'Bitcoin',
  profileId: 'p1',
  coin: 'BTC',
  capital: 800000,
  buyprice: 1600000,
  units: 0.5,
  date: '2024-01-15',
  exchange: 'Bitkub',
  evidence: ''
}

// Gold Asset
{
  id: 'a3',
  type: 'gold',
  name: 'ทองคำแท่ง',
  profileId: 'p2',
  goldType: 'baht_gold',
  capital: 190000,
  buyprice: 68000,
  units: 2.79,
  date: '2024-02-20',
  shop: 'ทองย่านรัตนโกสินทร์',
  evidence: ''
}

// Stock Asset
{
  id: 'a4',
  type: 'stock',
  name: 'PTT',
  profileId: 'p2',
  market: 'SET',
  ticker: 'PTT',
  capital: 120000,
  buyprice: 40,
  units: 3000,
  date: '2024-03-10',
  broker: 'Settrade',
  evidence: ''
}
```

---

## 🧠 Core Logic Components

### 1. **Internationalization (i18n)**

The app supports English and Thai languages through a centralized translation dictionary:

```javascript
const T = {
  en: { 'nav.dashboard': 'Dashboard', 'btn.save': 'Save', ... },
  th: { 'nav.dashboard': 'แดชบอร์ด', 'btn.save': 'บันทึก', ... }
}

function t(key) { return T[lang][key] || T['en'][key] || key; }
function setLang(lang) { /* updates UI with new language */ }
```

**160+ translation keys** covering navigation, buttons, form fields, and messages.

### 2. **Navigation System**

Single-page app with page switching without URL changes:

```javascript
const PAGE_NAMES = ['dashboard', 'assets', 'reports', 'profiles', 'settings'];

function showPage(id) {
  // Show/hide page divs
  // Update active nav button
  // Trigger page-specific render
}
```

**Pages:**
- Dashboard: Recent assets + profile overview
- Assets: Full asset table with filtering
- Reports: Net worth analytics (placeholder)
- Profiles: Family member management
- Settings: Language + data export/clear

### 3. **Rendering System**

Dynamic HTML generation for tables, cards, and lists:

```javascript
function renderDashboard() { /* generates dashboard HTML */ }
function renderAssets() { /* generates asset table */ }
function renderProfiles() { /* generates profile grid */ }
function renderAll() { /* re-renders everything */ }
```

**Key Render Helpers:**
- `assetRow(asset)` - Generates table row HTML for asset
- `typeBadge(type)` - Returns styled badge for asset type
- `plHtml(capital, current)` - Calculates & displays P&L (profit/loss)
- `evidenceHtml(filename)` - Shows image thumbnail or file link

### 4. **Asset Modal - Multi-Step Form**

Adding/editing assets uses a 3-step process:

**Step 1: Select Type**
- User picks: Fixed, Crypto, Gold, or Stock

**Step 2: Enter Details**
- Form fields shown based on asset type (type-specific fields)
- Real-time calculation of units/shares

**Step 3: Add Evidence**
- Upload image or PDF as proof
- Shows preview and file size

```javascript
let mStep = 1;      // Current step (1, 2, or 3)
let mType = 'fixed'; // Selected asset type
let mEditId = null;  // Edit mode: asset ID to edit
let mEvidenceFilename = ''; // Uploaded file name
```

### 5. **Unit Calculation**

Automatically calculates units based on investment:

```javascript
function calcUnits(type) {
  units = capital / buyprice
  // Crypto: units of coin
  // Gold: บาท (baht)
  // Stock: shares
  // Fixed: price only (no units)
}
```

### 6. **Profile Management**

Switch between family members:

```javascript
function switchProfile(id) { 
  DB.activeProfile = id; 
  renderAll(); // Re-render everything for new profile
}
```

Each profile has:
- Child assets filtered by `profileId`
- Avatar icon with color
- Total asset count and worth

### 7. **Asset Filtering**

Filter asset table by type:

```javascript
// Buttons: All, Fixed, Crypto, Gold, Stock
// Updates active state and re-renders table
```

### 8. **Evidence/Documentation**

Users can attach images or PDFs as proof:

```html
<file input> → FileReader API → Preview + Store filename
```

Evidence files should be saved in `/evidence/` folder manually.

### 9. **Data Export**

Users can download all data as JSON:

```javascript
function exportData() {
  // Creates JSON blob with profiles + assets
  // Downloads as: family-assets-YYYY-MM-DD.json
}
```

### 10. **Currency Formatting**

- **Thai Baht** (฿): `fmt(n)` - used for capital amounts
- **Decimal Units**: `fmtU(n)` - used for crypto and stock units

```javascript
fmt(65000)    // "฿65,000"
fmtU(0.5, 2)  // "0.50"
```

---

## 📊 Data Flow

```
User Action
    ↓
Event Listener (click, change, input)
    ↓
Handler Function (saveAsset, addProfile, etc.)
    ↓
Update DB (localStorage modification)
    ↓
Re-render UI (renderAll, renderPage, etc.)
    ↓
Display Updated Data
```

---

## 🎨 UI/UX Features

### Design System
- **CSS Variables** for consistent theming (colors, spacing, fonts)
- **Responsive Design**: Desktop (2-column) → Mobile (1-column)
- **Avatar System**: 5 color variants (av-c1 to av-c5)
- **Component Library**: Buttons, cards, badges, modals, forms
- **Animations**: fade-in, scale effects on page load

### Modal System
- Overlay backdrop with click-to-close
- Multi-step wizard for asset creation
- Profile color picker
- Form validation before save

### Interactive Elements
- Click handlers for navigation, filtering, CRUD
- Real-time unit calculation
- Language toggle with instant re-render
- File upload preview
- Evidence thumbnail gallery

---

## 💾 Demo Data

The app includes 5 sample assets across 4 family member profiles:

| Asset | Type | Owner | Capital | Status |
|-------|------|-------|---------|--------|
| Bitcoin | Crypto | Dad | ฿800,000 | Demo |
| Gaming PC | Fixed | Son | ฿65,000 | Demo |
| PTT | Stock | Mom | ฿120,000 | Demo |
| ทองคำแท่ง | Gold | Mom | ฿190,000 | Demo |
| Monitor 27" | Fixed | Dad | ฿12,500 | Demo |

Delete data and add your own through the UI.

---

## 🚀 Usage

### Opening the App
```bash
# Just open in browser:
index.html
```

No build process, no dependencies, no backend server needed.

### Adding a Profile
1. Go to **Profiles** page
2. Click **"+ Add Profile"**
3. Enter name, initials, select avatar color
4. Click **Save**

### Adding an Asset
1. Click **"Add Asset"** button
2. **Step 1**: Select asset type
3. **Step 2**: Enter details (type-specific fields)
4. **Step 3**: Optionally upload evidence file
5. Click **Save**

### Switching Languages
- Click **EN** or **TH** in top-right corner
- Entire UI updates instantly

### Exporting Data
- Go to **Settings**
- Click **"Export data"**
- Downloads JSON file with all profiles and assets

### Clearing Data
- Go to **Settings**
- Click **"Clear all data"**
- ⚠️ Irreversible - downloads backup first!

---

## 🔒 Privacy & Security

- ✅ All data stored **locally** in browser (localStorage)
- ✅ No data sent to server
- ✅ No tracking or analytics
- ✅ No login required
- ⚠️ Data lost if browser cache is cleared
- 💡 **Tip**: Use **"Export data"** to backup regularly

---

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Flexbox, Grid, custom properties, animations
- **Vanilla JavaScript**: No frameworks or dependencies
- **localStorage API**: Client-side data persistence
- **FileReader API**: Image preview on upload

### Browser Support
- Chrome/Edge ✅
- Firefox ✅
- Safari ✅
- Mobile browsers ✅

### Performance
- Lightweight: ~2,500 lines total
- Fast load time (no network calls)
- Responsive animations (~60fps)
- Instant language switching

---

## 📝 Future Enhancements

Potential features to add:
- 📈 Real-time price updates (via API)
- 📊 Net worth charts and trends
- 🔔 Price alerts
- ☁️ Cloud backup/sync
- 📱 Mobile app (React Native)
- 🔐 Data encryption
- 👤 User authentication
- 🌐 Multi-language support (more languages)

---

## 📄 License

Open source. Use freely for personal or commercial projects.

---

## 🤝 Contributing

Feel free to fork, modify, and improve!

**To contribute:**
1. Make changes
2. Test in browser
3. Submit PR with description

---

## 📞 Support

Questions or issues?
- Check browser console for errors (F12)
- Verify localStorage isn't disabled
- Clear cache and reload if stuck
- Check that `/evidence/` folder exists for file uploads

---

**Happy tracking! 💰** 🎉
