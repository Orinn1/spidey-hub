/**
 * RocketscriptZ - Interactive Logic & Single Page Application (SPA)
 * Connected with SQLite REST API, Dynamic Config, Sub2Unlock & Ban System.
 */

// Fallback Default Scripts (If offline / file:// protocol)
const FALLBACK_SCRIPTS = [
    {
        id: "script-1",
        title: "Steal An Egg – Ajjans HUB Dr Scrambles",
        game: "Steal An Egg",
        tags: ["All-Script", "Dr Scrambles", "Keysystem"],
        date: "กันยายน 20, 2026",
        isKeyless: false,
        isExecutor: false,
        thumbnail: "https://i.postimg.cc/NjhnhRkJ/153b5a40-0a72-4b41-ab3d-a784d6cff6ec.png",
        videoPreview: "https://i.postimg.cc/NjhnhRkJ/153b5a40-0a72-4b41-ab3d-a784d6cff6ec.png",
        loadstring: 'loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/359e97f8618e9008afe5f496184ebb7c.lua"))()',
        views: 38308
    },
    {
        id: "script-2",
        title: "Steal An Egg – Chilli HUB Dr Scrambles แนะนำ!!!",
        game: "Steal An Egg",
        tags: ["All-Script", "Dr Scrambles", "Keyless"],
        date: "กันยายน 20, 2026",
        isKeyless: true,
        isExecutor: false,
        thumbnail: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        videoPreview: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        loadstring: 'loadstring(game:HttpGet("https://zeroinhub.com/api/script"))()',
        views: 24510
    },
    {
        id: "script-3",
        title: "Download Delta iOS No ksign",
        game: "Delta iOS",
        tags: ["Executor", "Apple iOS"],
        date: "กันยายน 20, 2026",
        isKeyless: true,
        isExecutor: true,
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        videoPreview: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        loadstring: '-- Delta iOS Executor Direct Download:\n-- https://deltaexploits.net/\n-- ติดตั้งผ่าน Scarlet หรือ TrollStore โดยไม่ต้อง Sign ซ้ำ',
        views: 52890
    },
    {
        id: "script-4",
        title: "Steal An Egg 🔥 ฟาร์มไข่อัตโนมัติ + Auto Steal 24 ชม (ZeroinHub)",
        game: "Steal An Egg",
        tags: ["All-Script", "Keyless"],
        date: "กันยายน 21, 2026",
        isKeyless: true,
        isExecutor: false,
        thumbnail: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        videoPreview: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        loadstring: 'loadstring(game:HttpGet("https://zeroinhub.com/api/script"))()',
        views: 19420
    },
    {
        id: "script-5",
        title: "Blox Fruits แจกสคริปฟรี! 🤯 ไม่มีคีย์ พร้อมฟาร์มออโต้ (Gravity Hub)",
        game: "Blox Fruits",
        tags: ["All-Script", "Keyless"],
        date: "กันยายน 21, 2026",
        isKeyless: true,
        isExecutor: false,
        thumbnail: "https://i.postimg.cc/QdMcnX6k/c83f1d25-2231-4a10-95d3-e39b21b902ba.png",
        videoPreview: "https://i.postimg.cc/QdMcnX6k/c83f1d25-2231-4a10-95d3-e39b21b902ba.png",
        loadstring: 'GravityHub = {\n    Key = "",\n    Team = "Pirates",\n    Color = "Red",\n    SaveSetting = false,\n    AutoExecute = false\n}\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Dev-GravityHub/BloxFruit/refs/heads/main/MainPremium.lua"))()',
        views: 45120
    },
    {
        id: "script-6",
        title: "Ride A Pet 🔥 ไม่มีคีย์! ออโต้ทุกอย่าง ฟาร์มชิวๆ",
        game: "Ride A Pet",
        tags: ["All-Script", "Keyless"],
        date: "กันยายน 22, 2026",
        isKeyless: true,
        isExecutor: false,
        thumbnail: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80",
        videoPreview: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80",
        loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/joustingmatch/Ouroboros/main/loader.lua"))()',
        views: 15830
    }
];

const FALLBACK_THUMBNAIL = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22338%22%20viewBox%3D%220%200%20600%20338%22%3E%3Crect%20fill%3D%22%23111111%22%20width%3D%22600%22%20height%3D%22338%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20fill%3D%22%2310b981%22%20font-family%3D%22sans-serif%22%20font-size%3D%2226%22%20font-weight%3D%22bold%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ESpidey%3C%2Ftext%3E%3C%2Fsvg%3E";

