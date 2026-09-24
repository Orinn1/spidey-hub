/**
 * Simple-Hub (RocketscriptZ) Full Backend & REST API Server
 * Integrates SQLite database, Admin APIs, Roblox Auto-fetch, and Security.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./db.js');
const FIREBASE_CONFIG = require('./firebase-config.js');

// Real-time Cloud Sync with Firebase Firestore
async function syncToFirebase(type) {
    if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.projectId || !FIREBASE_CONFIG.apiKey) return;
    try {
        if (type === 'scripts' || type === 'all') {
            const scripts = db.getAllScripts();
            const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/hub/database?key=${FIREBASE_CONFIG.apiKey}&updateMask.fieldPaths=scriptsJson`;
            await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        scriptsJson: { stringValue: JSON.stringify(scripts) }
                    }
                })
            });
            console.log('[Firebase Sync] Pushed scripts to Firestore');
        }
        if (type === 'config' || type === 'all') {
            const cfg = db.getConfig();
            const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/hub/config?key=${FIREBASE_CONFIG.apiKey}&updateMask.fieldPaths=configJson`;
            await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        configJson: { stringValue: JSON.stringify(cfg) }
                    }
                })
            });
            console.log('[Firebase Sync] Pushed config to Firestore');
        }
    } catch (err) {
        console.warn('[Firebase Sync Warning]:', err.message);
    }
}

// Initial Sync on boot
syncToFirebase('all');

const PORT = process.env.PORT || 3005;
const DIR = __dirname;

const MIME = {
    '.html': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp'
};

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

// Roblox Auto-fetch Helper
async function fetchRobloxGame(placeIdOrUrl) {
    if (!placeIdOrUrl) throw new Error('Missing placeId or URL');
    let placeId = String(placeIdOrUrl).trim();
    const match = placeId.match(/\b(\d{6,15})\b/);
    if (match) placeId = match[1];

    if (!/^\d+$/.test(placeId)) {
        throw new Error('Invalid Place ID format');
    }

    // Step 1: Get Universe ID
    const universeRes = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
    if (!universeRes.ok) throw new Error('Roblox place not found');
    const universeData = await universeRes.json();
    const universeId = universeData.universeId;

    // Step 2: Get Game Details
    const detailsRes = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
    const detailsData = await detailsRes.json();
    const game = detailsData.data && detailsData.data[0] ? detailsData.data[0] : {};

    // Step 3: Get Thumbnail
    let thumbnail = '';
    try {
        const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeId}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`);
        const thumbData = await thumbRes.json();
        if (thumbData.data && thumbData.data[0] && thumbData.data[0].thumbnails && thumbData.data[0].thumbnails[0]) {
            thumbnail = thumbData.data[0].thumbnails[0].imageUrl;
        }
    } catch (e) {}

    const cleanTitle = (game.name || 'Roblox Game')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/\([^\)]*\)/g, '')
        .trim();

    return {
        placeId,
        universeId,
        title: cleanTitle,
        originalTitle: game.name || cleanTitle,
        description: game.description || '',
        thumbnail: thumbnail || `https://assetgame.roblox.com/Game/Tools/ThumbnailAsset.ashx?aid=${placeId}&fmt=png&wd=420&ht=230`,
        creator: game.creator ? game.creator.name : '',
        playing: game.playing || 0
    };
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

    // =========================================================================
    // API: Config (Site Title, Handle, Announcement, Missions, FAQs)
    // =========================================================================
    if (pathname === '/api/config') {
        if (req.method === 'GET') {
            const config = db.getConfig();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(config));
            return;
        } else if (req.method === 'POST') {
            try {
                const body = await readJsonBody(req);
                const updated = db.saveConfig(body);
                syncToFirebase('config');
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, config: updated }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: err.message }));
            }
            return;
        }
    }

    // =========================================================================
    // API: Scripts CRUD
    // =========================================================================
    if (pathname === '/api/scripts') {
        if (req.method === 'GET') {
            const scripts = db.getAllScripts();
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(scripts));
            return;
        } else if (req.method === 'POST') {
            try {
                const body = await readJsonBody(req);
                if (!body.title || !body.loadstring) {
                    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(JSON.stringify({ error: 'Title and Loadstring are required' }));
                    return;
                }
                const saved = db.addScript(body);
                syncToFirebase('scripts');
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, script: saved }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: err.message }));
            }
            return;
        }
    }

    // API: Update Existing Script (Edit Anything!)
    if (pathname === '/api/scripts/update' && req.method === 'POST') {
        try {
            const body = await readJsonBody(req);
            if (!body.id) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Missing script ID' }));
                return;
            }
            const updated = db.updateScript(body.id, body);
            if (!updated) {
                res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Script not found' }));
                return;
            }
            syncToFirebase('scripts');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, script: updated }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // API: Delete Script
    if (pathname === '/api/scripts/delete' && req.method === 'POST') {
        try {
            const { id } = await readJsonBody(req);
            if (!id) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Missing script id' }));
                return;
            }
            db.deleteScript(id);
            syncToFirebase('scripts');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, id }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // API: Delete Multiple Scripts (Batch Delete)
    if (pathname === '/api/scripts/delete-multiple' && req.method === 'POST') {
        try {
            const { ids } = await readJsonBody(req);
            if (!Array.isArray(ids) || ids.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Missing ids array' }));
                return;
            }
            const count = db.deleteMultipleScripts(ids);
            syncToFirebase('scripts');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, deletedCount: count }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // API: Increment Views
    if (pathname === '/api/scripts/view' && req.method === 'POST') {
        try {
            const { id } = await readJsonBody(req);
            if (id) db.incrementView(id);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true }));
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false }));
        }
        return;
    }

    // =========================================================================
    // API: Auto Roblox Game Fetch
    // =========================================================================
    if (pathname === '/api/roblox-game' && req.method === 'GET') {
        const place = parsedUrl.query.placeId || parsedUrl.query.url;
        try {
            const data = await fetchRobloxGame(place);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(data));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // =========================================================================
    // API: Security & Bans
    // =========================================================================
    if (pathname === '/api/check-ban' && req.method === 'GET') {
        const ip = (parsedUrl.query.ip || clientIp).trim();
        const isBanned = db.isIpBanned(ip);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ banned: isBanned, ip }));
        return;
    }

    if (pathname === '/api/admin-ban' && req.method === 'POST') {
        try {
            const { ip, durationHours, reason, action } = await readJsonBody(req);
            if (action === 'unban') {
                db.unbanIp(ip);
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ success: true, message: `Unbanned ${ip}` }));
                return;
            }
            if (!ip) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Missing IP address' }));
                return;
            }
            const banRecord = db.banIp(ip, durationHours || 24, reason || 'Admin Ban');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, banRecord }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (pathname === '/api/banned-ips' && req.method === 'GET') {
        const list = db.getBannedIps();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(list));
        return;
    }

    // =========================================================================
    // API: Database Stats & Maintenance
    // =========================================================================
    if (pathname === '/api/db/stats' && req.method === 'GET') {
        const stats = db.getDatabaseStats();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(stats));
        return;
    }

    if (pathname === '/api/db/reset' && req.method === 'POST') {
        const list = db.resetDefaultScripts();
        syncToFirebase('scripts');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'Reset to default scripts', total: list.length }));
        return;
    }

    if (pathname === '/api/db/clear' && req.method === 'POST') {
        db.clearAllScripts();
        syncToFirebase('scripts');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'All scripts cleared' }));
        return;
    }

    if (pathname === '/api/db/backup' && req.method === 'GET') {
        const scripts = db.getAllScripts();
        const config = db.getConfig();
        res.setHeader('Content-Disposition', 'attachment; filename="simple_hub_backup.json"');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ timestamp: Date.now(), config, scripts }, null, 2));
        return;
    }

    if (pathname === '/api/db/restore' && req.method === 'POST') {
        try {
            const { scripts, config } = await readJsonBody(req);
            if (Array.isArray(scripts)) {
                db.clearAllScripts();
                for (const s of scripts) {
                    db.addScript(s);
                }
            }
            if (config) {
                db.saveConfig(config);
            }
            syncToFirebase('all');
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: true, message: 'Backup restored successfully' }));
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    // =========================================================================
    // Static Files Handler
    // =========================================================================
    let reqPath = decodeURI(pathname);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(DIR, reqPath);

    // Prevent directory traversal
    if (!filePath.startsWith(DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
        return res.end('Forbidden');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
                res.end('<h1 style="color:#ff1a24;font-family:sans-serif;text-align:center;margin-top:100px;">404 Not Found</h1>');
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
                res.end(`Server Error: ${err.code}`);
            }
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Simple-Hub (RocketscriptZ) Server running at:`);
    console.log(`- หน้าบ้าน (Home):  http://localhost:${PORT}/`);
    console.log(`- หลังบ้าน (Admin): http://localhost:${PORT}/admin.html`);
    console.log(`- Database file:   ${path.join(DIR, 'data', 'database.sqlite')}`);
});
