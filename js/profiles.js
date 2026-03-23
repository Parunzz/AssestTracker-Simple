/* ─────────────────────────────────────────
   profiles.js  —  Profile screen logic
   ───────────────────────────────────────── */

let newAvatarB64 = null;

// ── RENDER PROFILES ───────────────────────
async function renderProfiles() {
  let profiles;
  try {
    profiles = await API.get("/api/profiles");
  } catch (e) {
    toast("Cannot reach server!", "err");
    return;
  }

  const grid = document.getElementById("profiles-grid");
  let html = "";

  for (const p of profiles) {
    let assets = [];
    try { assets = await API.get(`/api/assets/${p.id}`); } catch (_) {}

    const net       = assets.reduce((s, a) => s + (a.amount - a.expense), 0);
    const avatarHtml = p.avatar
      ? `<img src="${p.avatar}" alt="${escHtml(p.name)}" />`
      : initials(p.name);

    html += `
      <div class="profile-card" onclick="openProfile('${p.id}', '${escHtml(p.name)}', '${escHtml(p.role || "")}', '${p.avatar || ""}')">
        <button class="profile-del" onclick="event.stopPropagation(); deleteProfile('${p.id}')">×</button>
        <div class="profile-avatar">${avatarHtml}</div>
        <div class="profile-name">${escHtml(p.name)}</div>
        <div class="profile-role">${escHtml(p.role || t("familyMember"))}</div>
        <div class="profile-stats">
          ${assets.length} ${t("assets")} · <strong>${fmt(net)}</strong>
        </div>
      </div>`;
  }

  // Add profile card
  html += `
    <div class="profile-add" onclick="openProfileModal()">
      <div class="icon">＋</div>
      <span data-i18n="addProfile">${t("addProfile")}</span>
    </div>`;

  grid.innerHTML = html;
}

// ── OPEN PROFILE MODAL ────────────────────
function openProfileModal() {
  newAvatarB64 = null;
  document.getElementById("new-avatar-preview").innerHTML = "?";
  document.getElementById("np-name").value = "";
  document.getElementById("np-role").value = "";
  document.getElementById("modal-profile").classList.add("open");
  setTimeout(() => document.getElementById("np-name").focus(), 100);
}

function closeProfileModal() {
  document.getElementById("modal-profile").classList.remove("open");
}

// ── AVATAR UPLOAD (modal) ─────────────────
async function handleAvatarUpload(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    newAvatarB64 = await fileToBase64(file);
    document.getElementById("new-avatar-preview").innerHTML =
      `<img src="${newAvatarB64}" style="width:100%;height:100%;object-fit:cover;" />`;
  } catch (e) {
    toast("Image read failed", "err");
  }
}

// ── SAVE PROFILE ──────────────────────────
async function saveProfile() {
  const name = document.getElementById("np-name").value.trim();
  if (!name) { toast(t("nameRequired"), "err"); return; }

  try {
    await API.post("/api/profiles", {
      name,
      role:       document.getElementById("np-role").value.trim(),
      avatar_b64: newAvatarB64 || null
    });
    closeProfileModal();
    renderProfiles();
    toast(t("profileCreated"), "ok");
  } catch (e) {
    toast("Save failed: " + e.message, "err");
  }
}

// ── DELETE PROFILE ────────────────────────
async function deleteProfile(id) {
  if (!confirm(t("deleteProfileConfirm"))) return;
  try {
    await API.del(`/api/profiles/${id}`);
    renderProfiles();
    toast(t("profileDeleted"));
  } catch (e) {
    toast("Delete failed", "err");
  }
}