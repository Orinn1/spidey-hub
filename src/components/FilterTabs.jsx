import React from 'react';
import { Globe, Zap, KeyRound, Lock, ArrowDownUp } from 'lucide-react';

export default function FilterTabs({ activeTab, setActiveTab, counts, sortBy, setSortBy }) {
  const tabs = [
    { id: 'all', label: 'ทั้งหมด', icon: Globe, count: counts.all },
    { id: 'executor', label: 'ตัวรัน (Executor)', icon: Zap, count: counts.executor },
    { id: 'keyless', label: 'ไม่ต้องผ่านคีย์ (Keyless)', icon: KeyRound, count: counts.keyless },
    { id: 'keysystem', label: 'มีระบบคีย์ (KeySystem)', icon: Lock, count: counts.keysystem },
  ];

  return (
    <div className="controls-wrapper">
      <div className="container">
        <div className="tabs-scroll-wrapper">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`filter-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                <span className="tab-badge">{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
