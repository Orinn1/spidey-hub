import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, ExternalLink, PlayCircle, ChevronDown, Info, CheckCircle2 } from 'lucide-react';

function getYouTubeEmbedUrl(url) {
  if (!url) return 'https://www.youtube-nocookie.com/embed/FdXsvivWhOw?autoplay=1&rel=0';
  try {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&]/)[0];
    } else if (url.includes('youtube.com/watch')) {
      const u = new URL(url);
      videoId = u.searchParams.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split(/[?&]/)[0];
    }
    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    }
  } catch (_) {}
  return url;
}

function checkIsAuthorized(settings) {
  // If gate is explicitly disabled in settings, allow access
  if (settings.gateEnabled === false) return true;

  // 1. Check URL parameters for reset/relock testing (?lock=1, ?reset=1, ?test=1)
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('lock') || params.has('reset') || params.has('relock') || params.has('test')) {
      localStorage.removeItem('spidey_gate_auth_expiry');
      sessionStorage.removeItem('spidey_gate_auth');
      window.history.replaceState({}, document.title, window.location.pathname);
      return false; // Force gate to appear!
    }

    // Check URL parameters for successful redirect after completing shortlink
    const urlToken = params.get('token') || params.get('access_token') || params.get('key') || params.get('auth');
    const expected = (settings.gateToken || 'spidey_vip').trim().toLowerCase();
    const isTokenMatch = urlToken && (
      urlToken.trim().toLowerCase() === expected ||
      urlToken.trim().toLowerCase() === 'spidey_vip'
    );
    const isPassedFlag = params.get('unlock') === '1' || params.get('passed') === '1' || params.get('verified') === '1';

    if (isTokenMatch || isPassedFlag) {
      const hours = Number(settings.gateExpiryHours || 24);
      const expiry = Date.now() + hours * 3600 * 1000;
      localStorage.setItem('spidey_gate_auth_expiry', String(expiry));
      sessionStorage.setItem('spidey_gate_auth', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
  } catch (_) {}

  // 2. Check unexpired authorization in localStorage
  try {
    const savedExpiry = localStorage.getItem('spidey_gate_auth_expiry');
    if (savedExpiry) {
      const expiryTime = Number(savedExpiry);
      if (!isNaN(expiryTime) && Date.now() < expiryTime) {
        return true;
      } else {
        localStorage.removeItem('spidey_gate_auth_expiry');
        sessionStorage.removeItem('spidey_gate_auth');
      }
    }
  } catch (_) {}

  // 3. Check sessionStorage
  try {
    if (sessionStorage.getItem('spidey_gate_auth') === 'true') {
      return true;
    }
  } catch (_) {}

  // User has NEVER passed the link -> MUST SHOW GATE!
  return false;
}

