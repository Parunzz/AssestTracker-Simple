/* ══════════════════════════════════════════
   DATA STORE
══════════════════════════════════════════ */
const DB = {
  get profiles() { return JSON.parse(localStorage.getItem('profiles') || '[]'); },
  set profiles(v){ localStorage.setItem('profiles', JSON.stringify(v)); },
  get assets()   { return JSON.parse(localStorage.getItem('assets')   || '[]'); },
  set assets(v)  { localStorage.setItem('assets',   JSON.stringify(v)); },
  get activeProfile() { return localStorage.getItem('activeProfile') || null; },
  set activeProfile(v){ localStorage.setItem('activeProfile', v); },
};

/* ── seed demo data if empty ── */
function seedData() {
  if (DB.profiles.length) return;
  DB.profiles = [
    { id:'p1', name:'Dad · พ่อ',      initials:'พ', color:'av-c1' },
    { id:'p2', name:'Mom · แม่',      initials:'ม', color:'av-c2' },
    { id:'p3', name:'Son · ลูกชาย',  initials:'ล', color:'av-c3' },
    { id:'p4', name:'Daughter · ลูกสาว', initials:'ด', color:'av-c4' },
  ];
  DB.assets = [
    { id:'a1', type:'crypto', name:'Bitcoin',    profileId:'p1', coin:'BTC', capital:800000,  buyprice:1600000, units:0.5,    date:'2024-01-15', exchange:'Bitkub',    evidence:'' },
    { id:'a2', type:'fixed',  name:'Gaming PC',  profileId:'p3', category:'pc', price:65000,  date:'2023-11-01', notes:'RTX4070', evidence:'' },
    { id:'a3', type:'stock',  name:'PTT',        profileId:'p2', ticker:'PTT', market:'SET', capital:120000, buyprice:40, units:3000, date:'2024-03-10', broker:'Settrade', evidence:'' },
    { id:'a4', type:'gold',   name:'ทองคำแท่ง', profileId:'p2', goldType:'baht_gold', capital:190000, buyprice:68000, units:2.79, date:'2024-02-20', shop:'ทองย่านรัตนโกสินทร์', evidence:'' },
    { id:'a5', type:'fixed',  name:'Monitor 27"',profileId:'p1', category:'monitor', price:12500, date:'2023-06-01', notes:'LG 27GP850', evidence:'' },
  ];
  DB.activeProfile = 'p1';
}
seedData();