// State
let scripts = [];
let siteConfig = {};
let currentTab = "home";
let currentSearch = "";
let currentDetailScript = null;
let unlockedScriptIds = new Set();
let currentMissionStep = 1;

// DOM Elements
const homeView = document.getElementById("homeView");
const detailView = document.getElementById("detailView");
const scriptGrid = document.getElementById("scriptGrid");
const noResults = document.getElementById("noResults");
const resetSearchBtn = document.getElementById("resetSearchBtn");
const navTabs = document.getElementById("navTabs");
const brandBtn = document.getElementById("brandBtn");

// Search
const searchToggleBtn = document.getElementById("searchToggleBtn");
const searchDropdown = document.getElementById("searchDropdown");
const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");

// Detail View
const backToHomeBtn = document.getElementById("backToHomeBtn");
const detailTitle = document.getElementById("detailTitle");
const detailThumbnail = document.getElementById("detailThumbnail");
const lockCard = document.getElementById("lockCard");
const lockStatusIcon = document.getElementById("lockStatusIcon");
const lockStatusText = document.getElementById("lockStatusText");
const lockSubText = document.getElementById("lockSubText");
const unlockTriggerBtn = document.getElementById("unlockTriggerBtn");
const unlockedContent = document.getElementById("unlockedContent");
const loadstringCode = document.getElementById("loadstringCode");
const copyLoadstringBtn = document.getElementById("copyLoadstringBtn");
const videoBox = document.getElementById("videoBox");
const videoThumbImg = document.getElementById("videoThumbImg");
const postViewsCount = document.getElementById("postViewsCount");
const youMissedGrid = document.getElementById("youMissedGrid");
const faqAccordion = document.getElementById("faqAccordion");

// Unlock Modal
const unlockModal = document.getElementById("unlockModal");
const unlockModalBackdrop = document.getElementById("unlockModalBackdrop");
const closeUnlockModalBtn = document.getElementById("closeUnlockModalBtn");
const quickBypassBtn = document.getElementById("quickBypassBtn");
const missionBtn1 = document.getElementById("missionBtn1");
const missionBtn2 = document.getElementById("missionBtn2");
const missionBtn3 = document.getElementById("missionBtn3");
const progressDots = document.getElementById("progressDots");



// Toast & Scroll
const toast = document.getElementById("toast");
const topScrollBtn = document.getElementById("topScrollBtn");
const floatingScrollBtn = document.getElementById("floatingScrollBtn");
const bannedOverlay = document.getElementById("bannedOverlay");
const bannedIpDisplay = document.getElementById("bannedIpDisplay");

let toastTimer = null;
function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =============================================================================
// 1. Initial Setup: Check Ban & Fetch Data from API
// =============================================================================

async function checkBanStatus() {
    try {
        const res = await fetch('/api/check-ban');
        if (res.ok) {
            const data = await res.json();
            if (data.banned) {
                if (bannedIpDisplay) bannedIpDisplay.textContent = `IP: ${data.ip || 'Unknown'}`;
                if (bannedOverlay) bannedOverlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                return true;
            }
        }
    } catch (e) {}
    return false;
}

async function loadSiteConfig() {
    try {
        const res = await fetch('/api/config');
        if (res.ok) {
            siteConfig = await res.json();
            applySiteConfig(siteConfig);
            return;
        }
    } catch (e) {
        // Fallback to Firebase Cloud Firestore
    }

    if (window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId && window.FIREBASE_CONFIG.apiKey) {
        try {
            const url = `https://firestore.googleapis.com/v1/projects/${window.FIREBASE_CONFIG.projectId}/databases/(default)/documents/hub/config?key=${window.FIREBASE_CONFIG.apiKey}`;
            const fbRes = await fetch(url);
            if (fbRes.ok) {
                const fbData = await fbRes.json();
                if (fbData.fields && fbData.fields.configJson && fbData.fields.configJson.stringValue) {
                    siteConfig = JSON.parse(fbData.fields.configJson.stringValue);
                    applySiteConfig(siteConfig);
                    return;
                }
            }
        } catch (fbErr) {}
    }

    applySiteConfig({});
}

