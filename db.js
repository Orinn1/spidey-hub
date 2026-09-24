/**
 * SQLite Database Manager for Simple-Hub (RocketscriptZ)
 * Uses Node.js v24 native node:sqlite DatabaseSync
 * File: simple-hub/data/database.sqlite
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'database.sqlite');
const db = new DatabaseSync(DB_PATH);

// Initialize Tables
db.exec(`
CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    game TEXT NOT NULL,
    tags TEXT,
    date TEXT,
    isKeyless INTEGER DEFAULT 1,
    isExecutor INTEGER DEFAULT 0,
    thumbnail TEXT,
    videoPreview TEXT,
    loadstring TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at INTEGER
);

CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT
);

CREATE TABLE IF NOT EXISTS banned_ips (
    ip TEXT PRIMARY KEY,
    banned_until INTEGER NOT NULL,
    duration_hours INTEGER NOT NULL,
    banned_at INTEGER NOT NULL,
    reason TEXT,
    active INTEGER DEFAULT 1
);
`);

// Default Initial Scripts
const DEFAULT_SCRIPTS = [
    {
        id: "script-1",
        title: "Steal An Egg – Ajjans HUB Dr Scrambles",
        game: "Steal An Egg",
        tags: "All-Script, Dr Scrambles, Keysystem",
        date: "กันยายน 20, 2026",
        isKeyless: 0,
        isExecutor: 0,
        thumbnail: "https://i.postimg.cc/NjhnhRkJ/153b5a40-0a72-4b41-ab3d-a784d6cff6ec.png",
        videoPreview: "https://i.postimg.cc/NjhnhRkJ/153b5a40-0a72-4b41-ab3d-a784d6cff6ec.png",
        loadstring: 'loadstring(game:HttpGet("https://api.luarmor.net/files/v4/loaders/359e97f8618e9008afe5f496184ebb7c.lua"))()',
        views: 38308,
        likes: 1240,
        created_at: 1726800000000
    },
    {
        id: "script-2",
        title: "Steal An Egg – Chilli HUB Dr Scrambles แนะนำ!!!",
        game: "Steal An Egg",
        tags: "All-Script, Dr Scrambles, Keyless",
        date: "กันยายน 20, 2026",
        isKeyless: 1,
        isExecutor: 0,
        thumbnail: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        videoPreview: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        loadstring: 'loadstring(game:HttpGet("https://zeroinhub.com/api/script"))()',
        views: 24510,
        likes: 890,
        created_at: 1726805000000
    },
    {
        id: "script-3",
        title: "Download Delta iOS No ksign",
        game: "Delta iOS",
        tags: "Executor, Apple iOS",
        date: "กันยายน 20, 2026",
        isKeyless: 1,
        isExecutor: 1,
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        videoPreview: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
        loadstring: '-- Delta iOS Executor Direct Download:\n-- https://deltaexploits.net/\n-- ติดตั้งผ่าน Scarlet หรือ TrollStore โดยไม่ต้อง Sign ซ้ำ',
        views: 52890,
        likes: 3100,
        created_at: 1726810000000
    },
    {
        id: "script-4",
        title: "Steal An Egg 🔥 ฟาร์มไข่อัตโนมัติ + Auto Steal 24 ชม (ZeroinHub)",
        game: "Steal An Egg",
        tags: "All-Script, Keyless",
        date: "กันยายน 21, 2026",
        isKeyless: 1,
        isExecutor: 0,
        thumbnail: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        videoPreview: "https://i.postimg.cc/Tw5QWxyN/Chat-GPT-Image-Sep-15-2026-11-45-45-PM.png",
        loadstring: 'loadstring(game:HttpGet("https://zeroinhub.com/api/script"))()',
        views: 19420,
        likes: 670,
        created_at: 1726890000000
    },
    {
        id: "script-5",
        title: "Blox Fruits แจกสคริปฟรี! 🤯 ไม่มีคีย์ พร้อมฟาร์มออโต้ (Gravity Hub)",
        game: "Blox Fruits",
        tags: "All-Script, Keyless",
        date: "กันยายน 21, 2026",
        isKeyless: 1,
        isExecutor: 0,
        thumbnail: "https://i.postimg.cc/QdMcnX6k/c83f1d25-2231-4a10-95d3-e39b21b902ba.png",
        videoPreview: "https://i.postimg.cc/QdMcnX6k/c83f1d25-2231-4a10-95d3-e39b21b902ba.png",
        loadstring: 'GravityHub = {\n    Key = "",\n    Team = "Pirates",\n    Color = "Red",\n    SaveSetting = false,\n    AutoExecute = false\n}\nloadstring(game:HttpGet("https://raw.githubusercontent.com/Dev-GravityHub/BloxFruit/refs/heads/main/MainPremium.lua"))()',
        views: 45120,
        likes: 1850,
        created_at: 1726900000000
    },
    {
        id: "script-6",
        title: "Ride A Pet 🔥 ไม่มีคีย์! ออโต้ทุกอย่าง ฟาร์มชิวๆ",
        game: "Ride A Pet",
        tags: "All-Script, Keyless",
        date: "กันยายน 22, 2026",
        isKeyless: 1,
        isExecutor: 0,
        thumbnail: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80",
        videoPreview: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80",
        loadstring: 'loadstring(game:HttpGet("https://raw.githubusercontent.com/joustingmatch/Ouroboros/main/loader.lua"))()',
        views: 15830,
        likes: 420,
        created_at: 1726980000000
    }
];

// Default Site Configuration (Allows editing EVERYTHING on Spidey)
const DEFAULT_CONFIG = {
    // Branding
    siteTitle: "Spidey",
    siteHandle: "@Spidey",
    logoUrl: "Logo.png",

    // Top Announcement Bar
    announcementLabel: "ติดตาม:",
    announcementText: "🕷️ ยินดีต้อนรับสู่ Spidey Script Hub คลังสคริปต์ Roblox อัปเดตใหม่ล่าสุด",
    discordUrl: "https://discord.gg",
    youtubeUrl: "https://youtube.com",

    // Script Detail View
    redInstructionText: "🟢 กดปุ่มสีเขียวเพื่อปลดล็อคสคริปต์ 🔒",
    videoShowcasePreview: "https://i.postimg.cc/NjhnhRkJ/153b5a40-0a72-4b41-ab3d-a784d6cff6ec.png",
    videoShowcaseUrl: "https://youtube.com",

    // Sub2Unlock Missions
    lockEnabled: true,
    quickBypassEnabled: true,
    mission1Label: "🛒 กดดูโฆษณา 1 / Watch ads 1",
    mission1Url: "https://shopee.co.th",
    mission2Label: "🛒 กดดูโฆษณา 2 / Watch ads 2",
    mission2Url: "https://discord.gg",
    mission3Label: "👍 กดไลค์และคอมเม้นต์ / Like & Comment",
    mission3Url: "https://youtube.com",

    // LootLabs Integration
    lootlabsEnabled: false,
    lootlabsTier1Url: "",

    // FAQs (Frequently Asked Questions - Fully Dynamic!)
    faqs: [
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
        },
        {
            q: "หากสคริปต์ไม่ทำงานควรทำอย่างไร?",
            a: "1. ตรวจสอบว่า Executor อัปเดตล่าสุดหรือยัง\n2. ลองเปลี่ยนเซิร์ฟเวอร์หรือ Rejoin เกม\n3. ตรวจสอบว่าคัดลอกโค้ดสคริปต์ครบถ้วนหรือไม่"
        },
        {
            q: "ทำไมบางครั้งสคริปต์ถึงใช้งานไม่ได้?",
            a: "เมื่อตัวเกม Roblox หรือแมพมีการอัปเดตแพทช์ใหม่ สคริปต์อาจจะหลุดหรือต้องรอผู้พัฒนาอัปเดตแก้โค้ดใหม่ครับ"
        }
    ]
};

// Seed initial scripts if empty
function seedInitialData() {
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM scripts');
    const result = countStmt.get();
    if (result.count === 0) {
        console.log('[Simple-Hub DB] Seeding default scripts...');
        const insertStmt = db.prepare(`
            INSERT INTO scripts (id, title, game, tags, date, isKeyless, isExecutor, thumbnail, videoPreview, loadstring, views, likes, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const s of DEFAULT_SCRIPTS) {
            insertStmt.run(
                s.id,
                s.title,
                s.game,
                s.tags,
                s.date,
                s.isKeyless ? 1 : 0,
                s.isExecutor ? 1 : 0,
                s.thumbnail,
                s.videoPreview,
                s.loadstring,
                s.views,
                s.likes,
                s.created_at
            );
        }
    }

    // Seed initial config if empty
    const cfgStmt = db.prepare('SELECT COUNT(*) as count FROM config');
    const cfgResult = cfgStmt.get();
    if (cfgResult.count === 0) {
        console.log('[Simple-Hub DB] Seeding default site config...');
        const saveCfg = db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');
        saveCfg.run('site_config', JSON.stringify(DEFAULT_CONFIG));
    }
}

seedInitialData();

// =============================================================================
// Database Operations
// =============================================================================

function getAllScripts() {
    const stmt = db.prepare('SELECT * FROM scripts ORDER BY created_at DESC');
    const rows = stmt.all();
    return rows.map(r => ({
        ...r,
        isKeyless: Boolean(r.isKeyless),
        isExecutor: Boolean(r.isExecutor),
        tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    }));
}

function getScriptById(id) {
    const stmt = db.prepare('SELECT * FROM scripts WHERE id = ?');
    const r = stmt.get(id);
    if (!r) return null;
    return {
        ...r,
        isKeyless: Boolean(r.isKeyless),
        isExecutor: Boolean(r.isExecutor),
        tags: r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    };
}

function addScript(script) {
    const id = script.id || `script-${Date.now()}`;
    const tagsStr = Array.isArray(script.tags) ? script.tags.join(', ') : (script.tags || 'All-Script');
    const dateStr = script.date || new Date().toLocaleDateString('th-TH', { month: 'long', day: 'numeric', year: 'numeric' });
    const createdAt = script.created_at || Date.now();
    const views = Number(script.views) || 0;
    const likes = Number(script.likes) || 0;

    const stmt = db.prepare(`
        INSERT INTO scripts (id, title, game, tags, date, isKeyless, isExecutor, thumbnail, videoPreview, loadstring, views, likes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
        id,
        script.title,
        script.game || 'Universal',
        tagsStr,
        dateStr,
        script.isKeyless ? 1 : 0,
        script.isExecutor ? 1 : 0,
        script.thumbnail || '',
        script.videoPreview || script.thumbnail || '',
        script.loadstring,
        views,
        likes,
        createdAt
    );

    return getScriptById(id);
}

function updateScript(id, updates) {
    const existing = getScriptById(id);
    if (!existing) return null;

    const title = updates.title !== undefined ? updates.title : existing.title;
    const game = updates.game !== undefined ? updates.game : existing.game;
    const tagsStr = updates.tags !== undefined
        ? (Array.isArray(updates.tags) ? updates.tags.join(', ') : updates.tags)
        : (Array.isArray(existing.tags) ? existing.tags.join(', ') : existing.tags);
    const dateStr = updates.date !== undefined ? updates.date : existing.date;
    const isKeyless = updates.isKeyless !== undefined ? (updates.isKeyless ? 1 : 0) : (existing.isKeyless ? 1 : 0);
    const isExecutor = updates.isExecutor !== undefined ? (updates.isExecutor ? 1 : 0) : (existing.isExecutor ? 1 : 0);
    const thumbnail = updates.thumbnail !== undefined ? updates.thumbnail : existing.thumbnail;
    const videoPreview = updates.videoPreview !== undefined ? updates.videoPreview : existing.videoPreview;
    const loadstring = updates.loadstring !== undefined ? updates.loadstring : existing.loadstring;
    const views = updates.views !== undefined ? Number(updates.views) : existing.views;
    const likes = updates.likes !== undefined ? Number(updates.likes) : existing.likes;

    const stmt = db.prepare(`
        UPDATE scripts 
        SET title = ?, game = ?, tags = ?, date = ?, isKeyless = ?, isExecutor = ?, thumbnail = ?, videoPreview = ?, loadstring = ?, views = ?, likes = ?
        WHERE id = ?
    `);

    stmt.run(title, game, tagsStr, dateStr, isKeyless, isExecutor, thumbnail, videoPreview, loadstring, views, likes, id);
    return getScriptById(id);
}

function deleteScript(id) {
    const stmt = db.prepare('DELETE FROM scripts WHERE id = ?');
    stmt.run(id);
    return true;
}

function deleteMultipleScripts(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return 0;
    const placeholders = ids.map(() => '?').join(',');
    const stmt = db.prepare(`DELETE FROM scripts WHERE id IN (${placeholders})`);
    stmt.run(...ids);
    return ids.length;
}

function incrementView(id) {
    const stmt = db.prepare('UPDATE scripts SET views = views + 1 WHERE id = ?');
    stmt.run(id);
}

// Config Operations
function getConfig() {
    const stmt = db.prepare('SELECT value FROM config WHERE key = ?');
    const row = stmt.get('site_config');
    if (!row || !row.value) return DEFAULT_CONFIG;
    try {
        return { ...DEFAULT_CONFIG, ...JSON.parse(row.value) };
    } catch (e) {
        return DEFAULT_CONFIG;
    }
}

function saveConfig(newConfig) {
    const current = getConfig();
    const merged = { ...current, ...newConfig };
    const stmt = db.prepare('INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)');
    stmt.run('site_config', JSON.stringify(merged));
    return merged;
}

// Ban Management
function isIpBanned(ip) {
    if (!ip) return false;
    const stmt = db.prepare('SELECT * FROM banned_ips WHERE ip = ? AND active = 1');
    const row = stmt.get(ip);
    if (!row) return false;
    if (row.banned_until > 0 && row.banned_until < Date.now()) {
        db.prepare('UPDATE banned_ips SET active = 0 WHERE ip = ?').run(ip);
        return false;
    }
    return true;
}

function banIp(ip, durationHours = 24, reason = 'Bypass attempt') {
    const bannedAt = Date.now();
    const bannedUntil = durationHours > 0 ? bannedAt + (durationHours * 3600 * 1000) : 0; // 0 = permanent
    const stmt = db.prepare('INSERT OR REPLACE INTO banned_ips (ip, banned_until, duration_hours, banned_at, reason, active) VALUES (?, ?, ?, ?, ?, 1)');
    stmt.run(ip, bannedUntil, durationHours, bannedAt, reason);
    return { ip, bannedUntil, reason };
}

function unbanIp(ip) {
    const stmt = db.prepare('UPDATE banned_ips SET active = 0 WHERE ip = ?');
    stmt.run(ip);
    return true;
}

function getBannedIps() {
    const stmt = db.prepare('SELECT * FROM banned_ips WHERE active = 1 ORDER BY banned_at DESC');
    return stmt.all();
}

// Stats & Maintenance
function getDatabaseStats() {
    const scriptCount = db.prepare('SELECT COUNT(*) as count FROM scripts').get().count;
    const viewsSum = db.prepare('SELECT SUM(views) as total FROM scripts').get().total || 0;
    const likesSum = db.prepare('SELECT SUM(likes) as total FROM scripts').get().total || 0;
    const bannedCount = db.prepare('SELECT COUNT(*) as count FROM banned_ips WHERE active = 1').get().count;

    return {
        totalScripts: scriptCount,
        totalViews: viewsSum,
        totalLikes: likesSum,
        totalBannedIps: bannedCount
    };
}

function resetDefaultScripts() {
    db.exec('DELETE FROM scripts');
    const insertStmt = db.prepare(`
        INSERT INTO scripts (id, title, game, tags, date, isKeyless, isExecutor, thumbnail, videoPreview, loadstring, views, likes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const s of DEFAULT_SCRIPTS) {
        insertStmt.run(
            s.id,
            s.title,
            s.game,
            s.tags,
            s.date,
            s.isKeyless ? 1 : 0,
            s.isExecutor ? 1 : 0,
            s.thumbnail,
            s.videoPreview,
            s.loadstring,
            s.views,
            s.likes,
            s.created_at
        );
    }
    return getAllScripts();
}

function clearAllScripts() {
    db.exec('DELETE FROM scripts');
    return [];
}

module.exports = {
    getAllScripts,
    getScriptById,
    addScript,
    updateScript,
    deleteScript,
    deleteMultipleScripts,
    incrementView,
    getConfig,
    saveConfig,
    isIpBanned,
    banIp,
    unbanIp,
    getBannedIps,
    getDatabaseStats,
    resetDefaultScripts,
    clearAllScripts,
    DEFAULT_CONFIG,
    DEFAULT_SCRIPTS
};