/* ══════════════════════════════════════════
   I18N (INTERNATIONALIZATION)
══════════════════════════════════════════ */
const T = {
  en: {
    'nav.overview':'Overview','nav.dashboard':'Dashboard','nav.assets':'Assets','nav.reports':'Reports',
    'nav.manage':'Manage','nav.profiles':'Profiles','nav.settings':'Settings','nav.active':'Active','nav.switch':'Switch profile',
    'btn.addAsset':'Add Asset','btn.viewAll':'View all','btn.next':'Next →','btn.back':'Back',
    'btn.cancel':'Cancel','btn.save':'Save',
    'stat.netWorth':'Net worth','stat.realtime':'Realtime','stat.fixed':'Fixed assets','stat.items':'Total items',
    'stat.realtimeSub':'crypto · stock · gold','stat.fixedSub':'PC · monitors · devices','stat.itemsSub':'across profiles',
    'section.recent':'Recent assets','section.profiles':'Family profiles','section.breakdown':'Breakdown',
    'section.fixedDetails':'Fixed asset details','section.cryptoDetails':'Crypto details',
    'section.goldDetails':'Gold details','section.stockDetails':'Stock details','section.evidence':'Evidence / proof',
    'th.asset':'Asset','th.type':'Type','th.owner':'Owner','th.capital':'Capital (ทุน)',
    'th.buyPrice':'Buy price/unit','th.units':'Units','th.current':'Current','th.pl':'P&L','th.evidence':'Evidence',
    'type.fixed':'Fixed','type.realtime':'Realtime','type.crypto':'Crypto','type.gold':'Gold','type.stock':'Stock',
    'type.fixedSub':'PC, monitor','type.cryptoSub':'BTC, ETH…','type.goldSub':'สตางค์, บาท','type.stockSub':'Thai / US',
    'filter.all':'All','filter.fixed':'Fixed','filter.crypto':'Crypto','filter.gold':'Gold','filter.stock':'Stock',
    'field.owner':'Owner','field.name':'Asset name','field.category':'Category',
    'field.purchasePrice':'Purchase price (฿)','field.purchaseDate':'Date purchased','field.notes':'Notes / Serial no.',
    'field.coin':'Coin / Token','field.customSymbol':'Custom symbol','field.currency':'Currency used to buy',
    'field.capital':'ทุน (Capital invested)','field.priceAtBuy':'Price per unit at buy',
    'field.pricePerUnit':'Gold price per baht at buy','field.buyDate':'Date purchased',
    'field.exchange':'Exchange / Wallet','field.goldType':'Gold type','field.shop':'Shop',
    'field.market':'Market','field.ticker':'Ticker symbol','field.broker':'Broker',
    'field.displayName':'Display name','field.initials':'Initials','field.color':'Avatar color',
    'calc.units':'units you hold (auto-calculated)',
    'calc.goldUnits':'บาททอง / units (auto-calculated)',
    'calc.shares':'shares (auto-calculated)',
    'ev.text':'Click or drag image / PDF',
    'ev.sub':'Receipt, statement, screenshot',
    'ev.instruction':'Save the file to <code>evidence/</code> folder next to index.html. Filename is linked to this asset.',
    'step.type':'Type','step.details':'Details','step.evidence':'Evidence',
    'modal.addAsset':'Add Asset','modal.addProfile':'Add Profile','modal.editProfile':'Edit Profile',
    'settings.lang':'Language','settings.langLabel':'Display language',
    'settings.data':'Data','settings.exportLabel':'Export data','settings.exportSub':'Save all as JSON',
    'settings.clearLabel':'Clear all data','settings.clearSub':'Remove everything from localStorage',
    'settings.evidence':'Evidence folder','settings.evidenceSub':'Put image files in /evidence/ folder next to index.html',
    'empty.reports':'Net worth charts and history\ncoming soon',
    'page.dashboard':'Dashboard','page.assets':'Assets','page.reports':'Reports','page.profiles':'Profiles','page.settings':'Settings',
  },
  th: {
    'nav.overview':'ภาพรวม','nav.dashboard':'แดชบอร์ด','nav.assets':'ทรัพย์สิน','nav.reports':'รายงาน',
    'nav.manage':'จัดการ','nav.profiles':'โปรไฟล์','nav.settings':'ตั้งค่า','nav.active':'ใช้งานอยู่','nav.switch':'เปลี่ยนโปรไฟล์',
    'btn.addAsset':'เพิ่มทรัพย์สิน','btn.viewAll':'ดูทั้งหมด','btn.next':'ถัดไป →','btn.back':'ย้อนกลับ',
    'btn.cancel':'ยกเลิก','btn.save':'บันทึก',
    'stat.netWorth':'มูลค่าสุทธิ','stat.realtime':'Realtime','stat.fixed':'สินทรัพย์คงที่','stat.items':'จำนวนรายการ',
    'stat.realtimeSub':'คริปโต · หุ้น · ทอง','stat.fixedSub':'PC · จอ · อุปกรณ์','stat.itemsSub':'หลายโปรไฟล์',
    'section.recent':'ทรัพย์สินล่าสุด','section.profiles':'สมาชิกในครอบครัว','section.breakdown':'สัดส่วน',
    'section.fixedDetails':'ข้อมูลสินทรัพย์คงที่','section.cryptoDetails':'ข้อมูลคริปโต',
    'section.goldDetails':'ข้อมูลทองคำ','section.stockDetails':'ข้อมูลหุ้น','section.evidence':'หลักฐาน',
    'th.asset':'ทรัพย์สิน','th.type':'ประเภท','th.owner':'เจ้าของ','th.capital':'ทุน',
    'th.buyPrice':'ราคาต่อหน่วย','th.units':'จำนวน','th.current':'มูลค่าปัจจุบัน','th.pl':'กำไร/ขาดทุน','th.evidence':'หลักฐาน',
    'type.fixed':'คงที่','type.realtime':'Realtime','type.crypto':'คริปโต','type.gold':'ทองคำ','type.stock':'หุ้น',
    'type.fixedSub':'PC, จอ','type.cryptoSub':'BTC, ETH…','type.goldSub':'สตางค์, บาท','type.stockSub':'ไทย / US',
    'filter.all':'ทั้งหมด','filter.fixed':'คงที่','filter.crypto':'คริปโต','filter.gold':'ทอง','filter.stock':'หุ้น',
    'field.owner':'เจ้าของ','field.name':'ชื่อทรัพย์สิน','field.category':'หมวดหมู่',
    'field.purchasePrice':'ราคาที่ซื้อ (฿)','field.purchaseDate':'วันที่ซื้อ','field.notes':'หมายเหตุ / หมายเลขเครื่อง',
    'field.coin':'เหรียญ','field.customSymbol':'สัญลักษณ์','field.currency':'สกุลเงินที่ใช้ซื้อ',
    'field.capital':'ทุน (เงินที่ลงทุน)','field.priceAtBuy':'ราคาต่อหน่วยตอนซื้อ',
    'field.pricePerUnit':'ราคาทองต่อบาท ณ วันซื้อ','field.buyDate':'วันที่ซื้อ',
    'field.exchange':'กระดาน / กระเป๋า','field.goldType':'ประเภททอง','field.shop':'ร้านทอง',
    'field.market':'ตลาด','field.ticker':'ชื่อหุ้น (Ticker)','field.broker':'โบรกเกอร์',
    'field.displayName':'ชื่อที่แสดง','field.initials':'ตัวย่อ (1–2 ตัว)','field.color':'สีโปรไฟล์',
    'calc.units':'จำนวนเหรียญที่ได้ (คำนวณอัตโนมัติ)',
    'calc.goldUnits':'บาททองที่ได้ (คำนวณอัตโนมัติ)',
    'calc.shares':'จำนวนหุ้นที่ได้ (คำนวณอัตโนมัติ)',
    'ev.text':'คลิกหรือลากไฟล์ภาพ / PDF',
    'ev.sub':'ใบเสร็จ, Statement, Screenshot',
    'ev.instruction':'บันทึกไฟล์ไว้ที่โฟลเดอร์ <code>evidence/</code> ข้าง index.html ชื่อไฟล์จะถูกเชื่อมกับรายการนี้',
    'step.type':'ประเภท','step.details':'รายละเอียด','step.evidence':'หลักฐาน',
    'modal.addAsset':'เพิ่มทรัพย์สิน','modal.addProfile':'เพิ่มโปรไฟล์','modal.editProfile':'แก้ไขโปรไฟล์',
    'settings.lang':'ภาษา','settings.langLabel':'ภาษาที่แสดง',
    'settings.data':'ข้อมูล','settings.exportLabel':'ส่งออกข้อมูล','settings.exportSub':'บันทึกข้อมูลทั้งหมดเป็น JSON',
    'settings.clearLabel':'ลบข้อมูลทั้งหมด','settings.clearSub':'ลบข้อมูลออกจาก localStorage',
    'settings.evidence':'โฟลเดอร์หลักฐาน','settings.evidenceSub':'ใส่ไฟล์รูปภาพในโฟลเดอร์ /evidence/ ข้าง index.html',
    'empty.reports':'กราฟและประวัติมูลค่าสุทธิ\nจะอยู่ที่นี่เร็วๆ นี้',
    'page.dashboard':'แดชบอร์ด','page.assets':'ทรัพย์สิน','page.reports':'รายงาน','page.profiles':'โปรไฟล์','page.settings':'ตั้งค่า',
  }
};
let lang = 'en';
function t(k){ return T[lang][k] || T['en'][k] || k; }
function setLang(l) {
  lang = l;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll(`.lang-btn[onclick="setLang('${l}')"]`).forEach(b => b.classList.add('active'));
  document.documentElement.lang = l === 'th' ? 'th' : 'en';
  document.querySelectorAll('[data-i]').forEach(el => {
    const k = el.getAttribute('data-i');
    if (el.tagName === 'INPUT' || el.tagName === 'SELECT') return;
    if (T[l][k]) el.innerHTML = T[l][k];
  });
  renderAll();
}