export default function SecurityGateModal({ settings = {}, onUnlock }) {
  const isEnabled = settings.gateEnabled !== false;

  const [unlocked, setUnlocked] = useState(() => checkIsAuthorized(settings));
  const [closing, setClosing] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const [checkFeedback, setCheckFeedback] = useState('');

  // Re-check when gateEnabled changes
  useEffect(() => {
    setUnlocked(checkIsAuthorized(settings));
  }, [settings.gateEnabled]);

  // Sync unlock across browser tabs & window focus
  useEffect(() => {
    const checkAuth = () => {
      if (checkIsAuthorized(settings)) {
        handleUnlockSuccess();
      }
    };

    const handleFocus = () => {
      // If user completed shortlink in another tab, that tab wrote to localStorage
      checkAuth();
    };

    const onStorage = (e) => {
      if (e.key === 'spidey_gate_auth_expiry') {
        checkAuth();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', handleFocus);
    };
  }, [settings]);

  // Prevent background scroll when gate is active
  useEffect(() => {
    if (!unlocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [unlocked]);

  if (!isEnabled || unlocked) {
    return null;
  }

  // Provider resolution (supports ShrinkEarn, LootLabs, Linkvertise, Droplink, or any custom provider)
  const shortlinkUrl = (settings.gateUrl || settings.shrinkearnUrl || settings.lootlabsTier1Url || 'https://srnky.com/aehfqq0').trim();
  
  // Auto-detect provider name from shortlink URL
  let providerName = settings.gateProviderName || '';
  if (!providerName) {
    const lower = shortlinkUrl.toLowerCase();
    if (lower.includes('shrinkearn') || lower.includes('srnky')) providerName = 'ShrinkEarn';
    else if (lower.includes('loot')) providerName = 'LootLabs';
    else if (lower.includes('linkvertise')) providerName = 'Linkvertise';
    else if (lower.includes('droplink')) providerName = 'Droplink';
    else providerName = 'ลิงก์สนับสนุน';
  }

  const tutorialVideoUrl = (settings.gateTutorialUrl || 'https://youtu.be/FdXsvivWhOw').trim();
  const expiryHours = Number(settings.gateExpiryHours || 24);

  const handleLinkClick = (e) => {
    if (e) e.preventDefault();
    if (shortlinkUrl) {
      try {
        window.open(shortlinkUrl, '_blank');
      } catch (_) {
        window.location.href = shortlinkUrl;
      }
    }
    setHasOpenedLink(true);
    setCheckFeedback('');
  };

  const handleUnlockSuccess = () => {
    const expiry = Date.now() + expiryHours * 3600 * 1000;
    try {
      localStorage.setItem('spidey_gate_auth_expiry', String(expiry));
      sessionStorage.setItem('spidey_gate_auth', 'true');
    } catch (_) {}

    setClosing(true);
    setTimeout(() => {
      setUnlocked(true);
      if (onUnlock) onUnlock('ปลดล็อคเข้าสู่เว็บไซต์สำเร็จแล้ว');
    }, 350);
  };

  const handleCheckStatus = () => {
    if (checkIsAuthorized(settings)) {
      handleUnlockSuccess();
    } else {
      setCheckFeedback('ยังไม่พบการผ่านลิงก์ย่อ กรุณาทำรายการในหน้าเว็บย่อลิงก์ให้เสร็จสิ้นก่อนครับ');
      setTimeout(() => setCheckFeedback(''), 4500);
    }
  };

  const handleTokenSubmit = (e) => {
    if (e) e.preventDefault();
    const val = tokenInput.trim().toLowerCase();
    if (!val) return;

    const expectedToken = (settings.gateToken || 'spidey_vip').trim().toLowerCase();

    if (val === expectedToken || val === 'spidey_vip') {
      handleUnlockSuccess();
    } else {
      setErrorMsg('รหัส Token ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
      setTimeout(() => setErrorMsg(''), 3500);
    }
  };

  const toggleTutorial = () => {
    setShowTutorial((prev) => !prev);
  };

  return (
    <div className={`lootlabs-gate-overlay ${closing ? 'gate-fade-out' : ''}`}>
      <div className="lootlabs-gate-box">
        {/* Pill Badge */}
        <div className="lootlabs-gate-badge">
          <ShieldAlert size={14} />
          <span>SECURITY ACCESS GATE</span>
        </div>

        {/* Lock Icon Box */}
        <div className="lootlabs-gate-icon">
          <Lock size={26} />
        </div>

        {/* Title & Description */}
        <h2 className="lootlabs-gate-title">ปลดล็อคเพื่อเข้าสู่เว็บไซต์</h2>
        <p className="lootlabs-gate-desc">
          {settings.gateCustomMessage ||
            'กรุณากดข้ามโฆษณาผ่านลิงก์สนับสนุน เพื่อปลดล็อคการเข้าใช้งานเว็บไซต์'}
        </p>

        {/* Action Button: Opens shortlink */}
        <button
          type="button"
          className="btn-gate-lootlabs"
          onClick={handleLinkClick}
        >
          <ExternalLink size={18} />
          <span>{hasOpenedLink ? 'กดข้ามโฆษณาเพื่อเข้าเว็บไซต์ (เปิดลิงก์อีกครั้ง)' : 'กดข้ามโฆษณาเพื่อเข้าเว็บไซต์'}</span>
        </button>

        {/* Pending status waiting for shortlink completion */}
        {hasOpenedLink && (
          <div className="gate-pending-box">
            <div className="gate-pending-header">
              <span className="gate-pulse-dot"></span>
              <span>กรุณาทำรายการผ่านลิงก์ย่อให้เสร็จ</span>
            </div>
            <p className="gate-pending-desc">
              เมื่อท่านข้ามโฆษณาเสร็จ ระบบจะนำทางกลับมาและปลดล็อคเข้าสู่เว็บโดยอัตโนมัติ
            </p>
            <button
              type="button"
              className="btn-gate-verify"
              onClick={handleCheckStatus}
            >
              🔄 กดเพื่อตรวจสอบสถานะอีกครั้ง
            </button>
            {checkFeedback && <div className="gate-feedback-msg">{checkFeedback}</div>}
          </div>
        )}

        {/* Video Tutorial Toggle Row */}
        <div className="gate-tutorial-row">
          <button type="button" className="btn-gate-tutorial" onClick={toggleTutorial}>
            <PlayCircle size={16} />
            <span>{showTutorial ? 'ซ่อนคลิปสอนวิธีผ่าน' : 'ดูคลิปสอนวิธีผ่านลิงก์ (คลิกที่นี่)'}</span>
            <ChevronDown
              size={14}
              style={{
                transform: showTutorial ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>

        {/* Video Tutorial Player Box */}
        {showTutorial && (
          <div className="gate-tutorial-player-box">
            <div className="gate-tutorial-video-wrapper">
              <iframe
                src={getYouTubeEmbedUrl(tutorialVideoUrl)}
                title={`วิธีผ่านลิงก์ ${providerName}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="gate-tutorial-actions">
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>คลิปสั้นเข้าใจง่าย ดูจบทำตามได้ทันที</span>
              <a
                href={tutorialVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gate-tutorial-yt-link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444" style={{ flexShrink: 0 }}>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>เปิดดูบน YouTube</span>
              </a>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="gate-divider">
          <span>หรือยืนยันด้วย ACCESS TOKEN</span>
        </div>

        {/* Token Form */}
        <form className="gate-token-form" onSubmit={handleTokenSubmit}>
          <input
            type="text"
            className="gate-token-input"
            placeholder="กรอก Access Token"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
          />
          <button type="submit" className="btn-gate-token">
            ปลดล็อค
          </button>
        </form>

        {errorMsg && <div className="gate-error-msg">{errorMsg}</div>}

        {/* Footer Hint */}
        <div className="gate-footer-hint">
          <Info size={14} />
          <span>เมื่อยืนยันสำเร็จ ระบบจะจดจำเครื่องนี้ไว้ให้เข้าได้ตลอด {expiryHours} ชั่วโมง</span>
        </div>
      </div>
    </div>
  );
}
