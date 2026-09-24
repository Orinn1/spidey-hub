import React, { useRef, useEffect } from 'react';
import { Search, X, Sparkles, Terminal, Shield, Zap, Eye } from 'lucide-react';

export default function Hero({ search, setSearch, scripts }) {
  const inputRef = useRef(null);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalScripts = scripts.length;
  const keylessCount = scripts.filter(s => s.isKeyless && !s.isExecutor).length;
  const executorCount = scripts.filter(s => s.isExecutor).length;
  const totalViews = scripts.reduce((acc, s) => acc + (s.views || 0), 0);

  return (
    <section className="hero-section">
      <div className="container">
        {/* Top Badge */}
        <div className="hero-pill-badge">
          <Sparkles size={14} />
          <span>CYBER ROBLOX SCRIPT HUB 2026</span>
        </div>

        {/* Main Title */}
        <h1 className="hero-title">
          ปลดล็อคพลังสคริปต์ <br />
          <span className="gradient-text">SPIDEY NEXT-GEN</span>
        </h1>

        <p className="hero-subtitle">
          ศูนย์รวมสคริปต์ Roblox คุณภาพสูง อัปเดตรายวัน ปลอดภัย ไร้แบน พร้อมระบบโหลดสคริปต์ความเร็วสูง
        </p>

        {/* High-Tech Stats Strip */}
        <div className="stats-strip">
          <div className="stat-item">
            <div className="stat-icon-box">
              <Terminal size={18} />
            </div>
            <div className="stat-content">
              <div className="stat-val">{totalScripts}</div>
              <div className="stat-lbl">สคริปต์ทั้งหมด</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon-box">
              <Zap size={18} />
            </div>
            <div className="stat-content">
              <div className="stat-val">{keylessCount}</div>
              <div className="stat-lbl">ไม่ต้องใช้คีย์ (Keyless)</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon-box">
              <Shield size={18} />
            </div>
            <div className="stat-content">
              <div className="stat-val">{executorCount}</div>
              <div className="stat-lbl">ตัวรันยอดนิยม</div>
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-icon-box">
              <Eye size={18} />
            </div>
            <div className="stat-content">
              <div className="stat-val">{totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews}</div>
              <div className="stat-lbl">ยอดดาวน์โหลด/เข้าชม</div>
            </div>
          </div>
        </div>

        {/* High-Tech Search Bar */}
        <div className="search-bar-container" id="scripts-section">
          <div className="search-input-box">
            <Search size={20} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="ค้นหาชื่อเกม เช่น Steal An Egg, Blox Fruits หรือชื่อสคริปต์..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear-btn" onClick={() => setSearch('')} title="ล้างการค้นหา">
                <X size={14} />
              </button>
            )}
            <div className="search-key-hint">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