function applySiteConfig(cfg) {
    // 1. Branding
    if (cfg.siteTitle) {
        document.title = `${cfg.siteTitle} - Roblox Scripts & Exploit Hub`;
        const siteTitleEl = document.getElementById("siteTitle");
        if (siteTitleEl) siteTitleEl.textContent = cfg.siteTitle;
    }
    if (cfg.siteHandle) {
        const siteHandleEl = document.getElementById("siteHandle");
        if (siteHandleEl) siteHandleEl.textContent = cfg.siteHandle;
    }

    // 2. Announcements & Socials
    if (cfg.announcementLabel) {
        const announcementLabelEl = document.getElementById("announcementLabel");
        if (announcementLabelEl) announcementLabelEl.textContent = cfg.announcementLabel;
    }
    if (cfg.announcementText) {
        const announcementTextEl = document.getElementById("announcementText");
        if (announcementTextEl) announcementTextEl.textContent = cfg.announcementText;
    }
    if (cfg.discordUrl) {
        const topDiscordLink = document.getElementById("topDiscordLink");
        if (topDiscordLink) topDiscordLink.href = cfg.discordUrl;
        const headerDcLink = document.getElementById("headerDcLink");
        if (headerDcLink) headerDcLink.href = cfg.discordUrl;
    }
    if (cfg.youtubeUrl) {
        const topYoutubeLink = document.getElementById("topYoutubeLink");
        if (topYoutubeLink) topYoutubeLink.href = cfg.youtubeUrl;
        const headerYtLink = document.getElementById("headerYtLink");
        if (headerYtLink) headerYtLink.href = cfg.youtubeUrl;
    }

    // 3. Detail View Settings
    if (cfg.redInstructionText) {
        const redInstructionText = document.getElementById("redInstructionText");
        if (redInstructionText) redInstructionText.textContent = cfg.redInstructionText;
    }
    if (cfg.videoShowcasePreview && videoThumbImg) {
        videoThumbImg.src = cfg.videoShowcasePreview;
    }
    if (cfg.videoShowcaseUrl && videoBox) {
        videoBox.onclick = () => { window.open(cfg.videoShowcaseUrl, '_blank'); };
    }

    // 4. Mission Buttons Labels
    if (cfg.mission1Label && missionBtn1) missionBtn1.textContent = cfg.mission1Label;
    if (cfg.mission2Label && missionBtn2) missionBtn2.textContent = cfg.mission2Label;
    if (cfg.mission3Label && missionBtn3) missionBtn3.textContent = cfg.mission3Label;
    if (cfg.quickBypassEnabled === false && quickBypassBtn) {
        quickBypassBtn.style.display = 'none';
    }

    // 5. Render FAQs
    renderFaqs(cfg.faqs);
}

function renderFaqs(faqsList) {
    if (!faqAccordion) return;
    const faqs = Array.isArray(faqsList) && faqsList.length > 0 ? faqsList : [
        {
            q: "ใช้งานบนมือถือได้ไหม?",
            a: "สามารถใช้งานได้ครับ หากสคริปต์มีแท็กระบุว่ารองรับมือถือ (Mobile) สามารถรันผ่าน Executor บนมือถือเช่น Delta, Arceus X, Fluxus หรือ Codex ได้เลยครับ"
        },
        {
            q: "รองรับ Executor อะไรบ้าง?",
            a: "รองรับโปรแกรมรันสคริปต์ยอดนิยมทุกตัว เช่น Delta, Synapse Z, Wave, Codex, Arceus X, และ KRNL ครับ"
        },
        {
            q: "ใช้งานแล้วมีโอกาสโดนแบนไหม?",
            a: "การใช้สคริปต์ทุกประเภทมีความเสี่ยง แนะนำให้ใช้รหัสสำรอง (Alt Account) ในการเล่นเพื่อความปลอดภัยของไอดีหลักเสมอครับ"
        },
        {
            q: "สามารถใช้งานได้ฟรีหรือไม่?",
            a: "สคริปต์ทั้งหมดบนเว็บนี้แจกฟรี 100% ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้นครับ"
        }
    ];

    faqAccordion.innerHTML = faqs.map(f => `
        <div class="faq-item">
            <button class="faq-question">
                <span>${escapeHTML(f.q)}</span>
                <span class="faq-arrow">⌄</span>
            </button>
            <div class="faq-answer">
                <p>${escapeHTML(f.a)}</p>
            </div>
        </div>
    `).join('');

    bindFaqAccordion();
}

function bindFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const questionBtn = item.querySelector(".faq-question");
        questionBtn.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            faqItems.forEach(i => i.classList.remove("open"));
            if (!isOpen) {
                item.classList.add("open");
            }
        });
    });
}

