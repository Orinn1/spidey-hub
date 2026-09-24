/**
 * RocketscriptZ Design System v1.0
 * Admin Console Logic (simple-hub/admin.js) - ภาษาไทย
 */

let allScripts = [];
let siteConfig = {};

// DOM Elements
const scriptsTableBody = document.getElementById('scriptsTableBody');
const checkAll = document.getElementById('checkAll');
const btnBatchDelete = document.getElementById('btnBatchDelete');
const selectedCount = document.getElementById('selectedCount');
const adminSearchInput = document.getElementById('adminSearchInput');

// Modals
const scriptModal = document.getElementById('scriptModal');
const scriptModalTitle = document.getElementById('scriptModalTitle');
const scriptForm = document.getElementById('scriptForm');
const formScriptId = document.getElementById('formScriptId');
const formTitle = document.getElementById('formTitle');
const formGame = document.getElementById('formGame');
const formTags = document.getElementById('formTags');
const formThumb = document.getElementById('formThumb');
const formVideo = document.getElementById('formVideo');
const formViews = document.getElementById('formViews');
const formLikes = document.getElementById('formLikes');
const formLoadstring = document.getElementById('formLoadstring');
const formIsKeyless = document.getElementById('formIsKeyless');
const formIsExecutor = document.getElementById('formIsExecutor');
const btnHeaderNewScript = document.getElementById('btnHeaderNewScript');
const closeScriptModalBtn = document.getElementById('closeScriptModalBtn');
const cancelScriptModalBtn = document.getElementById('cancelScriptModalBtn');

// Roblox Auto Fetch
const robloxPlaceInput = document.getElementById('robloxPlaceInput');
const btnFetchRoblox = document.getElementById('btnFetchRoblox');

// Toast
const adminToast = document.getElementById('adminToast');
const toastMessage = document.getElementById('toastMessage');
let toastTimer = null;

function showToast(msg, duration = 2500) {
    if (!adminToast) return;
    if (toastMessage) toastMessage.textContent = msg;
    adminToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        adminToast.classList.remove('show');
    }, duration);
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// =============================================================================
// Tab Switching
// =============================================================================
document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(c => c.style.display = 'none');

        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.style.display = 'block';
    });
});

// =============================================================================
// 1. Data Fetching & KPIs
// =============================================================================

async function loadStats() {
    try {
        const res = await fetch('/api/db/stats');
        if (res.ok) {
            const stats = await res.json();
            document.getElementById('statScriptsCount').textContent = (stats.totalScripts || 0).toLocaleString();
            document.getElementById('statViewsCount').textContent = (stats.totalViews || 0).toLocaleString();
            document.getElementById('statLikesCount').textContent = (stats.totalLikes || 0).toLocaleString();
            document.getElementById('statBannedCount').textContent = (stats.totalBannedIps || 0).toLocaleString();
        }
    } catch (e) {}
}

async function loadScripts() {
    try {
        const res = await fetch('/api/scripts');
        if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลสคริปต์ได้');
        allScripts = await res.json();
        renderScriptsTable(allScripts);
    } catch (err) {
        scriptsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--danger); padding: 30px;">เกิดข้อผิดพลาดในการโหลดสคริปต์: ${escapeHtml(err.message)}</td></tr>`;
    }
}

