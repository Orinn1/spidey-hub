import React from 'react';
import { Eye, Calendar, ChevronRight, Lock, KeyRound, Zap } from 'lucide-react';

const FALLBACK_THUMB = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80";

export default function ScriptCard({ script, onClick }) {
  const { title, game, tags = [], date, isKeyless, isExecutor, thumbnail, views = 0 } = script;

  let pillType = 'keysystem';
  let pillLabel = 'KEY SYSTEM';
  let PillIcon = Lock;

  if (isExecutor) {
    pillType = 'executor';
    pillLabel = 'EXECUTOR';
    PillIcon = Zap;
  } else if (isKeyless) {
    pillType = 'keyless';
    pillLabel = 'KEYLESS';
    PillIcon = KeyRound;
  }

  const formattedViews = views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views;

  return (
    <article className="script-card" onClick={onClick}>
      {/* Thumbnail Area */}
      <div className="card-media">
        <img
          src={thumbnail || FALLBACK_THUMB}
          alt={title}
          className="card-img"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_THUMB;
          }}
        />
        <div className="card-scrim"></div>

        {/* Badges Overlay */}
        <div className="card-badge-layer">
          <span className={`type-pill ${pillType}`}>
            <PillIcon size={12} />
            {pillLabel}
          </span>
          <span className="views-chip">
            <Eye size={12} />
            {formattedViews}
          </span>
        </div>
      </div>

      {/* Body Area */}
      <div className="card-body">
        <span className="card-game-title">{game || 'Roblox Script'}</span>
        <h3 className="card-title" title={title}>{title}</h3>

        {/* Tags */}
        <div className="card-tags">
          {tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="script-tag">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="card-footer">
          <span className="card-date">
            <Calendar size={13} />
            {date || 'ล่าสุด'}
          </span>
          <span className="card-action-btn">
            ดูสคริปต์
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}