/* ══════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════ */
const PAGE_NAMES = ['dashboard','assets','reports','profiles','settings'];
function showPage(id) {
  PAGE_NAMES.forEach(p => {
    const el = document.getElementById('page-'+p);
    if (el) el.style.display = p === id ? '' : 'none';
  });
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === id);
  });
  document.getElementById('page-title').textContent = t('page.'+id);
  if (id === 'dashboard') renderDashboard();
  if (id === 'assets')    renderAssets();
  if (id === 'profiles')  renderProfiles();
}

// wire nav buttons
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', () => showPage(el.dataset.page));
});

/* ══════════════════════════════════════════
   RENDER HELPERS
══════════════════════════════════════════ */
const fmt = n => '฿' + Number(n).toLocaleString('th-TH', {maximumFractionDigits:0});
const fmtU = (n, d=4) => Number(n).toLocaleString('en', {maximumFractionDigits:d, minimumFractionDigits:0});

function getProfile(id) { return DB.profiles.find(p => p.id === id) || {}; }

function typeBadge(type) {
  const map = {
    fixed:  ['b-fixed',  t('type.fixed')],
    crypto: ['b-crypto', t('type.crypto')],
    gold:   ['b-gold',   t('type.gold')],
    stock:  ['b-stock',  t('type.stock')],
  };
  const [cls, label] = map[type] || ['b-fixed', type];
  return `<span class="badge ${cls}">${label}</span>`;
}