function renderScriptsTable(scriptsToRender) {
    if (!scriptsToRender || scriptsToRender.length === 0) {
        scriptsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">ไม่พบสคริปต์ในระบบ</td></tr>`;
        return;
    }

    scriptsTableBody.innerHTML = scriptsToRender.map(s => {
        const thumb = s.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80';

        return `
            <tr data-id="${s.id}">
                <td style="width: 32px;"><input type="checkbox" class="script-checkbox" value="${s.id}"></td>
                <td>
                    <div class="table-item-cell">
                        <img src="${thumb}" alt="${escapeHtml(s.title)}" class="table-thumb-img" onerror="this.src='https://via.placeholder.com/50x32?text=IMG'">
                        <div class="table-title-wrap">
                            <span class="table-script-title" title="${escapeHtml(s.title)}">${escapeHtml(s.title)}</span>
                            <span class="table-script-id">ID: ${s.id}</span>
                        </div>
                    </div>
                </td>
                <td><span style="color: var(--text-secondary); font-size: 13px;">${escapeHtml(s.game || 'Universal')}</span></td>
                <td>
                    <span class="status-pill ${s.isKeyless ? 'status-active' : 'status-pending'}">
                        <span class="status-dot"></span>
                        ${s.isKeyless ? 'ใช้งานได้' : 'มีระบบคีย์'}
                    </span>
                    ${s.isExecutor ? '<span class="status-pill status-disabled" style="margin-left: 4px;"><span class="status-dot"></span>Executor</span>' : ''}
                </td>
                <td><span style="color: var(--text-primary); font-family: monospace; font-size: 13px;">${Number(s.views || 0).toLocaleString()}</span></td>
                <td style="text-align: right;">
                    <div style="display: flex; gap: 4px; justify-content: flex-end;">
                        <button type="button" class="btn btn-ghost btn-sm" onclick="openEditScriptModal('${s.id}')" title="แก้ไข" style="padding: 0 6px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button type="button" class="btn btn-ghost btn-sm" onclick="deleteSingleScript('${s.id}')" title="ลบ" style="padding: 0 6px; color: var(--danger);">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    bindCheckboxEvents();
}

// Search Filter (Width: 280px per spec)
if (adminSearchInput) {
    adminSearchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allScripts.filter(s => 
            (s.title && s.title.toLowerCase().includes(query)) ||
            (s.game && s.game.toLowerCase().includes(query)) ||
            (s.tags && Array.isArray(s.tags) && s.tags.some(t => t.toLowerCase().includes(query)))
        );
        renderScriptsTable(filtered);
    });
}

// =============================================================================
// 2. Checkboxes & Batch Delete
// =============================================================================

function bindCheckboxEvents() {
    const checkboxes = document.querySelectorAll('.script-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateBatchDeleteState);
    });
}

if (checkAll) {
    checkAll.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.script-checkbox');
        checkboxes.forEach(cb => cb.checked = checkAll.checked);
        updateBatchDeleteState();
    });
}

function updateBatchDeleteState() {
    const checked = document.querySelectorAll('.script-checkbox:checked');
    if (selectedCount) selectedCount.textContent = checked.length;
    if (btnBatchDelete) {
        btnBatchDelete.style.display = checked.length > 0 ? 'inline-flex' : 'none';
    }
}

if (btnBatchDelete) {
    btnBatchDelete.addEventListener('click', async () => {
        const checked = Array.from(document.querySelectorAll('.script-checkbox:checked')).map(cb => cb.value);
        if (checked.length === 0) return;
        if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบสคริปต์ที่เลือก ${checked.length} รายการ?`)) return;

        try {
            const res = await fetch('/api/scripts/delete-multiple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: checked })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`ลบสคริปต์ ${checked.length} รายการเรียบร้อยแล้ว`);
                await loadScripts();
                await loadStats();
                if (checkAll) checkAll.checked = false;
                updateBatchDeleteState();
            } else {
                alert('เกิดข้อผิดพลาดในการลบสคริปต์: ' + (data.error || 'ข้อผิดพลาดไม่ทราบสาเหตุ'));
            }
        } catch (err) {
            alert('ข้อผิดพลาด: ' + err.message);
        }
    });
}

// =============================================================================
// 3. Script Modal (Add & Edit Any Field!)
// =============================================================================

function openAddScriptModal() {
    scriptForm.reset();
    formScriptId.value = '';
    scriptModalTitle.textContent = 'เพิ่มสคริปต์ใหม่';
    formIsKeyless.checked = true;
    formIsExecutor.checked = false;
    formViews.value = 0;
    formLikes.value = 0;
    scriptModal.style.display = 'flex';
}

