import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, Send, ShoppingBag } from 'lucide-react';

export function WhatsAppShareModal({ isOpen, onClose, items, t, lang }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Items that need restock
  const criticalItems = items.filter(i => i.quantity <= i.minThreshold);

  // Format message text
  const dateStr = new Date().toLocaleDateString(lang === 'ml' ? 'ml-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  let messageText = `📋 *HOUSEKEEPING STORE REQUISITION / ഓർഡർ ലിസ്റ്റ്*\n`;
  messageText += `📅 Date: ${dateStr}\n`;
  messageText += `--------------------------------------\n`;

  if (criticalItems.length === 0) {
    messageText += `✅ നിലവിൽ എല്ലാ സ്റ്റോക്കും ആവശ്യത്തിനുണ്ട്.\n`;
  } else {
    messageText += `🚨 *ഉടൻ വാങ്ങേണ്ട സാധനങ്ങൾ (${criticalItems.length} എണ്ണം):*\n\n`;
    criticalItems.forEach((item, index) => {
      const isOut = item.quantity <= 0;
      const statusIcon = isOut ? '🔴 [തീർന്നു - OUT]' : '🟠 [കുറവാണ് - LOW]';
      const orderEstimate = Math.max(item.minThreshold * 2 - item.quantity, item.minThreshold);
      const displayName = lang === 'ml' && item.nameMl ? item.nameMl : item.name;

      messageText += `${index + 1}. *${displayName}*\n`;
      messageText += `   • സ്റ്റാറ്റസ്: ${statusIcon}\n`;
      messageText += `   • നിലവിലുള്ളത്: ${item.quantity} ${item.unit}\n`;
      messageText += `   • മിനിമം ലിമിറ്റ്: ${item.minThreshold} ${item.unit}\n`;
      messageText += `   👉 *ആവശ്യമുള്ള അളവ്: ~${orderEstimate} ${item.unit}*\n\n`;
    });
  }

  messageText += `--------------------------------------\n`;
  messageText += `_Generated via Housekeeping Store Manager_`;

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge badge-whatsapp">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3>{t.reorderList}</h3>
              <p className="modal-sub">
                {lang === 'ml' 
                  ? 'തീർന്നുപോയ സാധനങ്ങൾ WhatsApp വഴി മാനേജർക്കോ സപ്ലയർക്കോ അയക്കാം' 
                  : 'Send purchase requisition to Manager / Vendor via WhatsApp'}
              </p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Optional phone number input */}
          <div className="form-group">
            <label className="form-label">
              WhatsApp നമ്പർ (ഓപ്ഷണൽ - നൽകിയില്ലെങ്കിൽ WhatsApp കോൺടാക്റ്റുകൾ തെരഞ്ഞെടുക്കാം)
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
            <label className="form-label">ഓർഡർ സന്ദേശം (Message Preview)</label>
            <textarea
              readOnly
              rows={11}
              value={messageText}
              className="form-textarea font-mono"
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCopy}
            >
              {copied ? <Check size={18} className="text-green" /> : <Copy size={18} />}
              <span>{copied ? t.copied : t.copyOrderText}</span>
            </button>

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
