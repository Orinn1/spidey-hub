import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60";

export default function ScriptModal({ script, settings = {}, onClose, onCopy }) {
  // If lock is explicitly disabled in admin (lockEnabled === false), unlock immediately
  const isLockRequired = settings.lockEnabled !== false;

  const [unlocked, setUnlocked] = useState(() => {
    if (!isLockRequired) return true;
    try {
      return sessionStorage.getItem(`spidey_unlocked_${script.id}`) === 'true';
    } catch (_) {
      return false;
    }
  });

  const [completedMissions, setCompletedMissions] = useState({});
  const [verifyingId, setVerifyingId] = useState(null);
  const [lootlabsWaiting, setLootlabsWaiting] = useState(false);
  const [lootlabsCount, setLootlabsCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleCompleteUnlock = () => {
    try {
      sessionStorage.setItem(`spidey_unlocked_${script.id}`, 'true');
    } catch (_) {}
    setUnlocked(true);
  };

  // Build active missions list from admin settings
  const rawMissions = [
    {
      id: 1,
      label: settings.mission1Label || 'กดติดตามช่อง YouTube',
      url: settings.mission1Url || 'https://youtube.com',
    },
    {
      id: 2,
      label: settings.mission2Label || 'เข้าร่วม Discord Community',
      url: settings.mission2Url || 'https://discord.gg',
    },
    {
      id: 3,
      label: settings.mission3Label || 'กดไลค์และคอมเมนต์คลิป',
      url: settings.mission3Url || 'https://youtube.com',
    },
  ];
  const missions = rawMissions.filter((m) => Boolean(m.url && m.url.trim()));

  const allMissionsDone = missions.length > 0 && missions.every((m) => completedMissions[m.id]);

  const handleStartMission = (m) => {
    if (completedMissions[m.id] || verifyingId) return;
    window.open(m.url, '_blank');
    setVerifyingId(m.id);
    setTimeout(() => {
      setCompletedMissions((prev) => ({ ...prev, [m.id]: true }));
      setVerifyingId(null);
    }, 3000);
  };

  const handleLootlabsClick = () => {
    if (!settings.lootlabsTier1Url) return;
    window.open(settings.lootlabsTier1Url, '_blank');
    setLootlabsWaiting(true);
    setLootlabsCount(6);

    let sec = 6;
    const interval = setInterval(() => {
      sec -= 1;
      setLootlabsCount(sec);
      if (sec <= 0) {
        clearInterval(interval);
        setLootlabsWaiting(false);
        handleCompleteUnlock();
      }
    }, 1000);
  };

  const handleCopy = () => {
    if (!script.loadstring) return;
    navigator.clipboard.writeText(script.loadstring);
    setCopied(true);
    onCopy('ก๊อปแล้ว ✓');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <img
            src={script.thumbnail || FALLBACK_IMG}
            alt=""
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          />
          <div className="modal-top-fade"></div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-game">{script.game || 'Roblox'}</div>
          <h2 className="modal-title">{script.title || 'Untitled Script'}</h2>

          {!unlocked ? (
            <div className="s2u-box">
              {settings.redInstructionText && (
                <div className="s2u-instruction">
                  <span>📢</span> {settings.redInstructionText}
                </div>
              )}

              {settings.lootlabsEnabled && settings.lootlabsTier1Url ? (
                /* LootLabs Monetization Gate Mode */
                <div className="s2u-gate-section">
                  <div className="s2u-icon">💎</div>
                  <div className="s2u-title">ปลดล็อคผ่านลิงก์สปอนเซอร์ (LootLabs)</div>
                  <p className="s2u-desc">กดปุ่มด้านล่างเพื่อผ่านระบบลิงก์สปอนเซอร์ แล้วกลับมารับโค้ดสคริปต์ได้ทันที</p>

                  <button
                    className="s2u-btn s2u-lootlabs-btn"
                    onClick={handleLootlabsClick}
                    disabled={lootlabsWaiting}
                  >
                    {lootlabsWaiting ? (
                      <>⏳ กำลังตรวจสอบการปลดล็อค... ({lootlabsCount}s)</>
                    ) : (
                      <>
                        <ExternalLink size={16} />
                        ไปยัง LootLabs เพื่อปลดล็อค
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* 3-Step Missions Sub2Unlock Mode */
                <div className="s2u-gate-section">
                  <div className="s2u-icon">🔒</div>
                  <div className="s2u-title">ภารกิจปลดล็อคสคริปต์ (Sub2Unlock)</div>
                  <p className="s2u-desc">ทำภารกิจด้านล่างให้ครบเพื่อรับโค้ดสคริปต์ฟรี</p>

                  <div className="s2u-missions-list">
                    {missions.map((m, idx) => {
                      const isDone = Boolean(completedMissions[m.id]);
                      const isVerifying = verifyingId === m.id;

                      return (
                        <div key={m.id} className={`s2u-mission-item ${isDone ? 'done' : ''}`}>
                          <div className="s2u-mission-info">
                            <span className="s2u-mission-num">
                              {isDone ? '✓' : idx + 1}
                            </span>
                            <span className="s2u-mission-label">{m.label}</span>
                          </div>

                          <button
                            type="button"
                            className={`s2u-mission-action-btn ${isDone ? 'btn-done' : ''}`}
                            onClick={() => handleStartMission(m)}
                            disabled={isDone || Boolean(verifyingId)}
                          >
                            {isDone ? (
                              <>
                                <CheckCircle2 size={14} /> สำเร็จแล้ว
                              </>
                            ) : isVerifying ? (
                              <>⏳ กำลังตรวจ...</>
                            ) : (
                              <>
                                ทำภารกิจ <ExternalLink size={12} />
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    {allMissionsDone ? (
                      <button className="s2u-unlock-now-btn" onClick={handleCompleteUnlock}>
                        <ShieldCheck size={18} /> ปลดล็อคและดูสคริปต์ทันที!
                      </button>
                    ) : (
                      <div className="s2u-progress-hint">
                        ความคืบหน้า: {Object.values(completedMissions).filter(Boolean).length}/{missions.length} ภารกิจ
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Bypass Button if enabled in Admin */}
              {settings.quickBypassEnabled && (
                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px dashed #333' }}>
                  <button
                    type="button"
                    className="s2u-bypass-btn"
                    onClick={handleCompleteUnlock}
                    title="ปุ่มข้ามสำหรับแอดมินทดสอบ (เปิดใช้งานจากหลังบ้าน)"
                  >
                    ⚡ ข้ามภารกิจ (โหมดแอดมิน)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="code-box">
                <div className="code-bar">
                  <div className="code-bar-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span className="code-bar-name">loader.lua</span>
                  <button className={`copy-btn ${copied ? 'done' : ''}`} onClick={handleCopy}>
                    {copied ? <><Check size={13} /> ก๊อปแล้ว</> : <><Copy size={13} /> ก๊อป</>}
                  </button>
                </div>
                <pre className="code-pre"><code>{script.loadstring || '-- ไม่มีโค้ดสคริปต์'}</code></pre>
              </div>

              <div className="howto">
                <b>วิธีใช้:</b>
                <ol>
                  <li>เปิดเกม {script.game || 'ที่ต้องการ'} ใน Roblox</li>
                  <li>เปิด Executor (Delta, Fluxus, Codex ฯลฯ)</li>
                  <li>กด <b>ก๊อป</b> แล้ววางในช่อง Execute</li>
                  <li>กด Run เสร็จ!</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
