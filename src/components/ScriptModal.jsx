import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Lock, Unlock, ExternalLink, ShieldCheck, Play, Terminal } from 'lucide-react';

const FALLBACK_THUMB = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80";

export default function ScriptModal({ script, onClose, onCopy }) {
  const [unlocked, setUnlocked] = useState(!script.sub2unlock);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleUnlockClick = () => {
    // Open target link
    const targetUrl = script.channelUrl || 'https://youtube.com';
    window.open(targetUrl, '_blank');

    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setUnlocked(true);
    }, 2500);
  };

  const handleCopyScript = () => {
    if (!script.loadstring) return;
    navigator.clipboard.writeText(script.loadstring);
    setCopied(true);
    onCopy('คัดลอกสคริปต์เรียบร้อยแล้ว!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Banner with close button */}
        <div className="modal-header-banner">
          <img
            src={script.thumbnail || FALLBACK_THUMB}
            alt={script.title}
            className="modal-banner-img"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_THUMB;
            }}
          />
          <div className="modal-banner-scrim"></div>

          <button className="modal-close-btn" onClick={onClose} title="ปิดหน้าต่าง">
            <X size={20} />
          </button>

          <div className="modal-header-meta">
            <span className="card-game-title" style={{ color: '#00F5A0' }}>
              {script.game || 'Roblox Script'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="verified-badge">
                <ShieldCheck size={12} style={{ display: 'inline', marginRight: '3px' }} />
                VERIFIED & TESTED
              </span>
              {script.isKeyless && (
                <span className="type-pill keyless" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                  KEYLESS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <h2 className="modal-title">{script.title}</h2>

          {/* Sub2Unlock Flow */}
          {!unlocked ? (
            <div className="sub2unlock-box">
              <div className="lock-shield-icon">
                <Lock size={26} />
              </div>
              <h3 className="unlock-title">สคริปต์นี้ถูกล็อคไว้ (Sub2Unlock)</h3>
              <p className="unlock-desc">
                กรุณากดติดตามช่องหรือเข้าร่วมชุมชน เพื่อปลดล็อคโค้ดสคริปต์ฟรีทันที
              </p>
              <button
                className="unlock-btn"
                onClick={handleUnlockClick}
                disabled={isUnlocking}
              >
                {isUnlocking ? (
                  <>
                    <span className="pulse-dot"></span>
                    กำลังตรวจสอบการติดตาม...
                  </>
                ) : (
                  <>
                    <ExternalLink size={16} />
                    กดเพื่อติดตามและปลดล็อค
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Lua Code Box */}
              <div className="code-container">
                <div className="code-header">
                  <div className="code-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>spidey-loader.lua</span>
                  <button
                    className={`copy-code-btn ${copied ? 'copied' : ''}`}
                    onClick={handleCopyScript}
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        คัดลอกแล้ว!
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        คัดลอกสคริปต์
                      </>
                    )}
                  </button>
                </div>
                <pre className="code-pre">
                  <code>{script.loadstring || '-- ไม่พบโค้ดสคริปต์'}</code>
                </pre>
              </div>

              {/* Quick Run Guide */}
              <div className="instructions-box">
                <h4>🚀 วิธีการใช้งานสคริปต์:</h4>
                <ol>
                  <li>เปิดตัวเกม Roblox และเข้าแมพ <b>{script.game || 'ที่ต้องการ'}</b></li>
                  <li>เปิดโปรแกรมรันสคริปต์ (Executor) เช่น Delta, Fluxus, Codex หรืออื่นๆ</li>
                  <li>กดปุ่ม <b>"คัดลอกสคริปต์"</b> ด้านบน แล้วนำไปวางในช่องรันสคริปต์</li>
                  <li>กดปุ่ม <b>Execute / Inject</b> เพื่อเริ่มใช้งานทันที!</li>
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