function plHtml(capital, currentVal) {
  if (!currentVal && currentVal !== 0) return `<span class="neu mono">—</span>`;
  const pl = currentVal - capital;
  const pct = capital ? ((pl/capital)*100).toFixed(1) : 0;
  const cls = pl >= 0 ? 'up' : 'dn';
  const sign = pl >= 0 ? '+' : '';
  return `<span class="${cls} mono">${sign}${fmt(pl)}<br><span style="font-size:11px">${sign}${pct}%</span></span>`;
}

function evidenceHtml(filename) {
  if (!filename) return `<span class="ev-none">—</span>`;
  const ext = filename.split('.').pop().toLowerCase();
  const isImg = ['jpg','jpeg','png','gif','webp'].includes(ext);
  if (isImg) {
    return `<img class="ev-thumb" src="evidence/${filename}" alt="evidence" onerror="this.style.display='none';this.nextSibling.style.display=''" onclick="window.open('evidence/${filename}')"><span class="ev-none" style="display:none">📎</span>`;
  }
  return `<a href="evidence/${filename}" target="_blank" style="color:var(--blue);font-size:12px">📎 ${filename}</a>`;
}

function assetRow(a, full=false) {
  const p = getProfile(a.profileId);
  const currentVal = a.type === 'fixed' ? a.price : null; // live price placeholder
  const capital = a.type === 'fixed' ? a.price : a.capital;
  const unitsStr = a.units ? fmtU(a.units) + (a.type==='gold'?' บาท':a.type==='crypto'?' '+a.coin:' หุ้น') : '—';
  const icons = { fixed:'🖥', crypto:'₿', gold:'🪙', stock:'📈' };
  return `<tr>
    <td><span class="asset-icon">${icons[a.type]||'◇'}</span><strong>${a.name}</strong></td>
    <td>${typeBadge(a.type)}</td>
    <td><div style="display:flex;align-items:center;gap:7px"><div class="av av-sm ${p.color||'av-c1'}">${p.initials||'?'}</div>${p.name||'—'}</div></td>
    <td class="mono">${fmt(capital)}</td>
    ${full ? `<td class="mono">${a.buyprice ? fmt(a.buyprice) : '—'}</td><td class="mono">${unitsStr}</td>` : ''}
    <td class="mono neu">${currentVal ? fmt(currentVal) : '<span style="color:var(--dimmed)">live…</span>'}</td>
    <td>${plHtml(capital, currentVal)}</td>
    <td>${evidenceHtml(a.evidence)}</td>
    <td>
      <div style="display:flex;gap:4px">
        <button class="btn-icon" onclick="editAsset('${a.id}')" title="Edit">✎</button>
        <button class="btn-icon" onclick="deleteAsset('${a.id}')" title="Delete" style="color:var(--red)">✕</button>
      </div>
    </td>
  </tr>`;
}

