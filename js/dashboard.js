/* ─────────────────────────────────────────
   dashboard.js  —  Asset dashboard logic
   ───────────────────────────────────────── */

let currentProfileId   = null;
let currentProfileName = "";
let assetImgB64        = null;
let allAssets          = [];   // cache for filter/search

// ── OPEN PROFILE DASHBOARD ────────────────
async function openProfile(id, name, role, avatar) {
  currentProfileId   = id;
  currentProfileName = name;

  // Update header
  document.getElementById("ph-name").textContent = name;
  document.getElementById("ph-role").textContent = role || t("familyMember");

  const av = document.getElementById("ph-avatar");
  av.innerHTML = avatar
    ? `<img src="${avatar}" alt="${escHtml(name)}" />`
    : initials(name);

  // Reset form
  resetAssetForm();

  // Switch screen
  showScreen("dashboard");
  applyLang();

  await loadAssets();
}

function goBack() {
  currentProfileId = null;
  allAssets        = [];
  showScreen("profiles");
  renderProfiles();
  applyLang();
}

// ── LOAD & RENDER ASSETS ──────────────────
async function loadAssets() {
  try {
    allAssets = await API.get(`/api/assets/${currentProfileId}`);
  } catch (e) {
    toast("Cannot load assets", "err");
    allAssets = [];
  }
  renderAssets();
  updateSummary();
}

function renderAssets() {
  const q   = document.getElementById("f-search").value.toLowerCase();
  const cat = document.getElementById("f-cat").value;

  const filtered = allAssets.filter(a =>
    (!q   || a.name.toLowerCase().includes(q) || (a.note || "").toLowerCase().includes(q)) &&
    (!cat || a.cat === cat)
  );

  document.getElementById("asset-count").textContent = `${filtered.length} ${t("assetsCount")}`;

  const grid = document.getElementById("assets-grid");

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="icon">📦</div>
        <p>${t("addAsset")}</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(a => {
    const net    = a.amount - a.expense;
    const imgHtml = a.img
      ? `<img class="asset-img" src="${a.img}" alt="${escHtml(a.name)}" />`
      : `<div class="asset-img-placeholder">📦</div>`;

    return `
      <div class="asset-card">
        <button class="asset-del" onclick="deleteAsset('${a.id}')">×</button>
        ${imgHtml}
        <div class="asset-body">
          <div class="asset-top">
            <div class="asset-name">${escHtml(a.name)}</div>
            <span class="cat-tag cat-${a.cat}">${getCatLabel(a.cat)}</span>
          </div>
          ${a.note ? `<div class="asset-note">${escHtml(a.note)}</div>` : ""}
          <div class="asset-nums">
            <div class="num-item">
              <div class="num-label" data-i18n="amount">${t("amount")}</div>
              <div class="num-val amt">${fmt(a.amount)}</div>
            </div>
            <div class="num-item">
              <div class="num-label" data-i18n="expense">${t("expense")}</div>
              <div class="num-val exp">${fmt(a.expense)}</div>
            </div>
            <div class="num-item">
              <div class="num-label" data-i18n="net">${t("net")}</div>
              <div class="num-val net ${net >= 0 ? "pos" : "neg"}">${fmt(net)}</div>
            </div>
          </div>
          <div class="asset-date">${a.date}</div>
        </div>
      </div>`;
  }).join("");
}

function getCatLabel(cat) {
  const map = { stock: "catStock", crypto: "catCrypto", property: "catProperty", cash: "catCash", other: "catOther" };
  return t(map[cat] || "catOther").replace(/^[^\s]+\s/, ""); // strip emoji for tag
}

// ── SUMMARY ───────────────────────────────
function updateSummary() {
  const tA  = allAssets.reduce((s, a) => s + a.amount,  0);
  const tE  = allAssets.reduce((s, a) => s + a.expense, 0);
  const net = tA - tE;

  document.getElementById("s-assets").textContent = fmt(tA);
  document.getElementById("s-exp").textContent    = fmt(tE);

  const netEl = document.getElementById("s-net");
  netEl.textContent  = fmt(net);
  netEl.style.color  = net >= 0 ? "var(--success)" : "var(--accent)";
}

// ── ADD ASSET ─────────────────────────────
async function addAsset() {
  const name    = document.getElementById("a-name").value.trim();
  const amount  = parseFloat(document.getElementById("a-amount").value)  || 0;
  const expense = parseFloat(document.getElementById("a-expense").value) || 0;
  const cat     = document.getElementById("a-cat").value;
  const note    = document.getElementById("a-note").value.trim();

  if (!name)                       { toast(t("nameRequired"),   "err"); return; }
  if (amount === 0 && expense === 0) { toast(t("amountRequired"), "err"); return; }

  try {
    const asset = await API.post(`/api/assets/${currentProfileId}`, {
      name, amount, expense, cat, note,
      img_b64: assetImgB64 || null
    });
    allAssets.unshift(asset);
    resetAssetForm();
    renderAssets();
    updateSummary();
    toast(t("assetAdded"), "ok");
  } catch (e) {
    toast("Save failed: " + e.message, "err");
  }
}

// ── DELETE ASSET ──────────────────────────
async function deleteAsset(id) {
  try {
    await API.del(`/api/assets/${currentProfileId}/${id}`);
    allAssets = allAssets.filter(a => a.id !== id);
    renderAssets();
    updateSummary();
    toast(t("deleted"));
  } catch (e) {
    toast("Delete failed", "err");
  }
}

// ── CLEAR ALL ASSETS ──────────────────────
async function clearAssets() {
  if (!confirm(t("clearConfirm"))) return;
  // Delete one by one
  try {
    for (const a of [...allAssets]) {
      await API.del(`/api/assets/${currentProfileId}/${a.id}`);
    }
    allAssets = [];
    renderAssets();
    updateSummary();
    toast(t("cleared"));
  } catch (e) {
    toast("Clear failed", "err");
  }
}

// ── EXPORT CSV ────────────────────────────
function exportCSV() {
  if (!allAssets.length) { toast(t("nothingExport"), "err"); return; }
  const rows = [[t("assetName"), t("categoryLabel"), t("amountLabel"), t("expenseLabel"), t("net"), t("noteLabel"), "Date"]];
  allAssets.forEach(a => rows.push([a.name, a.cat, a.amount, a.expense, a.amount - a.expense, a.note || "", a.date]));
  downloadCSV(rows, `${currentProfileName}_${new Date().toISOString().split("T")[0]}.csv`);
  toast(t("exported"), "ok");
}

// ── IMAGE UPLOAD (asset form) ─────────────
async function handleAssetImg(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    assetImgB64 = await fileToBase64(file);
    document.getElementById("img-label").textContent = "✓ " + file.name.slice(0, 22);
    document.getElementById("img-drop").classList.add("has-img");
  } catch (e) {
    toast("Image read failed", "err");
  }
}

// ── RESET FORM ────────────────────────────
function resetAssetForm() {
  ["a-name", "a-amount", "a-expense", "a-note"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("a-img").value   = "";
  document.getElementById("img-label").textContent = t("uploadImage");
  document.getElementById("img-drop").classList.remove("has-img");
  document.getElementById("f-search").value = "";
  document.getElementById("f-cat").value    = "";
  assetImgB64 = null;
}