window.openEditScriptModal = function(id) {
    const s = allScripts.find(item => item.id === id);
    if (!s) return;

    formScriptId.value = s.id;
    scriptModalTitle.textContent = `แก้ไขสคริปต์: ${s.title}`;
    formTitle.value = s.title || '';
    formGame.value = s.game || '';
    formTags.value = Array.isArray(s.tags) ? s.tags.join(', ') : (s.tags || '');
    formThumb.value = s.thumbnail || '';
    formVideo.value = s.videoPreview || '';
    formViews.value = s.views || 0;
    formLikes.value = s.likes || 0;
    formLoadstring.value = s.loadstring || '';
    formIsKeyless.checked = Boolean(s.isKeyless);
    formIsExecutor.checked = Boolean(s.isExecutor);

    scriptModal.style.display = 'flex';
};

window.deleteSingleScript = async function(id) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสคริปต์นี้?')) return;
    try {
        const res = await fetch('/api/scripts/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
            showToast('ลบสคริปต์เรียบร้อยแล้ว');
            await loadScripts();
            await loadStats();
        } else {
            alert('ข้อผิดพลาด: ' + data.error);
        }
    } catch (err) {
        alert('ข้อผิดพลาด: ' + err.message);
    }
};

if (btnHeaderNewScript) btnHeaderNewScript.addEventListener('click', openAddScriptModal);
if (closeScriptModalBtn) closeScriptModalBtn.addEventListener('click', () => scriptModal.style.display = 'none');
if (cancelScriptModalBtn) cancelScriptModalBtn.addEventListener('click', () => scriptModal.style.display = 'none');

// Save Script Submit
scriptForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isEdit = Boolean(formScriptId.value);
    const url = isEdit ? '/api/scripts/update' : '/api/scripts';

    const payload = {
        title: formTitle.value.trim(),
        game: formGame.value.trim(),
        tags: formTags.value.split(',').map(t => t.trim()).filter(Boolean),
        thumbnail: formThumb.value.trim(),
        videoPreview: formVideo.value.trim() || formThumb.value.trim(),
        loadstring: formLoadstring.value.trim(),
        isKeyless: formIsKeyless.checked,
        isExecutor: formIsExecutor.checked,
        views: Number(formViews.value) || 0,
        likes: Number(formLikes.value) || 0
    };

    if (isEdit) {
        payload.id = formScriptId.value;
    }

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
            scriptModal.style.display = 'none';
            showToast(isEdit ? 'อัปเดตสคริปต์สำเร็จ' : 'เพิ่มสคริปต์ใหม่สำเร็จ');
            await loadScripts();
            await loadStats();
        } else {
            alert('เกิดข้อผิดพลาดในการบันทึกสคริปต์: ' + (data.error || 'ข้อผิดพลาดไม่ทราบสาเหตุ'));
        }
    } catch (err) {
        alert('ข้อผิดพลาด: ' + err.message);
    }
});

// Auto-fetch Roblox Game
if (btnFetchRoblox) {
    btnFetchRoblox.addEventListener('click', async () => {
        const val = robloxPlaceInput.value.trim();
        if (!val) {
            alert('กรุณากรอก Place ID หรือ URL ของเกม Roblox');
            return;
        }

        btnFetchRoblox.disabled = true;
        btnFetchRoblox.textContent = 'กำลังดึงข้อมูล...';

        try {
            const res = await fetch(`/api/roblox-game?placeId=${encodeURIComponent(val)}`);
            const data = await res.json();
            if (res.ok && data.title) {
                formGame.value = data.title;
                if (!formTitle.value) {
                    formTitle.value = `${data.title} – Script Hub`;
                }
                if (data.thumbnail) {
                    formThumb.value = data.thumbnail;
                    formVideo.value = data.thumbnail;
                }
                showToast(`ดึงข้อมูลเกมสำเร็จ: ${data.title}`);
            } else {
                alert('ไม่สามารถดึงข้อมูลเกม Roblox ได้: ' + (data.error || 'Place ID ไม่ถูกต้อง'));
            }
        } catch (err) {
            alert('ข้อผิดพลาด: ' + err.message);
        } finally {
            btnFetchRoblox.disabled = false;
            btnFetchRoblox.textContent = 'ดึงข้อมูล';
        }
    });
}

// =============================================================================
// 4. Website Settings (Branding, Announcements, Detail View)
// =============================================================================

