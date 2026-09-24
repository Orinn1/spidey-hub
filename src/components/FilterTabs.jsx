import React from 'react';

export default function FilterTabs({ activeTab, setActiveTab, counts }) {
  const tabs = [
    { id: 'all', label: 'ทั้งหมด', count: counts.all },
    { id: 'keyless', label: 'Keyless', count: counts.keyless },
    { id: 'keysystem', label: 'Key System', count: counts.keysystem },
    { id: 'executor', label: 'Executor', count: counts.executor },
  ];

  return (
    <div className="tabs-bar">
      <div className="wrap">
        <div className="tabs-row">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? 'on' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
              <span className="tab-count">{t.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
