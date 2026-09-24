import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function Header({ settings }) {
  const { siteTitle, siteHandle, announcementText, discordUrl, youtubeUrl } = settings;

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-bar-left">
            <span className="status-pill">
              <span className="pulse-dot"></span>
              LIVE UPDATE
            </span>
            <span className="announcement-text">{announcementText || "ระบบฐานข้อมูลคลาวด์ Spidey Hub เปิดให้บริการแล้ว"}</span>
          </div>
          <div className="top-bar-right">
            {discordUrl && (
              <a href={discordUrl} target="_blank" rel="noreferrer" className="social-chip discord">
                Discord
                <ExternalLink size={12} />
              </a>
            )}
            {youtubeUrl && (
              <a href={youtubeUrl} target="_blank" rel="noreferrer" className="social-chip youtube">
                YouTube
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="main-nav">
        <div className="container nav-container">
          <div className="brand-wrapper" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-icon-aura">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00F5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spider-svg">
                <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="5" fill="#0A1118" stroke="#10B981" strokeWidth="2" />
                <circle cx="12" cy="12" r="2" fill="#00F5A0" />
              </svg>
            </div>
            <div className="brand-title-group">
              <div className="brand-title-row">
                <span className="brand-name">{siteTitle || "Spidey"}</span>
                <span className="verified-badge">
                  <ShieldCheck size={12} style={{ display: 'inline', marginRight: '3px', verticalAlign: '-1px' }} />
                  VERIFIED
                </span>
              </div>
              <span className="brand-tagline">{siteHandle || "@SpideyHub"}</span>
            </div>
          </div>

          <div className="nav-actions">
            <a href="https://discord.gg" target="_blank" rel="noreferrer" className="nav-btn secondary">
              ชุมชน Discord
            </a>
            <a href="#scripts-section" className="nav-btn primary">
              ค้นหาสคริปต์
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