async function loadConfig() {
    try {
        const res = await fetch('/api/config');
        if (!res.ok) return;
        siteConfig = await res.json();

        // Populate Tab 2
        document.getElementById('cfgSiteTitle').value = siteConfig.siteTitle || '';
        document.getElementById('cfgSiteHandle').value = siteConfig.siteHandle || '';
        document.getElementById('cfgLogoUrl').value = siteConfig.logoUrl || '';
        document.getElementById('cfgAnnouncementLabel').value = siteConfig.announcementLabel || '';
        document.getElementById('cfgAnnouncementText').value = siteConfig.announcementText || '';
        document.getElementById('cfgDiscordUrl').value = siteConfig.discordUrl || '';
        document.getElementById('cfgYoutubeUrl').value = siteConfig.youtubeUrl || '';
        document.getElementById('cfgRedInstruction').value = siteConfig.redInstructionText || '';
        document.getElementById('cfgVideoPreview').value = siteConfig.videoShowcasePreview || '';
        document.getElementById('cfgVideoUrl').value = siteConfig.videoShowcaseUrl || '';

        // Populate Tab 3 (Missions)
        document.getElementById('cfgLockEnabled').value = String(siteConfig.lockEnabled !== false);
        document.getElementById('cfgQuickBypassEnabled').value = String(siteConfig.quickBypassEnabled !== false);
        document.getElementById('cfgMission1Label').value = siteConfig.mission1Label || '';
        document.getElementById('cfgMission1Url').value = siteConfig.mission1Url || '';
        document.getElementById('cfgMission2Label').value = siteConfig.mission2Label || '';
        document.getElementById('cfgMission2Url').value = siteConfig.mission2Url || '';
        document.getElementById('cfgMission3Label').value = siteConfig.mission3Label || '';
        document.getElementById('cfgMission3Url').value = siteConfig.mission3Url || '';
        document.getElementById('cfgLootlabsEnabled').value = String(Boolean(siteConfig.lootlabsEnabled));
        document.getElementById('cfgLootlabsUrl').value = siteConfig.lootlabsTier1Url || '';

        // Render FAQs
        renderFaqList();
    } catch (e) {}
}

const siteConfigForm = document.getElementById('siteConfigForm');
const btnSaveConfigTop = document.getElementById('btnSaveConfigTop');

if (btnSaveConfigTop) {
    btnSaveConfigTop.addEventListener('click', () => {
        siteConfigForm.dispatchEvent(new Event('submit'));
    });
}

siteConfigForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const update = {
        siteTitle: document.getElementById('cfgSiteTitle').value.trim(),
        siteHandle: document.getElementById('cfgSiteHandle').value.trim(),
        logoUrl: document.getElementById('cfgLogoUrl').value.trim(),
        announcementLabel: document.getElementById('cfgAnnouncementLabel').value.trim(),
        announcementText: document.getElementById('cfgAnnouncementText').value.trim(),
        discordUrl: document.getElementById('cfgDiscordUrl').value.trim(),
        youtubeUrl: document.getElementById('cfgYoutubeUrl').value.trim(),
        redInstructionText: document.getElementById('cfgRedInstruction').value.trim(),
        videoPreview: document.getElementById('cfgVideoPreview').value.trim(),
        videoUrl: document.getElementById('cfgVideoUrl').value.trim()
    };

    await saveConfigToServer(update);
});

// Missions Config Form
const missionsConfigForm = document.getElementById('missionsConfigForm');
const btnSaveMissionsTop = document.getElementById('btnSaveMissionsTop');

if (btnSaveMissionsTop) {
    btnSaveMissionsTop.addEventListener('click', () => {
        missionsConfigForm.dispatchEvent(new Event('submit'));
    });
}

missionsConfigForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const update = {
        lockEnabled: document.getElementById('cfgLockEnabled').value === 'true',
        quickBypassEnabled: document.getElementById('cfgQuickBypassEnabled').value === 'true',
        mission1Label: document.getElementById('cfgMission1Label').value.trim(),
        mission1Url: document.getElementById('cfgMission1Url').value.trim(),
        mission2Label: document.getElementById('cfgMission2Label').value.trim(),
        mission2Url: document.getElementById('cfgMission2Url').value.trim(),
        mission3Label: document.getElementById('cfgMission3Label').value.trim(),
        mission3Url: document.getElementById('cfgMission3Url').value.trim(),
        lootlabsEnabled: document.getElementById('cfgLootlabsEnabled').value === 'true',
        lootlabsTier1Url: document.getElementById('cfgLootlabsUrl').value.trim()
    };

    await saveConfigToServer(update);
});

