import React from 'react';
import { Package, CheckCircle2, AlertTriangle, AlertOctagon, MessageCircle } from 'lucide-react';

export function StatsOverview({ 
  items, 
  t, 
  filterMode, 
  setFilterMode, 
  onOpenWhatsApp 
}) {
  const total = items.length;
  const outOfStock = items.filter(i => i.quantity <= 0);
  const lowStock = items.filter(i => i.quantity > 0 && i.quantity <= i.minThreshold);
  const inStock = items.filter(i => i.quantity > i.minThreshold);
  const needsReorderCount = outOfStock.length + lowStock.length;

  return (
    <div className="stats-grid">
      {/* Total Card */}
      <div 
        className={`stat-card stat-total ${filterMode === 'all' ? 'stat-active' : ''}`}
        onClick={() => setFilterMode('all')}
      >
        <div className="stat-icon-wrapper total-bg">
          <Package className="stat-icon" size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">{t.totalItems}</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      {/* In Stock */}
      <div 
        className={`stat-card stat-instock ${filterMode === 'instock' ? 'stat-active' : ''}`}
        onClick={() => setFilterMode('instock')}
      >
        <div className="stat-icon-wrapper instock-bg">
          <CheckCircle2 className="stat-icon" size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">{t.inStock}</span>
          <span className="stat-value">{inStock.length}</span>
        </div>
      </div>

      {/* Low Stock Card */}
      <div 
        className={`stat-card stat-low ${filterMode === 'low' ? 'stat-active' : ''} ${lowStock.length > 0 ? 'pulse-low' : ''}`}
        onClick={() => setFilterMode('low')}
      >
        <div className="stat-icon-wrapper low-bg">
          <AlertTriangle className="stat-icon" size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">{t.lowStock}</span>
          <span className="stat-value text-amber">{lowStock.length}</span>
        </div>
      </div>

      {/* Out of Stock Card */}
      <div 
        className={`stat-card stat-out ${filterMode === 'out' ? 'stat-active' : ''} ${outOfStock.length > 0 ? 'pulse-danger' : ''}`}
        onClick={() => setFilterMode('out')}
      >
        <div className="stat-icon-wrapper out-bg">
          <AlertOctagon className="stat-icon" size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">{t.outOfStock}</span>
          <span className="stat-value text-danger">{outOfStock.length}</span>
        </div>
      </div>

      {/* WhatsApp Reorder Quick Trigger */}
      <div 
        className="stat-card stat-reorder cursor-pointer"
        onClick={onOpenWhatsApp}
        title={t.reorderList}
      >
        <div className="stat-icon-wrapper reorder-bg">
          <MessageCircle className="stat-icon" size={24} />
        </div>
        <div className="stat-content">
          <span className="stat-label">{t.reorderList}</span>
          <span className="stat-value text-green">
            {needsReorderCount > 0 ? `${needsReorderCount} Items` : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
}