/* ══════════════════════════════════════════
   RENDER PAGES
══════════════════════════════════════════ */
function renderDashboard() {
  const tbody = document.getElementById('dash-tbody');
  if (!tbody) return;
  const assets = DB.assets.slice(-5).reverse();
  tbody.innerHTML = assets.length ? assets.map(a => assetRow(a, false)).join('') :
    `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--muted)">No assets yet</td></tr>`;

  const profilesEl = document.getElementById('dash-profiles');
  if (profilesEl) {
    const profs = DB.profiles;
    if (!profs.length) { profilesEl.innerHTML = '<div class="empty"><div class="empty-icon">◎</div><p>No profiles yet</p></div>'; return; }
    profilesEl.innerHTML = profs.map(p => {
      const count = DB.assets.filter(a => a.profileId === p.id).length;
      const total = DB.assets.filter(a => a.profileId === p.id).reduce((s,a) => s + (a.type==='fixed' ? a.price : a.capital), 0);
      const isActive = p.id === DB.activeProfile;
      return `<div class="p-row" onclick="switchProfile('${p.id}')">
        <div class="av av-md ${p.color}">${p.initials}</div>
        <div class="p-info flex:1">
          <div class="p-name">${p.name}</div>
          <div class="p-meta">${count} ${t('th.asset')} · ${fmt(total)}</div>
        </div>
        ${isActive ? `<span class="badge b-active">${t('nav.active')}</span>` : ''}
      </div>`;
    }).join('');
  }
}

function renderAssets() {
  const tbody = document.getElementById('assets-tbody');
  if (!tbody) return;
  const filter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const assets = filter === 'all' ? DB.assets : DB.assets.filter(a => a.type === filter);
  tbody.innerHTML = assets.length ? assets.map(a => assetRow(a, true)).join('') :
    `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--muted)">No assets</td></tr>`;
}

function renderProfiles() {
  const grid = document.getElementById('profiles-grid');
  if (!grid) return;
  const icons = {fixed:'🖥',crypto:'₿',gold:'🪙',stock:'📈'};
  grid.innerHTML = DB.profiles.map((p, i) => {
    const count = DB.assets.filter(a => a.profileId === p.id).length;
    const total = DB.assets.filter(a => a.profileId === p.id).reduce((s,a) => s + (a.type==='fixed' ? a.price : a.capital), 0);
    return `<div class="profile-card" style="animation-delay:${i*0.06}s">
      <div class="av av-lg ${p.color}">${p.initials}</div>
      <div class="pc-name">${p.name}</div>
      <div class="pc-meta">${count} assets</div>
      <div class="pc-worth">${fmt(total)}</div>
      <div class="pc-actions">
        <button class="btn btn-ghost btn-sm" onclick="editProfile('${p.id}')">✎ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProfile('${p.id}')">✕</button>
      </div>
    </div>`;
  }).join('') + `
    <div class="profile-card add-profile-card" onclick="openProfileModal()">
      <div class="ap-icon">+</div>
      <div>${t('modal.addProfile')}</div>
    </div>`;
}

function renderAll() {
  renderDashboard();
  renderAssets();
  renderProfiles();
  // update sidebar
  const ap = getProfile(DB.activeProfile);
  if (ap.name) {
    document.getElementById('sidebar-name').textContent = ap.name;
    document.getElementById('sidebar-avatar').textContent = ap.initials || '?';
    document.getElementById('sidebar-avatar').className = `av av-sm ${ap.color}`;
  }
  // repopulate owner dropdown
  const sel = document.getElementById('f-owner');
  if (sel) {
    sel.innerHTML = DB.profiles.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  }
}

/* ══════════════════════════════════════════
   FILTER BUTTONS
══════════════════════════════════════════ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAssets();
  });
});

/* ══════════════════════════════════════════
   PROFILE ACTIONS
══════════════════════════════════════════ */
function switchProfile(id) { DB.activeProfile = id; renderAll(); }

let editingProfileId = null;
let selectedColor = 'av-c1';