async function saveConfigToServer(patch) {
    try {
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch)
        });
        const data = await res.json();
        if (data.success) {
            siteConfig = data.config;
            showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว');
        } else {
            alert('เกิดข้อผิดพลาดในการบันทึก: ' + data.error);
        }
    } catch (err) {
        alert('ข้อผิดพลาด: ' + err.message);
    }
}

// =============================================================================
// 5. FAQ Manager (Add, Edit, Delete FAQs)
// =============================================================================

const faqListContainer = document.getElementById('faqListContainer');
const btnAddFaqBtn = document.getElementById('btnAddFaqBtn');

function renderFaqList() {
    const faqs = siteConfig.faqs || [];
    if (faqs.length === 0) {
        faqListContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">ยังไม่มีรายการคำถามที่พบบ่อย</p>';
        return;
    }

    faqListContainer.innerHTML = faqs.map((f, i) => `
        <div style="background: var(--surface-1); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 14px 18px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
            <div style="flex: 1;">
                <div style="font-size: 13.5px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">${escapeHtml(f.q)}</div>
                <div style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; white-space: pre-wrap;">${escapeHtml(f.a)}</div>
            </div>
            <div style="display: flex; gap: 6px; flex-shrink: 0;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="editFaq(${i})">แก้ไข</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="deleteFaq(${i})">ลบ</button>
            </div>
        </div>
    `).join('');
}

window.editFaq = function(idx) {
    const faqs = siteConfig.faqs || [];
    const item = faqs[idx];
    if (!item) return;

    const newQ = prompt('แก้ไขคำถาม:', item.q);
    if (newQ === null) return;
    const newA = prompt('แก้ไขคำตอบ:', item.a);
    if (newA === null) return;

    faqs[idx] = { q: newQ.trim(), a: newA.trim() };
    saveConfigToServer({ faqs });
    renderFaqList();
};

window.deleteFaq = function(idx) {
    const faqs = siteConfig.faqs || [];
    if (!confirm(`ต้องการลบคำถาม "${faqs[idx]?.q}" ใช่หรือไม่?`)) return;

    faqs.splice(idx, 1);
    saveConfigToServer({ faqs });
    renderFaqList();
};

if (btnAddFaqBtn) {
    btnAddFaqBtn.addEventListener('click', () => {
        const q = prompt('กรอกคำถามใหม่:');
        if (!q || !q.trim()) return;
        const a = prompt('กรอกคำตอบ:');
        if (!a || !a.trim()) return;

        const faqs = siteConfig.faqs || [];
        faqs.push({ q: q.trim(), a: a.trim() });
        saveConfigToServer({ faqs });
        renderFaqList();
    });
}

// =============================================================================
// 6. Security & Ban System
// =============================================================================

const banForm = document.getElementById('banForm');
const banIpInput = document.getElementById('banIpInput');
const banDurationSelect = document.getElementById('banDurationSelect');
const banReasonInput = document.getElementById('banReasonInput');
const bannedIpsTableBody = document.getElementById('bannedIpsTableBody');

async function loadBannedIps() {
    try {
        const res = await fetch('/api/banned-ips');
        if (!res.ok) return;
        const list = await res.json();
        renderBannedIpsTable(list);
    } catch (e) {}
}