async function loadScripts() {
    try {
        const res = await fetch('/api/scripts');
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
                scripts = data;
                renderGrid();
                return;
            }
        }
    } catch (e) {
        // API offline, try Firebase Firestore
    }

    if (window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.projectId && window.FIREBASE_CONFIG.apiKey) {
        try {
            const url = `https://firestore.googleapis.com/v1/projects/${window.FIREBASE_CONFIG.projectId}/databases/(default)/documents/hub/database?key=${window.FIREBASE_CONFIG.apiKey}`;
            const fbRes = await fetch(url);
            if (fbRes.ok) {
                const fbData = await fbRes.json();
                if (fbData.fields && fbData.fields.scriptsJson && fbData.fields.scriptsJson.stringValue) {
                    const parsed = JSON.parse(fbData.fields.scriptsJson.stringValue);
                    if (Array.isArray(parsed)) {
                        scripts = parsed;
                        console.log('⚡ Loaded scripts from Firebase Cloud Firestore:', scripts.length);
                        renderGrid();
                        return;
                    }
                }
            }
        } catch (fbErr) {
            console.warn('[Firebase Cloud Error]:', fbErr.message);
        }
    }

    // Fallback to local storage if available
    const local = localStorage.getItem("rocket_scripts");
    if (local) {
        try { scripts = JSON.parse(local); } catch(err) {}
    } else {
        scripts = [];
    }
    renderGrid();
}

// =============================================================================
// 2. Render Script Grid (Home View)
// =============================================================================