function openProfileModal(id) {
  editingProfileId = id || null;
  selectedColor = 'av-c1';
  const overlay = document.getElementById('overlay-profile');
  const p = id ? getProfile(id) : null;
  document.getElementById('pm-title').textContent = p ? t('modal.editProfile') : t('modal.addProfile');
  document.getElementById('pm-name').value = p ? p.name : '';
  document.getElementById('pm-initials').value = p ? p.initials : '';
  if (p) {
    selectedColor = p.color;
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === p.color));
  } else {
    document.querySelectorAll('.color-swatch').forEach((s,i) => s.classList.toggle('selected', i===0));
  }
  overlay.style.display = 'flex';
}
function closeProfileModal() { document.getElementById('overlay-profile').style.display = 'none'; }
function selectColor(el) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedColor = el.dataset.color;
}
function saveProfile() {
  const name = document.getElementById('pm-name').value.trim();
  const initials = document.getElementById('pm-initials').value.trim();
  if (!name) return;
  const profs = DB.profiles;
  if (editingProfileId) {
    const idx = profs.findIndex(p => p.id === editingProfileId);
    if (idx > -1) profs[idx] = { ...profs[idx], name, initials, color: selectedColor };
  } else {
    profs.push({ id: 'p'+Date.now(), name, initials: initials || name[0], color: selectedColor });
  }
  DB.profiles = profs;
  closeProfileModal();
  renderAll();
  if (document.getElementById('page-profiles').style.display !== 'none') renderProfiles();
}
function editProfile(id)   { openProfileModal(id); }
function deleteProfile(id) {
  if (!confirm('Delete this profile? Their assets will remain.')) return;
  DB.profiles = DB.profiles.filter(p => p.id !== id);
  renderAll();
}

/* ══════════════════════════════════════════
   ASSET MODAL STATE
══════════════════════════════════════════ */
let mStep = 1;
let mType = 'fixed';
let mEditId = null;
let mEvidenceFilename = '';

