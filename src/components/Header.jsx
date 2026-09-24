import React from 'react';
import { Search } from 'lucide-react';
import SpideyLogo from './SpideyLogo';

export default function Navbar({ search, setSearch, settings }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <SpideyLogo size={28} />
          <div className="nav-logo-text-group">
            <span className="nav-logo-title">{settings.siteTitle || 'Spidey'}</span>
            <span className="nav-logo-badge">HUB</span>
          </div>
        </div>

        <div className="nav-search">
          <Search size={15} className="nav-search-icon" />
          <input
            type="text"
            placeholder="ค้นหาสคริปต์..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="nav-right">
          {settings.discordUrl && (
            <a href={settings.discordUrl} target="_blank" rel="noreferrer" className="nav-discord">
              <svg width="16" height="12" viewBox="0 0 24 18" fill="currentColor"><path d="M20.317 1.492a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0A12.64 12.64 0 0 0 8.64.014a.077.077 0 0 0-.079-.037 19.74 19.74 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 6.171-.32 10.706.099 15.182a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z"/></svg>
              <span>Discord</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
