import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-area">
      {toasts.map((t) => (
        <div key={t.id} className="toast-msg">
          <CheckCircle size={16} color="#22c55e" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
