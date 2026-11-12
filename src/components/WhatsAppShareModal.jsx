import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Copy, 
  Check, 
  Send, 
  Share2, 
  Printer, 
  AlertOctagon, 
  AlertTriangle, 
  Package 
} from 'lucide-react';

export function WhatsAppShareModal({ 
  isOpen, 
  onClose, 
  items, 
  initialMode = 'out', 
  t, 
  lang 
}) {
  if (!isOpen) return null;

  const [filterType, setFilterType] = useState(initialMode); // 'out', 'low', 'all'
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Out of stock only (0 or less)
  const outOfStockItems = items.filter(i => i.quantity <= 0);
  // Low stock (between 1 and minThreshold)
  const lowStockItems = items.filter(i => i.quantity > 0 && i.quantity <= i.minThreshold);
  // All critical items (out of stock + low stock)
  const criticalItems = [...outOfStockItems, ...lowStockItems];

  // Select list based on active tab
  let targetItems = [];
  let listHeading = '';
  if (filterType === 'out') {
    targetItems = outOfStockItems;
    listHeading = lang === 'ml' 
      ? '🚨 തീർന്നുപോയ സാധനങ്ങൾ (OUT OF STOCK LIST)' 
      : '🚨 OUT OF STOCK REQUISITION LIST';
  } else if (filterType === 'low') {
    targetItems = criticalItems;
    listHeading = lang === 'ml'
      ? '⚠️ തീർന്നുപോയതും തീരാറായതുമായ സാധനങ്ങൾ'
      : '⚠️ URGENT RESTOCK & REQUISITION LIST';
  } else {
    targetItems = items;
    listHeading = lang === 'ml'
      ? '📦 മുഴുവൻ സ്റ്റോക്ക് റിപ്പോർട്ട്'
      : '📦 COMPLETE STORE INVENTORY REPORT';
  }

  // Format message text
  const dateStr = new Date().toLocaleDateString(lang === 'ml' ? 'ml-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  let messageText = `📋 *HOUSEKEEPING STORE - ${listHeading}*\n`;
  messageText += `📅 തീയതി (Date): ${dateStr}\n`;
  messageText += `📊 ആകെ ഇനങ്ങൾ: ${targetItems.length} എണ്ണം\n`;
  messageText += `--------------------------------------\n`;

  if (targetItems.length === 0) {
    messageText += filterType === 'out'
      ? `✅ നിലവിൽ തീർന്നുപോയ സാധനങ്ങൾ ഒന്നുമില്ല.\n`
      : `✅ നിലവിൽ എല്ലാ സ്റ്റോക്കും ആവശ്യത്തിനുണ്ട്.\n`;
  } else {
    targetItems.forEach((item, index) => {
      const isOut = item.quantity <= 0;
      const statusIcon = isOut ? '🔴 [തീർന്നു - OUT]' : '🟠 [കുറവാണ് - LOW]';
      const orderEstimate = Math.max(item.minThreshold * 2 - item.quantity, item.minThreshold);
      const displayName = lang === 'ml' && item.nameMl ? item.nameMl : item.name;
      const secondary = lang === 'ml' ? item.name : item.nameMl;

      messageText += `${index + 1}. *${displayName}*`;
      if (secondary && secondary !== displayName) {
        messageText += ` (${secondary})`;
      }
      messageText += `\n`;
      messageText += `   • നിലവിലുള്ള സ്റ്റോക്ക്: ${item.quantity} ${item.unit} ${statusIcon}\n`;
      messageText += `   • മിനിമം ലിമിറ്റ്: ${item.minThreshold} ${item.unit}\n`;
      if (item.location) {
        messageText += `   • ലൊക്കേഷൻ: ${item.location}\n`;
      }
      messageText += `   👉 *വാങ്ങേണ്ട അളവ്: ~${orderEstimate} ${item.unit}*\n\n`;
    });
  }

  messageText += `--------------------------------------\n`;
  messageText += `_Housekeeping Store Manager വഴി തയ്യാറാക്കിയത്_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(messageText);
    let url = `https://api.whatsapp.com/send?text=${encoded}`;
    if (phoneNumber.trim()) {
      const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    }
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listHeading,
          text: messageText
        });
      } catch (err) {
        console.warn('Share error/cancelled:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge badge-whatsapp">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3>{lang === 'ml' ? 'ലിസ്റ്റ് എടുക്കുക & ഷെയർ ചെയ്യുക' : 'Supplies List & Share'}</h3>
              <p className="modal-sub">
                {lang === 'ml' 
                  ? 'തീർന്നുപോയ സാധനങ്ങളുടെ ലിസ്റ്റ് WhatsApp വഴിയോ മെസ്സേജ് വഴിയോ അയക്കാം' 
                  : 'Export & share out-of-stock items via WhatsApp or messaging'}
              </p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Filter selection tabs */}
          <div className="share-tabs-bar">
            <button
              type="button"
              className={`share-tab ${filterType === 'out' ? 'active-out' : ''}`}
              onClick={() => setFilterType('out')}
            >
              <AlertOctagon size={16} />
              <span>{t.outOfStockOnlyTab} ({outOfStockItems.length})</span>
            </button>

            <button
              type="button"
              className={`share-tab ${filterType === 'low' ? 'active-low' : ''}`}
              onClick={() => setFilterType('low')}
            >
              <AlertTriangle size={16} />
              <span>{t.lowStockTab} ({criticalItems.length})</span>
            </button>

            <button
              type="button"
              className={`share-tab ${filterType === 'all' ? 'active-all' : ''}`}
              onClick={() => setFilterType('all')}
            >
              <Package size={16} />
              <span>{t.allStockTab} ({items.length})</span>
            </button>
          </div>

          {/* Optional phone number input */}
          <div className="form-group">
            <label className="form-label">
              {lang === 'ml' 
                ? 'WhatsApp നമ്പർ (ഓപ്ഷണൽ - നമ്പർ നൽകിയില്ലെങ്കിൽ WhatsApp തുറന്ന് ആർക്കും അയക്കാം)' 
                : 'WhatsApp Number (Optional)'}
            </label>
            <input
              type="text"
              placeholder="e.g. 919876543210"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Text preview */}
          <div className="form-group">
            <div className="flex-between mb-1">
              <label className="form-label mb-0">
                {lang === 'ml' ? 'തയ്യാറാക്കിയ ലിസ്റ്റ് (Message Preview)' : 'Generated List Preview'}
              </label>
              <span className="text-xs text-muted">
                {targetItems.length} {lang === 'ml' ? 'സാധനങ്ങൾ' : 'items'}
              </span>
            </div>
            <textarea
              readOnly
              rows={11}
              value={messageText}
              className="form-textarea font-mono"
            />
          </div>

          {/* Action buttons */}
          <div className="modal-actions-wrap">
            <div className="modal-actions-left">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCopy}
              >
                {copied ? <Check size={18} className="text-green" /> : <Copy size={18} />}
                <span>{copied ? t.copied : t.copyOrderText}</span>
              </button>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleNativeShare}
                >
                  <Share2 size={18} />
                  <span>{t.shareNative}</span>
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrint}
                title={t.printList}
              >
                <Printer size={18} />
                <span>{t.printList}</span>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-whatsapp"
              onClick={handleWhatsAppSend}
            >
              <Send size={18} />
              <span>{t.shareWhatsApp}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
