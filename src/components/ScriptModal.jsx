import React, { useState, useEffect } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60";

export default function ScriptModal({ script, onClose, onCopy }) {
  const [unlocked, setUnlocked] = useState(!script.sub2unlock);
  const [waiting, setWaiting] = useState(false);
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

  const handleUnlock = () => {
    window.open(script.channelUrl || 'https://youtube.com', '_blank');
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
      setUnlocked(true);
    }, 2500);
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
          <h2 className="modal-title">{script.title}</h2>

          {!unlocked ? (
            <div className="s2u-box">
              <div className="s2u-icon">🔒</div>
              <div className="s2u-title">ต้องกดติดตามก่อนนะ</div>
              <p className="s2u-desc">กดปุ่มด้านล่างเพื่อติดตามช่อง แล้วรอสักครู่จะปลดล็อคให้เอง</p>
              <button className="s2u-btn" onClick={handleUnlock} disabled={waiting}>
                {waiting ? 'กำลังตรวจสอบ...' : (
                  <>
                    <ExternalLink size={14} />
                    ติดตามเพื่อปลดล็อค
                  </>
                )}
              </button>
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
                <pre className="code-pre"><code>{script.loadstring || '-- ไม่มีโค้ด'}</code></pre>
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
