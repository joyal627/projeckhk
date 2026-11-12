import React, { useState } from 'react';
import { X, ArrowUpRight, PlusCircle } from 'lucide-react';

export function StockInModal({ item, isOpen, onClose, onConfirm, t, lang }) {
  if (!isOpen || !item) return null;

  const [qty, setQty] = useState(10);
  const [supplier, setSupplier] = useState('');
  const [note, setNote] = useState('');

  const numQty = Number(qty) || 0;
  const newTotal = item.quantity + numQty;

  const quickPresets = [5, 10, 20, 50, 100];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numQty <= 0) return;
    onConfirm({
      itemId: item.id,
      quantity: numQty,
      supplier,
      note
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge badge-stockin">
              <ArrowUpRight size={20} />
            </div>
            <div>
              <h3>{t.stockInModalTitle}</h3>
              <p className="modal-sub">
                {lang === 'ml' && item.nameMl ? item.nameMl : item.name}
              </p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Stock Preview */}
          <div className="stock-status-box">
            <div>
              <span className="text-muted">{t.quantity}:</span>{' '}
              <strong>{item.quantity} {item.unit}</strong>
            </div>
            <div>
              <span className="text-muted">New Total:</span>{' '}
              <strong className="text-green stock-big">{newTotal} {item.unit}</strong>
            </div>
          </div>

          {/* Quick presets */}
          <div className="form-group">
            <label className="form-label">{t.addedQuantity}</label>
            <div className="preset-buttons">
              {quickPresets.map(n => (
                <button
                  key={n}
                  type="button"
                  className={`btn-preset ${qty === n ? 'active' : ''}`}
                  onClick={() => setQty(n)}
                >
                  +{n}
                </button>
              ))}
            </div>

            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
              className="form-input mt-2"
              required
            />
          </div>

          {/* Supplier Info */}
          <div className="form-group">
            <label className="form-label">{t.supplierInfo}</label>
            <input
              type="text"
              placeholder="e.g. Diversey Chemical Co. / Bill #5421"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">{t.notes}</label>
            <input
              type="text"
              placeholder="e.g. Monthly bulk purchase received"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t.cancel}
            </button>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={numQty <= 0}
            >
              {t.confirmStockIn} (+{numQty} {item.unit})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
