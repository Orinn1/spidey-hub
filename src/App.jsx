import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Header';
import FilterTabs from './components/FilterTabs';
import ScriptCard from './components/ScriptCard';
import ScriptModal from './components/ScriptModal';
import SecurityGateModal from './components/SecurityGateModal';
import Toast from './components/Toast';
import SpideyLogo from './components/SpideyLogo';
import { fetchScriptsFromFirebase, fetchSettingsFromFirebase } from './services/firebase';
export default function App() {
  const [scripts, setScripts] = useState(() => {
    try {
      const raw = localStorage.getItem('spidey_scripts_cache');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [settings, setSettings] = useState({
    siteTitle: 'Spidey',
    siteHandle: '@Spidey',
    announcementText: '',
    discordUrl: 'https://discord.gg',
    youtubeUrl: 'https://youtube.com',
    gateEnabled: true,
    gateProvider: 'shrinkearn',
    gateProviderName: 'ShrinkEarn',
    gateUrl: 'https://srnky.com/aehfqq0',
    gateToken: 'spidey_vip',
    gateExpiryHours: 24,
    gateTutorialUrl: 'https://youtu.be/FdXsvivWhOw',
    gateCustomMessage: '',
  });
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const r = await fetchScriptsFromFirebase();
        if (r && Array.isArray(r.scripts)) {
          setScripts(r.scripts);
        }
      } catch (_) {}
      try {
        const s = await fetchSettingsFromFirebase();
        if (s) {
          setSettings((prev) => ({
            ...prev,
            ...s,
            gateEnabled: s.gateEnabled !== false,
          }));
        }
      } catch (_) {}
    };

    loadData();

    // Re-check when window regains focus (switching back from Admin tab)
    const onFocus = () => loadData();
    window.addEventListener('focus', onFocus);

    // Cross-tab storage sync
    const onStorage = (e) => {
      if (e.key === 'spidey_scripts_cache' && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setScripts(parsed);
        } catch (_) {}
      }
      if (e.key === 'spidey_channel_ping') {
        loadData();
      }
    };
    window.addEventListener('storage', onStorage);

    // Real-time broadcast channel
    let bc = null;
    try {
      bc = new BroadcastChannel('spidey_hub_channel');
      bc.onmessage = () => loadData();
    } catch (_) {}

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  const toast = (msg) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message: msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 2500);
  };

  const counts = useMemo(() => ({
    all: scripts.length,
    keyless: scripts.filter((s) => s.isKeyless && !s.isExecutor).length,
    keysystem: scripts.filter((s) => !s.isKeyless && !s.isExecutor).length,
    executor: scripts.filter((s) => s.isExecutor).length,
  }), [scripts]);

  const list = useMemo(() => {
    return scripts.filter((s) => {
      if (tab === 'executor' && !s.isExecutor) return false;
      if (tab === 'keyless' && (!s.isKeyless || s.isExecutor)) return false;
      if (tab === 'keysystem' && (s.isKeyless || s.isExecutor)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          (s.title && s.title.toLowerCase().includes(q)) ||
          (s.game && s.game.toLowerCase().includes(q)) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)));
        if (!match) return false;
      }
      return true;
    });
  }, [scripts, tab, search]);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} settings={settings} />

      {settings.announcementText && (
        <div className="notice-bar">
          <span>📢</span> {settings.announcementText}
        </div>
      )}

      <FilterTabs activeTab={tab} setActiveTab={setTab} counts={counts} />

      <main className="scripts-section">
        <div className="wrap">
          <div className="scripts-head">
            <div className="scripts-head-label">
              ผลลัพธ์ <b>{list.length}</b> รายการ
            </div>
          </div>

          {list.length > 0 ? (
            <div className={`grid grid-items-${Math.min(list.length, 3)}`}>
              {list.map((s) => (
                <ScriptCard key={s.id} script={s} onClick={() => setSelected(s)} />
              ))}
            </div>
          ) : (
            <div className="empty-box">
              <h3>ไม่เจอสคริปต์</h3>
              <p>ลองเปลี่ยนคำค้นหาหรือเลือกหมวดอื่นดู</p>
              <button className="btn-reset" onClick={() => { setSearch(''); setTab('all'); }}>
                ดูทั้งหมด
              </button>
            </div>
          )}
        </div>
      </main>

      {selected && (
        <ScriptModal
          script={selected}
          settings={settings}
          onClose={() => setSelected(null)}
          onCopy={toast}
        />
      )}

      <Toast toasts={toasts} />

      <SecurityGateModal settings={settings} onUnlock={toast} />

      <footer className="site-footer">
        <div className="wrap footer-wrap">
          <div className="footer-brand">
            <div className="footer-logo">
              <SpideyLogo size={24} />
              <span className="footer-logo-title">{settings.siteTitle || 'Spidey'}</span>
              <span className="footer-logo-badge">HUB</span>
            </div>
            <p className="footer-tagline">
              Roblox Script Hub — คลังสคริปต์ปลอดภัย ใช้งานฟรี อัปเดตล่าสุด
            </p>
          </div>

          <div className="footer-nav">
            <span className="footer-nav-title">คอมมูนิตี้ & ติดตาม</span>
            <div className="footer-nav-links">
              {settings.discordUrl && (
                <a href={settings.discordUrl} target="_blank" rel="noreferrer" className="footer-link">
                  <svg width="15" height="15" viewBox="0 0 24 18" fill="currentColor"><path d="M20.317 1.492a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0A12.64 12.64 0 0 0 8.64.014a.077.077 0 0 0-.079-.037 19.74 19.74 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 6.171-.32 10.706.099 15.182a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/></svg>
                  <span>Discord Community</span>
                </a>
              )}
              {settings.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className="footer-link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  <span>YouTube Channel</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="wrap footer-bottom-inner">
            <span>© 2026 {settings.siteTitle || 'Spidey'}. All rights reserved.</span>
            <span className="footer-disclaimer">Not affiliated with Roblox Corporation.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
