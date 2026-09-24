import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Header';
import FilterTabs from './components/FilterTabs';
import ScriptCard from './components/ScriptCard';
import ScriptModal from './components/ScriptModal';
import Toast from './components/Toast';
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
        if (s) setSettings(s);
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
            <div className="grid">
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

      <footer className="site-footer">
        <a href={settings.discordUrl || '#'} target="_blank" rel="noreferrer">Discord</a>
        <a href={settings.youtubeUrl || '#'} target="_blank" rel="noreferrer">YouTube</a>
        <br />
        <span>© 2026 {settings.siteTitle || 'Spidey'}</span>
      </footer>
    </>
  );
}
