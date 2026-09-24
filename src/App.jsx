import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FilterTabs from './components/FilterTabs';
import ScriptCard from './components/ScriptCard';
import ScriptModal from './components/ScriptModal';
import Toast from './components/Toast';
import { fetchScriptsFromFirebase, fetchSettingsFromFirebase } from './services/firebase';
import { FALLBACK_SCRIPTS } from './data/fallbackScripts';
import { SearchX, ShieldAlert } from 'lucide-react';

export default function App() {
  const [scripts, setScripts] = useState(FALLBACK_SCRIPTS);
  const [settings, setSettings] = useState({
    siteTitle: 'Spidey',
    siteHandle: '@Spidey',
    announcementText: 'อัปเดตสคริปต์ Steal An Egg และ Blox Fruits ตัวล่าสุดแล้ววันนี้!',
    discordUrl: 'https://discord.gg',
    youtubeUrl: 'https://youtube.com',
  });
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedScript, setSelectedScript] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Fetch Firestore Data on Mount
  useEffect(() => {
    async function initData() {
      try {
        const scriptRes = await fetchScriptsFromFirebase();
        if (scriptRes && scriptRes.scripts) {
          setScripts(scriptRes.scripts);
        }
      } catch (err) {
        console.warn('Scripts load error:', err);
      }

      try {
        const setRes = await fetchSettingsFromFirebase();
        if (setRes) {
          setSettings(setRes);
        }
      } catch (err) {
        console.warn('Settings load error:', err);
      }
    }
    initData();
  }, []);

  const addToast = (msg) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message: msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: scripts.length,
      executor: scripts.filter((s) => s.isExecutor).length,
      keyless: scripts.filter((s) => s.isKeyless && !s.isExecutor).length,
      keysystem: scripts.filter((s) => !s.isKeyless && !s.isExecutor).length,
    };
  }, [scripts]);

  // Filtered and searched scripts
  const filteredScripts = useMemo(() => {
    return scripts.filter((item) => {
      // Tab matching
      let tabMatch = true;
      if (activeTab === 'executor') {
        tabMatch = item.isExecutor === true;
      } else if (activeTab === 'keyless') {
        tabMatch = item.isKeyless === true && !item.isExecutor;
      } else if (activeTab === 'keysystem') {
        tabMatch = !item.isKeyless && !item.isExecutor;
      }

      // Search matching
      let searchMatch = true;
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTitle = item.title && item.title.toLowerCase().includes(q);
        const inGame = item.game && item.game.toLowerCase().includes(q);
        const inTags = item.tags && item.tags.some((t) => t.toLowerCase().includes(q));
        searchMatch = inTitle || inGame || inTags;
      }

      return tabMatch && searchMatch;
    });
  }, [scripts, activeTab, search]);

  return (
    <div className="app-wrapper">
      {/* Background Ambient Cyber Lights */}
      <div className="cyber-canvas-container">
        <div className="cyber-grid-overlay"></div>
        <div className="aurora-glow-1"></div>
        <div className="aurora-glow-2"></div>
      </div>

      {/* Navigation */}
      <Header settings={settings} />

      {/* Hero Section */}
      <Hero search={search} setSearch={setSearch} scripts={scripts} />

      {/* Filter Tabs */}
      <FilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={counts}
      />

      {/* Main Content Grid */}
      <main className="container" style={{ flexGrow: 1 }}>
        <div className="section-meta-row">
          <div className="results-count">
            พบสคริปต์ทั้งหมด <b>{filteredScripts.length}</b> รายการ
          </div>
        </div>

        {filteredScripts.length > 0 ? (
          <div className="scripts-grid">
            {filteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                onClick={() => setSelectedScript(script)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <SearchX size={44} className="empty-icon" />
            <h3 className="empty-title">ไม่พบสคริปต์ที่ค้นหา</h3>
            <p className="empty-desc">
              ลองเปลี่ยนคำค้นหา เช่น ชื่อเกม หรือเลือกหมวดหมู่อื่นดูนะครับ
            </p>
            <button
              className="nav-btn primary"
              onClick={() => {
                setSearch('');
                setActiveTab('all');
              }}
            >
              ดูสคริปต์ทั้งหมด
            </button>
          </div>
        )}
      </main>

      {/* Script Detail Modal */}
      {selectedScript && (
        <ScriptModal
          script={selectedScript}
          onClose={() => setSelectedScript(null)}
          onCopy={addToast}
        />
      )}

      {/* Floating Toasts */}
      <Toast toasts={toasts} />

      {/* High-Tech Minimal Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-links">
            <a href="https://discord.gg" target="_blank" rel="noreferrer" className="footer-link">
              Discord
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-link">
              YouTube
            </a>
            <a href="/admin.html" className="footer-link" style={{ opacity: 0.4 }}>
              Admin Console
            </a>
          </div>
          <p>© 2026 Spidey Hub. Designed with Cyber Obsidian Aesthetics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
