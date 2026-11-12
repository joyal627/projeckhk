import React, { useState } from 'react';
import { X, ArrowDownRight, AlertTriangle, Building2 } from 'lucide-react';

export function QuickIssueModal({ item, isOpen, onClose, onConfirm, t, lang }) {
  if (!isOpen || !item) return null;

  const [qty, setQty] = useState(1);
  const [issuedTo, setIssuedTo] = useState('Floor 1');
  const [customLocation, setCustomLocation] = useState('');
  const [note, setNote] = useState('');

  const numQty = Number(qty) || 0;
  const remainingAfter = item.quantity - numQty;
  const isInvalid = numQty <= 0 || numQty > item.quantity;
  const willBeLow = remainingAfter <= item.minThreshold && remainingAfter > 0;
  const willBeOut = remainingAfter <= 0;

  const quickPresets = [1, 2, 5, 10, 20].filter(n => n <= item.quantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInvalid) return;
    const finalLocation = issuedTo === 'Other' ? customLocation : issuedTo;
    onConfirm({
      itemId: item.id,
      quantity: numQty,
      destination: finalLocation || 'General Use',
      note
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge badge-takeout">
              <ArrowDownRight size={20} />
            </div>
            <div>
              <h3>{t.quickIssueModalTitle}</h3>
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
          {/* Current Stock Banner */}
          <div className="stock-status-box">
            <div>
              <span className="text-muted">{t.quantity}:</span>{' '}
              <strong className="stock-big">{item.quantity} {item.unit}</strong>
            </div>
            <div>
              <span className="text-muted">{t.minLimit}:</span>{' '}
              <span>{item.minThreshold} {item.unit}</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="form-group">
            <label className="form-label">{t.quantityToTake}</label>
            <div className="preset-buttons">
              {quickPresets.map(n => (
                <button
                  key={n}
                  type="button"
                  className={`btn-preset ${qty === n ? 'active' : ''}`}
                  onClick={() => setQty(n)}
                >
                  -{n}
                </button>
              ))}
              {item.quantity > 0 && (
                <button
                  type="button"
                  className={`btn-preset ${qty === item.quantity ? 'active' : ''}`}
                  onClick={() => setQty(item.quantity)}
                >
                  All ({item.quantity})
                </button>
              )}
            </div>

            <input
              type="number"
              min="1"
              max={item.quantity}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))}
              className="form-input mt-2"
              required
            />
          </div>

          {/* Warning preview */}
          {willBeOut && (
            <div className="warning-banner warning-danger">
              <AlertTriangle size={18} />
              <span>
                {lang === 'ml' 
                  ? 'ഇത് നൽകിയാൽ സ്റ്റോക്ക് പൂർണ്ണമായും തീർന്നുപോകും (0 ബാക്കി)!' 
                  : 'Warning: This will completely empty the stock (0 remaining)!'}
              </span>
            </div>
          )}
          {willBeLow && !willBeOut && (
            <div className="warning-banner warning-amber">
              <AlertTriangle size={18} />
              <span>
                {lang === 'ml'
                  ? `ഇത് നൽകിയാൽ ബാക്കി ${remainingAfter} ${item.unit} മാത്രം (മിനിമം അളവിനേക്കാൾ കുറവാണ്).`
                  : `Remaining stock will be ${remainingAfter} ${item.unit} (Below minimum alert threshold).`}
              </span>
            </div>
          )}

          {/* Issued To Location */}
          <div className="form-group">
            <label className="form-label">{t.issuedTo}</label>
            <div className="grid-2">
              <select 
                value={issuedTo} 
                onChange={e => setIssuedTo(e.target.value)}
                className="form-select"
              >
                <option value="Floor 1">Floor 1 (മുറികൾ 101-110)</option>
                <option value="Floor 2">Floor 2 (മുറികൾ 201-210)</option>
                <option value="Floor 3">Floor 3 (മുറികൾ 301-310)</option>
                <option value="Floor 4">Floor 4 (മുറികൾ 401-410)</option>
                <option value="Public Area">Public Area / Lobby</option>
                <option value="Banquet Hall">Banquet / Conference Hall</option>
                <option value="Laundry">Laundry Room</option>
                <option value="Restaurant">Restaurant / Kitchen</option>
                <option value="Staff Restroom">Staff Restroom</option>
                <option value="Other">Custom Location...</option>
              </select>
              {issuedTo === 'Other' && (
                <input
                  type="text"
                  placeholder="Type specific Room or Area..."
                  value={customLocation}
                  onChange={e => setCustomLocation(e.target.value)}
                  className="form-input"
                  required
                />
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">{t.reason}</label>
            <input
              type="text"
              placeholder="e.g. Morning room makeup, guest request..."
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
              className="btn btn-primary"
              disabled={isInvalid}
            >
              {t.confirmIssue} (-{numQty} {item.unit})
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