function openAssetModal(editId) {
  mStep = 1; mType = 'fixed'; mEditId = editId || null; mEvidenceFilename = '';
  // populate owner dropdown
  const sel = document.getElementById('f-owner');
  sel.innerHTML = DB.profiles.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  // fill if editing
  if (editId) {
    const a = DB.assets.find(x => x.id === editId);
    if (a) {
      mType = a.type;
      sel.value = a.profileId;
      document.getElementById('f-name').value = a.name;
      if (a.type === 'fixed') {
        document.getElementById('f-category').value = a.category || 'pc';
        document.getElementById('f-fixed-price').value = a.price || '';
        document.getElementById('f-fixed-date').value = a.date || '';
        document.getElementById('f-fixed-notes').value = a.notes || '';
      } else if (a.type === 'crypto') {
        document.getElementById('f-coin').value = a.coin || 'BTC';
        document.getElementById('f-crypto-capital').value = a.capital || '';
        document.getElementById('f-crypto-buyprice').value = a.buyprice || '';
        document.getElementById('f-crypto-date').value = a.date || '';
        document.getElementById('f-crypto-exchange').value = a.exchange || '';
      } else if (a.type === 'gold') {
        document.getElementById('f-gold-type').value = a.goldType || 'baht_gold';
        document.getElementById('f-gold-capital').value = a.capital || '';
        document.getElementById('f-gold-buyprice').value = a.buyprice || '';
        document.getElementById('f-gold-date').value = a.date || '';
        document.getElementById('f-gold-shop').value = a.shop || '';
      } else if (a.type === 'stock') {
        document.getElementById('f-stock-market').value = a.market || 'SET';
        document.getElementById('f-stock-ticker').value = a.ticker || '';
        document.getElementById('f-stock-capital').value = a.capital || '';
        document.getElementById('f-stock-buyprice').value = a.buyprice || '';
        document.getElementById('f-stock-date').value = a.date || '';
        document.getElementById('f-stock-broker').value = a.broker || '';
      }
      mEvidenceFilename = a.evidence || '';
    }
  } else {
    // clear fields
    ['f-name','f-fixed-price','f-fixed-notes','f-crypto-capital','f-crypto-buyprice','f-crypto-exchange',
     'f-gold-capital','f-gold-buyprice','f-gold-shop','f-stock-ticker','f-stock-capital','f-stock-buyprice','f-stock-broker'].forEach(id => {
       const el = document.getElementById(id); if(el) el.value = '';
     });
  }
  selType(mType);
  updateStepUI();
  document.getElementById('overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  clearEvidence();
}
function overlayClick(e) { if (e.target === document.getElementById('overlay')) closeModal(); }

function selType(type) {
  mType = type;
  ['fixed','crypto','gold','stock'].forEach(t => {
    document.getElementById('tc-'+t).classList.toggle('sel', t === type);
  });
}

function updateStepUI() {
  const s = mStep;
  // steps indicator
  ['1','2','3'].forEach(n => {
    const el = document.getElementById('si-'+n);
    el.classList.toggle('on', parseInt(n) === s);
    el.classList.toggle('done', parseInt(n) < s);
  });
  // step panels
  document.getElementById('modal-s1').style.display = s === 1 ? '' : 'none';
  ['fixed','crypto','gold','stock'].forEach(tp => {
    document.getElementById('modal-s2-'+tp).style.display = (s === 2 && mType === tp) ? '' : 'none';
  });
  document.getElementById('modal-s3').style.display = s === 3 ? '' : 'none';
  // buttons
  document.getElementById('btn-back').style.display = s > 1 ? '' : 'none';
  const nextBtn = document.getElementById('btn-next');
  nextBtn.innerHTML = s === 3
    ? `<span data-i="btn.save">${t('btn.save')}</span>`
    : `<span data-i="btn.next">${t('btn.next')}</span>`;
  // modal title
  document.getElementById('modal-title').textContent = mEditId ? t('modal.addAsset') : t('modal.addAsset');
}

function modalNext() {
  if (mStep === 1) {
    const name = document.getElementById('f-name').value.trim();
    if (!name) { document.getElementById('f-name').focus(); return; }
    mStep = 2;
  } else if (mStep === 2) {
    mStep = 3;
  } else {
    saveAsset();
    return;
  }
  updateStepUI();
}
function modalBack() {
  if (mStep > 1) { mStep--; updateStepUI(); }
}

/* ══════════════════════════════════════════
   CALC UNITS
══════════════════════════════════════════ */
function calcUnits(type) {
  const capital  = parseFloat(document.getElementById('f-'+type+'-capital').value) || 0;
  const buyprice = parseFloat(document.getElementById('f-'+type+'-buyprice').value) || 0;
  const box = document.getElementById('calc-'+type);
  if (capital > 0 && buyprice > 0) {
    const units = capital / buyprice;
    const label = type === 'gold' ? 'บาท' : type === 'stock' ? 'หุ้น' : (document.getElementById('f-coin')?.value || 'units');
    box.innerHTML = `<span>${fmtU(units, type==='stock'?0:6)} ${label}</span> <span style="color:var(--muted);font-size:11px;font-family:var(--font)">${t('calc.'+( type==='gold'?'goldUnits':type==='stock'?'shares':'units'))}</span>`;
  } else {
    const labelKey = type === 'gold' ? 'calc.goldUnits' : type === 'stock' ? 'calc.shares' : 'calc.units';
    box.innerHTML = `<span>—</span> <span style="color:var(--muted);font-size:11px;font-family:var(--font)">${t(labelKey)}</span>`;
  }
}

/* ══════════════════════════════════════════
   EVIDENCE
══════════════════════════════════════════ */
function handleEvidence(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  mEvidenceFilename = file.name;
  const zone = document.getElementById('ev-zone');
  const preview = document.getElementById('ev-preview');
  zone.style.display = 'none';
  preview.style.display = 'flex';
  document.getElementById('ev-fname').textContent = file.name;
  document.getElementById('ev-size').textContent = (file.size/1024).toFixed(1) + ' KB';
  const img = document.getElementById('ev-preview-img');
  if (file.type.startsWith('image/')) {
    const r = new FileReader();
    r.onload = e => { img.src = e.target.result; img.style.display = ''; };
    r.readAsDataURL(file);
  } else {
    img.style.display = 'none';
  }
}
function clearEvidence() {
  mEvidenceFilename = '';
  document.getElementById('f-evidence').value = '';
  document.getElementById('ev-zone').style.display = '';
  document.getElementById('ev-preview').style.display = 'none';
  document.getElementById('ev-preview-img').src = '';
}

/* ══════════════════════════════════════════
   SAVE ASSET
══════════════════════════════════════════ */
function saveAsset() {
  const name = document.getElementById('f-name').value.trim();
  const profileId = document.getElementById('f-owner').value;
  let asset = { id: mEditId || 'a'+Date.now(), type: mType, name, profileId, evidence: mEvidenceFilename };

  if (mType === 'fixed') {
    asset.category = document.getElementById('f-category').value;
    asset.price    = parseFloat(document.getElementById('f-fixed-price').value) || 0;
    asset.date     = document.getElementById('f-fixed-date').value;
    asset.notes    = document.getElementById('f-fixed-notes').value;
  } else if (mType === 'crypto') {
    const coin = document.getElementById('f-coin').value;
    asset.coin     = coin === 'OTHER' ? document.getElementById('f-coin-custom').value : coin;
    asset.currency = document.getElementById('f-crypto-currency').value;
    asset.capital  = parseFloat(document.getElementById('f-crypto-capital').value) || 0;
    asset.buyprice = parseFloat(document.getElementById('f-crypto-buyprice').value) || 0;
    asset.units    = asset.buyprice ? asset.capital / asset.buyprice : 0;
    asset.date     = document.getElementById('f-crypto-date').value;
    asset.exchange = document.getElementById('f-crypto-exchange').value;
  } else if (mType === 'gold') {
    asset.goldType = document.getElementById('f-gold-type').value;
    asset.capital  = parseFloat(document.getElementById('f-gold-capital').value) || 0;
    asset.buyprice = parseFloat(document.getElementById('f-gold-buyprice').value) || 0;
    asset.units    = asset.buyprice ? asset.capital / asset.buyprice : 0;
    asset.date     = document.getElementById('f-gold-date').value;
    asset.shop     = document.getElementById('f-gold-shop').value;
  } else if (mType === 'stock') {
    asset.market   = document.getElementById('f-stock-market').value;
    asset.ticker   = document.getElementById('f-stock-ticker').value.toUpperCase();
    asset.capital  = parseFloat(document.getElementById('f-stock-capital').value) || 0;
    asset.buyprice = parseFloat(document.getElementById('f-stock-buyprice').value) || 0;
    asset.units    = asset.buyprice ? asset.capital / asset.buyprice : 0;
    asset.date     = document.getElementById('f-stock-date').value;
    asset.broker   = document.getElementById('f-stock-broker').value;
  }

  const assets = DB.assets;
  if (mEditId) {
    const idx = assets.findIndex(a => a.id === mEditId);
    if (idx > -1) assets[idx] = asset;
  } else {
    assets.push(asset);
  }
  DB.assets = assets;

  if (mEvidenceFilename) {
    const msg = lang === 'th'
      ? `บันทึกสำเร็จ!\n\nอย่าลืมบันทึกไฟล์ "${mEvidenceFilename}" ไว้ที่โฟลเดอร์ evidence/ ข้าง index.html`
      : `Saved!\n\nDon't forget to copy "${mEvidenceFilename}" into the evidence/ folder next to index.html.`;
    alert(msg);
  }

  closeModal();
  renderAll();
  showPage(document.querySelector('.nav-btn.active')?.dataset.page || 'dashboard');
}

/* ══════════════════════════════════════════
   DELETE / EDIT ASSET
══════════════════════════════════════════ */
function deleteAsset(id) {
  if (!confirm('Delete this asset?')) return;
  DB.assets = DB.assets.filter(a => a.id !== id);
  renderAll();
}
function editAsset(id) { openAssetModal(id); }

/* ══════════════════════════════════════════
   MISC
══════════════════════════════════════════ */
// coin custom field toggle
document.getElementById('f-coin').addEventListener('change', function() {
  document.getElementById('f-coin-custom-wrap').style.display = this.value === 'OTHER' ? '' : 'none';
});

function exportData() {
  const data = { profiles: DB.profiles, assets: DB.assets };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'family-assets-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
}

/* ══════════════════════════════════════════
   INIT
══════════════════════════════════════════ */
renderAll();
