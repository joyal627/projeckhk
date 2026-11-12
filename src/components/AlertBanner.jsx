import React from 'react';
import { AlertCircle, ArrowRight, MessageCircle } from 'lucide-react';

export function AlertBanner({ items, t, lang, onOpenWhatsApp, onSelectItem }) {
  const criticalItems = items.filter(i => i.quantity <= i.minThreshold);

  if (criticalItems.length === 0) {
    return null;
  }

  const outOfStockItems = criticalItems.filter(i => i.quantity <= 0);
  const lowItems = criticalItems.filter(i => i.quantity > 0);

  return (
    <section className="alert-banner-box">
      <div className="alert-banner-header">
        <div className="alert-banner-title">
          <AlertCircle className="alert-pulse-icon" size={24} />
          <div>
            <h3>{t.stockAlertTitle}</h3>
            <p>
              {outOfStockItems.length > 0 && (
                <span className="badge badge-danger mr-2">
                  {outOfStockItems.length} {t.statusOut}
                </span>
              )}
              {lowItems.length > 0 && (
                <span className="badge badge-warning">
                  {lowItems.length} {t.statusLow}
                </span>
              )}
            </p>
          </div>
        </div>

        <button 
          type="button" 
          className="btn btn-whatsapp"
          onClick={onOpenWhatsApp}
        >
          <MessageCircle size={18} />
          <span>{t.shareWhatsApp}</span>
        </button>
      </div>

      <div className="alert-chips-list">
        {criticalItems.map(item => {
          const isOut = item.quantity <= 0;
          return (
            <div 
              key={item.id} 
              className={`alert-chip ${isOut ? 'alert-chip-danger' : 'alert-chip-warning'}`}
              onClick={() => onSelectItem(item)}
            >
              <span className="chip-name">
                {lang === 'ml' && item.nameMl ? item.nameMl : item.name}
              </span>
              <span className="chip-qty">
                {item.quantity} / {item.minThreshold} {item.unit}
              </span>
              <span className="chip-badge">
                {isOut ? t.statusOut : t.statusLow}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