function renderBannedIpsTable(list) {
    if (!list || list.length === 0) {
        bannedIpsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">ไม่มีรายการไอพีที่ถูกระงับ</td></tr>';
        return;
    }

    bannedIpsTableBody.innerHTML = list.map(item => {
        const bannedAt = new Date(item.banned_at).toLocaleString('th-TH');
        const bannedUntil = item.banned_until === 0 ? '<span style="color: var(--danger);">ถาวร</span>' : new Date(item.banned_until).toLocaleString('th-TH');

        return `
            <tr>
                <td><span style="font-family: monospace; font-size: 13px; color: var(--text-primary); font-weight: 500;">${escapeHtml(item.ip)}</span></td>
                <td><span style="color: var(--text-muted); font-size: 12px;">${bannedAt}</span></td>
                <td><span style="color: var(--text-secondary); font-size: 12px;">${bannedUntil}</span></td>
                <td><span style="color: var(--text-secondary); font-size: 12.5px;">${escapeHtml(item.reason || '-')}</span></td>
                <td style="text-align: right;">
                    <button type="button" class="btn btn-secondary btn-sm" onclick="unbanIp('${item.ip}')">
                        ปลดแบน
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

if (banForm) {
    banForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const ip = banIpInput.value.trim();
        const durationHours = Number(banDurationSelect.value);
        const reason = banReasonInput.value.trim();

        if (!ip) return;

        try {
            const res = await fetch('/api/admin-ban', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ip, durationHours, reason })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`ระงับ IP: ${ip} สำเร็จ`);
                banForm.reset();
                await loadBannedIps();
                await loadStats();
            } else {
                alert('เกิดข้อผิดพลาด: ' + data.error);
            }
        } catch (err) {
            alert('ข้อผิดพลาด: ' + err.message);
        }
    });
}

window.unbanIp = async function(ip) {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการปลดแบน IP ${ip}?`)) return;
    try {
        const res = await fetch('/api/admin-ban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip, action: 'unban' })
        });
        const data = await res.json();
        if (data.success) {
            showToast(`ปลดแบน IP: ${ip} สำเร็จ`);
            await loadBannedIps();
            await loadStats();
        } else {
            alert('ข้อผิดพลาด: ' + data.error);
        }
    } catch (err) {
        alert('ข้อผิดพลาด: ' + err.message);
    }
};

// =============================================================================
// 7. Database Maintenance (Reset, Clear, Restore)
// =============================================================================

const btnResetDefault = document.getElementById('btnResetDefault');
const btnClearAll = document.getElementById('btnClearAll');
const restoreFileInput = document.getElementById('restoreFileInput');

if (btnResetDefault) {
    btnResetDefault.addEventListener('click', async () => {
        if (!confirm('คำเตือน: สคริปต์ปัจจุบันจะถูกแทนที่ด้วยสคริปต์เริ่มต้น ต้องการดำเนินการต่อหรือไม่?')) return;
        try {
            const res = await fetch('/api/db/reset', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                showToast('รีเซ็ตฐานข้อมูลเป็นค่าเริ่มต้นสำเร็จ');
                await loadScripts();
                await loadStats();
            }
        } catch (err) {
            alert('ข้อผิดพลาด: ' + err.message);
        }
    });
}

if (btnClearAll) {
    btnClearAll.addEventListener('click', async () => {
        if (!confirm('อันตราย: สคริปต์ทั้งหมดจะถูกลบถาวร! คุณแน่ใจหรือไม่?')) return;
        try {
            const res = await fetch('/api/db/clear', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                showToast('ลบสคริปต์ทั้งหมดเรียบร้อยแล้ว');
                await loadScripts();
                await loadStats();
            }
        } catch (err) {
            alert('ข้อผิดพลาด: ' + err.message);
        }
    });
}

if (restoreFileInput) {
    restoreFileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            if (!confirm(`พบสคริปต์ ${json.scripts?.length || 0} รายการในไฟล์สำรอง ต้องการนำเข้าข้อมูลตอนนี้หรือไม่?`)) {
                restoreFileInput.value = '';
                return;
            }

            const res = await fetch('/api/db/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(json)
            });
            const data = await res.json();
            if (data.success) {
                showToast('กู้คืนฐานข้อมูลสำเร็จ');
                await loadScripts();
                await loadConfig();
                await loadStats();
            } else {
                alert('การกู้คืนข้อมูลล้มเหลว: ' + data.error);
            }
        } catch (err) {
            alert('ไฟล์สำรองไม่ถูกต้อง: ' + err.message);
        } finally {
            restoreFileInput.value = '';
        }
    });
}

// Initial Boot
(async function init() {
    await loadStats();
    await loadConfig();
    await loadScripts();
    await loadBannedIps();
})();
