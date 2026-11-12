import React from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon,
  MapPin,
  Plus
} from 'lucide-react';
import { CATEGORIES } from '../data/defaultItems';

export function StockTable({
  items,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  showLowOnly,
  setShowLowOnly,
  onQuickIssue,
  onStockIn,
  onEdit,
  onDelete,
  onAddNew,
  t,
  lang
}) {
  return (
    <section className="stock-section">
      {/* Category Pills & Search Toolbar */}
      <div className="stock-toolbar">
        <div className="category-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              className={`pill-btn ${selectedCategory === cat ? 'pill-active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {t.categories[cat] || cat}
            </button>
          ))}
        </div>

        <div className="search-and-actions">
          <div className="search-box-large">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showLowOnly}
              onChange={e => setShowLowOnly(e.target.checked)}
            />
            <span>{t.filterLowStockOnly}</span>
          </label>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddNew}
          >
            <Plus size={18} />
            <span>{t.addNewItem}</span>
          </button>
        </div>
      </div>

      {/* Items List / Table */}
      {items.length === 0 ? (
        <div className="empty-state-card">
          <p className="empty-text">{t.noItemsFound}</p>
          <button type="button" className="btn btn-primary mt-3" onClick={onAddNew}>
            <Plus size={18} />
            <span>{t.addNewItem}</span>
          </button>
        </div>
      ) : (
        <div className="stock-cards-container">
          {items.map(item => {
            const isOut = item.quantity <= 0;
            const isLow = item.quantity > 0 && item.quantity <= item.minThreshold;
            const isGood = item.quantity > item.minThreshold;

            let statusClass = 'status-good';
            let statusText = t.statusGood;
            let StatusIcon = CheckCircle2;

            if (isOut) {
              statusClass = 'status-out';
              statusText = t.statusOut;
              StatusIcon = AlertOctagon;
            } else if (isLow) {
              statusClass = 'status-low';
              statusText = t.statusLow;
              StatusIcon = AlertTriangle;
            }

            const displayName = lang === 'ml' && item.nameMl ? item.nameMl : item.name;
            const secondaryName = lang === 'ml' ? item.name : item.nameMl;

            return (
              <div key={item.id} className={`stock-card ${statusClass}-border`}>
                <div className="card-top">
                  <div className="card-title-group">
                    <span className="card-category-badge">
                      {t.categories[item.category] || item.category}
                    </span>
                    <h4 className="card-name">{displayName}</h4>
                    {secondaryName && secondaryName !== displayName && (
                      <p className="card-subname">{secondaryName}</p>
                    )}
                    {item.location && (
                      <p className="card-location">
                        <MapPin size={13} className="inline mr-1" />
                        {item.location}
                      </p>
                    )}
                  </div>

                  <div className={`status-pill ${statusClass}`}>
                    <StatusIcon size={14} />
                    <span>{statusText}</span>
                  </div>
                </div>

                <div className="card-stock-display">
                  <div className="stock-meter">
                    <div className="stock-number-wrap">
                      <span className={`stock-qty-number ${statusClass}-text`}>
                        {item.quantity}
                      </span>
                      <span className="stock-unit">{item.unit}</span>
                    </div>
                    <div className="stock-threshold">
                      <span className="threshold-label">{t.minLimit}:</span>{' '}
                      <strong>{item.minThreshold} {item.unit}</strong>
                    </div>
                  </div>

                  {/* Stock Progress Bar relative to 2x min threshold */}
                  <div className="progress-bar-bg">
                    <div 
                      className={`progress-bar-fill ${statusClass}-bar`}
                      style={{
                        width: `${Math.min(100, Math.max(0, (item.quantity / Math.max(item.minThreshold * 2, 1)) * 100))}%`
                      }}
                    />
                  </div>
                </div>

                {item.notes && (
                  <p className="card-notes">"{item.notes}"</p>
                )}

                {/* Card Action Buttons */}
                <div className="card-footer-actions">
                  <div className="card-quick-btns">
                    {/* Take Out / Issue Button */}
                    <button
                      type="button"
                      className="btn btn-issue"
                      disabled={item.quantity <= 0}
                      onClick={() => onQuickIssue(item)}
                      title={t.takeOut}
                    >
                      <ArrowDownRight size={16} />
                      <span>{t.takeOut}</span>
                    </button>

                    {/* Stock In Button */}
                    <button
                      type="button"
                      className="btn btn-stockin"
                      onClick={() => onStockIn(item)}
                      title={t.addStock}
                    >
                      <ArrowUpRight size={16} />
                      <span>{t.addStock}</span>
                    </button>
                  </div>

                  <div className="card-tool-btns">
                    <button
                      type="button"
                      className="btn-icon-subtle"
                      onClick={() => onEdit(item)}
                      title={t.edit}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon-subtle text-danger"
                      onClick={() => onDelete(item)}
                      title={t.delete}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