function renderGrid() {
    const filtered = scripts.filter(s => {
        let tabMatch = true;
        if (currentTab === "executor") {
            tabMatch = s.isExecutor === true;
        } else if (currentTab === "keyless") {
            tabMatch = s.isKeyless === true && !s.isExecutor;
        } else if (currentTab === "keysystem") {
            tabMatch = s.isKeyless === false && !s.isExecutor;
        }

        let searchMatch = true;
        if (currentSearch) {
            const q = currentSearch.toLowerCase();
            searchMatch = (s.title && s.title.toLowerCase().includes(q)) ||
                          (s.game && s.game.toLowerCase().includes(q));
        }

        return tabMatch && searchMatch;
    });

    scriptGrid.innerHTML = "";

    if (filtered.length === 0) {
        noResults.style.display = "block";
        return;
    }

    noResults.style.display = "none";

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "post-card";

        const tags = Array.isArray(item.tags) ? item.tags : [];
        const badgesHtml = tags.map(t => `<span class="overlay-badge">${escapeHTML(t)}</span>`).join("");

        let typeBadge = '';
        if (item.isExecutor) {
            typeBadge = '<span class="card-type-badge executor">⚡ Executor</span>';
        } else if (item.isKeyless) {
            typeBadge = '<span class="card-type-badge keyless">🔓 Keyless</span>';
        } else {
            typeBadge = '<span class="card-type-badge keysystem">🔑 Key System</span>';
        }

        const viewsFormatted = Number(item.views || 0).toLocaleString();

        card.innerHTML = `
            <div class="card-thumb-wrap">
                <div class="card-badges-overlay">${badgesHtml}</div>
                <div class="card-type-overlay">${typeBadge}</div>
                <img class="card-img" src="${item.thumbnail}" alt="${escapeHTML(item.title)}" onerror="this.src='${FALLBACK_THUMBNAIL}'" loading="lazy">
                <div class="card-hover-scrim">
                    <span class="card-play-action">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        <span>ดูสคริปต์</span>
                    </span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-meta-row">
                    <span class="card-game-chip">🎮 ${escapeHTML(item.game || 'Universal')}</span>
                    <span class="card-date-chip">🕒 ${escapeHTML(item.date || 'วันนี้')}</span>
                </div>
                <h3 class="card-title">${escapeHTML(item.title)}</h3>
                <div class="card-footer-row">
                    <div class="card-views-pill">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <span>${viewsFormatted}</span>
                    </div>
                    <span class="card-action-btn">
                        <span>รับสคริปต์</span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </span>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            openDetailView(item);
        });

        scriptGrid.appendChild(card);
    });
}

// =============================================================================
// 3. Open Script Detail View & Post Views Counter
// =============================================================================

function openDetailView(script) {
    currentDetailScript = script;
    homeView.style.display = "none";
    detailView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });

    detailTitle.textContent = script.title;
    detailThumbnail.src = script.thumbnail;
    detailThumbnail.onerror = () => { detailThumbnail.src = FALLBACK_THUMBNAIL; };
    videoThumbImg.src = script.videoPreview || script.thumbnail;
    videoThumbImg.onerror = () => { videoThumbImg.src = FALLBACK_THUMBNAIL; };
    postViewsCount.textContent = Number(script.views || 0).toLocaleString();
    loadstringCode.textContent = script.loadstring;

    // Send View to API
    fetch('/api/scripts/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: script.id })
    }).catch(() => {});

    // If lock is disabled in config, auto unlock
    if (siteConfig.lockEnabled === false) {
        setScriptUnlockedState();
    } else if (unlockedScriptIds.has(script.id)) {
        setScriptUnlockedState();
    } else {
        setScriptLockedState();
    }

    renderYouMissed(script.id);
}

function setScriptLockedState() {
    lockCard.style.borderColor = "var(--red-primary)";
    lockCard.style.boxShadow = "0 0 25px var(--red-glow)";
    lockStatusIcon.textContent = "🔒";
    lockStatusText.textContent = "สคริปต์ถูกล็อคอยู่";
    lockStatusText.style.color = "var(--red-primary)";
    lockSubText.style.display = "block";
    lockSubText.textContent = "ทำภารกิจเพื่อปลดล็อค";
    unlockTriggerBtn.style.display = "inline-flex";
    unlockedContent.style.display = "none";
}

function setScriptUnlockedState() {
    lockCard.style.borderColor = "#22c55e";
    lockCard.style.boxShadow = "0 0 25px rgba(34, 197, 94, 0.4)";
    lockStatusIcon.textContent = "🔓";
    lockStatusText.textContent = "ปลดล็อคเรียบร้อยแล้ว!";
    lockStatusText.style.color = "#4ade80";
    lockSubText.style.display = "none";
    unlockTriggerBtn.style.display = "none";
    unlockedContent.style.display = "block";
}

function renderYouMissed(currentId) {
    const others = scripts.filter(s => s.id !== currentId).slice(0, 4);
    youMissedGrid.innerHTML = "";

    others.forEach(item => {
        const miniCard = document.createElement("div");
        miniCard.className = "mini-card";
        const typeBadge = item.isKeyless ? 'Keyless' : (item.isExecutor ? 'Executor' : 'Key');
        miniCard.innerHTML = `
            <div class="mini-thumb-wrap">
                <img class="mini-img" src="${item.thumbnail}" alt="${escapeHTML(item.title)}" onerror="this.src='${FALLBACK_THUMBNAIL}'">
                <span class="mini-badge ${item.isKeyless ? 'keyless' : (item.isExecutor ? 'executor' : 'keysystem')}">${typeBadge}</span>
            </div>
            <div class="mini-info">
                <div class="mini-title">${escapeHTML(item.title)}</div>
                <div class="mini-meta">
                    <span>🎮 ${escapeHTML(item.game || 'Universal')}</span>
                    <span>👁️ ${Number(item.views || 0).toLocaleString()}</span>
                </div>
            </div>
        `;
        miniCard.addEventListener("click", () => {
            openDetailView(item);
        });
        youMissedGrid.appendChild(miniCard);
    });
}

function backToHome() {
    detailView.style.display = "none";
    homeView.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

backToHomeBtn.addEventListener("click", backToHome);
brandBtn.addEventListener("click", () => {
    currentTab = "home";
    updateNavTabsUI();
    backToHome();
    renderGrid();
});

// =============================================================================
// 4. Sub2Unlock Modal Logic & Missions
// =============================================================================

function openUnlockModal() {
    // If LootLabs gate is enabled, redirect directly to LootLabs link
    if (siteConfig.lootlabsEnabled && siteConfig.lootlabsTier1Url) {
        window.open(siteConfig.lootlabsTier1Url, '_blank');
        completeUnlock();
        return;
    }

    unlockModal.style.display = "flex";
    currentMissionStep = 1;
    updateMissionButtonsUI();
}

function closeUnlockModal() {
    unlockModal.style.display = "none";
}

function updateMissionButtonsUI() {
    const dots = progressDots.querySelectorAll(".dot");
    dots.forEach((dot, idx) => {
        dot.className = "dot";
        if (idx < currentMissionStep - 1) {
            dot.classList.add("completed");
        } else if (idx === currentMissionStep - 1) {
            dot.classList.add("active");
        }
    });

    if (currentMissionStep === 1) {
        missionBtn1.className = "mission-btn active";
        missionBtn1.disabled = false;
        missionBtn1.textContent = siteConfig.mission1Label || "🛒 กดดูโฆษณา 1 / Watch ads 1";

        missionBtn2.className = "mission-btn locked";
        missionBtn2.disabled = true;
        missionBtn3.className = "mission-btn locked";
        missionBtn3.disabled = true;
    } else if (currentMissionStep === 2) {
        missionBtn1.className = "mission-btn completed";
        missionBtn1.innerHTML = "✓ โฆษณา 1 สำเร็จแล้ว";
        missionBtn1.disabled = true;

        missionBtn2.className = "mission-btn active";
        missionBtn2.disabled = false;
        missionBtn2.textContent = siteConfig.mission2Label || "🛒 กดดูโฆษณา 2 / Watch ads 2";

        missionBtn3.className = "mission-btn locked";
        missionBtn3.disabled = true;
    } else if (currentMissionStep === 3) {
        missionBtn1.className = "mission-btn completed";
        missionBtn2.className = "mission-btn completed";
        missionBtn2.innerHTML = "✓ โฆษณา 2 สำเร็จแล้ว";
        missionBtn2.disabled = true;

        missionBtn3.className = "mission-btn active";
        missionBtn3.disabled = false;
        missionBtn3.textContent = siteConfig.mission3Label || "👍 กดไลค์และคอมเม้นต์ / Like & Comment";
    }
}

function completeUnlock() {
    if (currentDetailScript) {
        unlockedScriptIds.add(currentDetailScript.id);
    }
    closeUnlockModal();
    setScriptUnlockedState();
    showToast("🎉 ปลดล็อคสคริปต์สำเร็จแล้ว!");
}

unlockTriggerBtn.addEventListener("click", openUnlockModal);
unlockModalBackdrop.addEventListener("click", closeUnlockModal);
closeUnlockModalBtn.addEventListener("click", closeUnlockModal);
quickBypassBtn.addEventListener("click", completeUnlock);

// Mission Clicks
missionBtn1.addEventListener("click", () => {
    const url = siteConfig.mission1Url || "https://shopee.co.th";
    window.open(url, "_blank");
    missionBtn1.innerHTML = "⏳ กำลังดำเนินการ...";
    setTimeout(() => {
        currentMissionStep = 2;
        updateMissionButtonsUI();
    }, 1200);
});

missionBtn2.addEventListener("click", () => {
    const url = siteConfig.mission2Url || "https://discord.gg";
    window.open(url, "_blank");
    missionBtn2.innerHTML = "⏳ กำลังดำเนินการ...";
    setTimeout(() => {
        currentMissionStep = 3;
        updateMissionButtonsUI();
    }, 1200);
});

missionBtn3.addEventListener("click", () => {
    const url = siteConfig.mission3Url || "https://youtube.com";
    window.open(url, "_blank");
    missionBtn3.innerHTML = "⏳ กำลังปลดล็อค...";
    setTimeout(() => {
        completeUnlock();
    }, 1500);
});

// Copy Code Button
copyLoadstringBtn.addEventListener("click", () => {
    if (!currentDetailScript) return;
    navigator.clipboard.writeText(currentDetailScript.loadstring).then(() => {
        showToast("คัดลอกสคริปต์สำเร็จ!");
    }).catch(() => {
        const temp = document.createElement("textarea");
        temp.value = currentDetailScript.loadstring;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        showToast("คัดลอกสคริปต์สำเร็จ!");
    });
});

// =============================================================================
// 5. Tabs & Search Logic
// =============================================================================

function updateNavTabsUI() {
    const items = navTabs.querySelectorAll(".nav-item");
    items.forEach(el => {
        if (el.dataset.tab === currentTab) {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });
}

navTabs.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        currentTab = item.dataset.tab;
        updateNavTabsUI();
        backToHome();
        renderGrid();
    });
});

searchToggleBtn.addEventListener("click", () => {
    const isHidden = searchDropdown.style.display === "none";
    searchDropdown.style.display = isHidden ? "block" : "none";
    if (isHidden) searchInput.focus();
});

searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.trim();
    backToHome();
    renderGrid();
});

clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    currentSearch = "";
    renderGrid();
});

resetSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    currentSearch = "";
    currentTab = "home";
    updateNavTabsUI();
    renderGrid();
});



// Scroll to top
window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        floatingScrollBtn.classList.add("visible");
    } else {
        floatingScrollBtn.classList.remove("visible");
    }
});

topScrollBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
});

floatingScrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Boot
(async function init() {
    const isBanned = await checkBanStatus();
    if (isBanned) return;

    await loadSiteConfig();
    await loadScripts();
})();
