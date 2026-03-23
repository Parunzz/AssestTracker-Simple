/* ─────────────────────────────────────────
   lang.js  —  Thai / English translations
   ───────────────────────────────────────── */

const LANG = {
  en: {
    // App
    appName:        "family.assets",
    allProfiles:    "← All Profiles",

    // Profiles screen
    whoTracking:    "Who's tracking?",
    selectProfile:  "Select a profile to manage their assets.",
    addProfile:     "Add Profile",
    assets:         "assets",

    // Profile modal
    newProfile:     "New Profile",
    uploadPhoto:    "📷 Upload Photo",
    optional:       "Optional",
    fullName:       "Full Name *",
    namePlaceholder:"e.g. Dad, Mom, Somchai…",
    roleLabel:      "Role / Relation",
    rolePlaceholder:"e.g. Father, Mother, Son…",
    cancel:         "Cancel",
    create:         "Create",
    deleteProfileConfirm: "Delete this profile and ALL their assets?",

    // Dashboard
    totalAssets:    "Total Assets",
    totalExpenses:  "Total Expenses",
    netValue:       "Net Value",
    familyMember:   "Family Member",

    // Add asset form
    addAsset:       "+ Add Asset",
    assetName:      "Asset Name",
    assetNamePH:    "e.g. Gold, Condo, BTC…",
    amountLabel:    "Amount (฿)",
    expenseLabel:   "Expense (฿)",
    categoryLabel:  "Category",
    noteLabel:      "Note (optional)",
    notePH:         "Short description…",
    imageLabel:     "Image (optional)",
    uploadImage:    "📷 Upload image",
    addBtn:         "Add",

    // Categories
    catStock:       "📈 Stock",
    catCrypto:      "₿ Crypto",
    catProperty:    "🏠 Property",
    catCash:        "💵 Cash",
    catOther:       "📦 Other",

    // Filter
    searchPH:       "Search assets…",
    allCats:        "All Categories",
    assetsCount:    "assets",

    // Asset card
    amount:         "Amount",
    expense:        "Expense",
    net:            "Net",

    // Actions
    exportCSV:      "⬇ Export CSV",
    clearAll:       "🗑 Clear All",
    clearConfirm:   "Delete ALL assets for this profile?",

    // Toast messages
    nameRequired:   "Name is required!",
    amountRequired: "Enter amount or expense!",
    profileCreated: "Profile created!",
    profileDeleted: "Profile deleted.",
    assetAdded:     "Asset added!",
    deleted:        "Deleted.",
    cleared:        "Cleared.",
    exported:       "Exported!",
    nothingExport:  "Nothing to export!",
  },

  th: {
    // App
    appName:        "สินทรัพย์ครอบครัว",
    allProfiles:    "← โปรไฟล์ทั้งหมด",

    // Profiles screen
    whoTracking:    "ใครกำลังติดตาม?",
    selectProfile:  "เลือกโปรไฟล์เพื่อจัดการสินทรัพย์",
    addProfile:     "เพิ่มโปรไฟล์",
    assets:         "รายการ",

    // Profile modal
    newProfile:     "โปรไฟล์ใหม่",
    uploadPhoto:    "📷 อัปโหลดรูป",
    optional:       "ไม่บังคับ",
    fullName:       "ชื่อ *",
    namePlaceholder:"เช่น พ่อ แม่ สมชาย…",
    roleLabel:      "บทบาท / ความสัมพันธ์",
    rolePlaceholder:"เช่น พ่อ แม่ ลูกชาย…",
    cancel:         "ยกเลิก",
    create:         "สร้าง",
    deleteProfileConfirm: "ลบโปรไฟล์นี้และสินทรัพย์ทั้งหมด?",

    // Dashboard
    totalAssets:    "สินทรัพย์รวม",
    totalExpenses:  "ค่าใช้จ่ายรวม",
    netValue:       "มูลค่าสุทธิ",
    familyMember:   "สมาชิกครอบครัว",

    // Add asset form
    addAsset:       "+ เพิ่มสินทรัพย์",
    assetName:      "ชื่อสินทรัพย์",
    assetNamePH:    "เช่น ทองคำ คอนโด BTC…",
    amountLabel:    "มูลค่า (฿)",
    expenseLabel:   "ค่าใช้จ่าย (฿)",
    categoryLabel:  "หมวดหมู่",
    noteLabel:      "หมายเหตุ (ไม่บังคับ)",
    notePH:         "คำอธิบายสั้นๆ…",
    imageLabel:     "รูปภาพ (ไม่บังคับ)",
    uploadImage:    "📷 อัปโหลดรูป",
    addBtn:         "เพิ่ม",

    // Categories
    catStock:       "📈 หุ้น",
    catCrypto:      "₿ คริปโต",
    catProperty:    "🏠 อสังหาริมทรัพย์",
    catCash:        "💵 เงินสด",
    catOther:       "📦 อื่นๆ",

    // Filter
    searchPH:       "ค้นหาสินทรัพย์…",
    allCats:        "ทุกหมวดหมู่",
    assetsCount:    "รายการ",

    // Asset card
    amount:         "มูลค่า",
    expense:        "ค่าใช้จ่าย",
    net:            "สุทธิ",

    // Actions
    exportCSV:      "⬇ ส่งออก CSV",
    clearAll:       "🗑 ล้างทั้งหมด",
    clearConfirm:   "ลบสินทรัพย์ทั้งหมดของโปรไฟล์นี้?",

    // Toast messages
    nameRequired:   "กรุณากรอกชื่อ!",
    amountRequired: "กรุณากรอกมูลค่าหรือค่าใช้จ่าย!",
    profileCreated: "สร้างโปรไฟล์แล้ว!",
    profileDeleted: "ลบโปรไฟล์แล้ว",
    assetAdded:     "เพิ่มสินทรัพย์แล้ว!",
    deleted:        "ลบแล้ว",
    cleared:        "ล้างแล้ว",
    exported:       "ส่งออกแล้ว!",
    nothingExport:  "ไม่มีข้อมูลให้ส่งออก!",
  }
};

// Active language (persisted)
let currentLang = localStorage.getItem("lang") || "en";

function t(key) {
  return LANG[currentLang][key] || LANG["en"][key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  applyLang();
}

function toggleLang() {
  setLang(currentLang === "en" ? "th" : "en");
}

// Update all [data-i18n] elements
function applyLang() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const attr = el.getAttribute("data-i18n-attr");
    if (attr) {
      el.setAttribute(attr, t(key));
    } else {
      el.textContent = t(key);
    }
  });

  // Update lang toggle button label
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = currentLang === "en" ? "🇹🇭 ภาษาไทย" : "🇬🇧 English";
}