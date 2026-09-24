import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className="toast">
          <CheckCircle size={18} color="#00F5A0" />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
