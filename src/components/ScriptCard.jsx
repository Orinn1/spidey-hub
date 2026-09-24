import React from 'react';
import { Eye } from 'lucide-react';

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60";

export default function ScriptCard({ script, onClick }) {
  const { title, game, tags = [], date, isKeyless, isExecutor, thumbnail, views = 0 } = script;

  let typeClass = 'keysystem';
  let typeText = 'Key System';
  if (isExecutor) {
    typeClass = 'executor';
    typeText = 'Executor';
  } else if (isKeyless) {
    typeClass = 'keyless';
    typeText = 'Keyless';
  }

  const fmtViews = views >= 1000 ? `${(views / 1000).toFixed(1)}k` : String(views);

  return (
    <div className="card" onClick={onClick}>
      <div className="card-thumb">
        <img
          src={thumbnail || FALLBACK_IMG}
          alt=""
          loading="lazy"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
        />
        <span className={`card-type ${typeClass}`}>{typeText}</span>
        <span className="card-views">
          <Eye size={11} />
          {fmtViews}
        </span>
      </div>
      <div className="card-info">
        <div className="card-game">{game || 'Roblox'}</div>
        <h3 className="card-title">{title}</h3>
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map((t, i) => (
              <span key={i} className="card-tag">{t}</span>
            ))}
          </div>
        )}
        <div className="card-bottom">
          <span className="card-date">{date || ''}</span>
          <span className="card-go">ดูสคริปต์ →</span>
        </div>
      </div>
    </div>
  );
}
