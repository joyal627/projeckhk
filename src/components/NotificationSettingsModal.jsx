import React, { useState } from 'react';
import { X, Bell, BellRing, Volume2, VolumeX, CheckCircle2, AlertOctagon, HelpCircle, Send } from 'lucide-react';
import { playAlertSound } from '../utils/audioAlert';
import { testNotification } from '../utils/notifications';

export function NotificationSettingsModal({
  isOpen,
  onClose,
  notifPermission,
  onEnableNotifications,
  soundEnabled,
  onToggleSound,
  t,
  lang
}) {
  if (!isOpen) return null;

  const [testSent, setTestSent] = useState(false);

  const handleSendTest = () => {
    const res = testNotification(lang);
    if (res === 'success') {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else if (res === 'not-granted') {
      onEnableNotifications();
    } else {
      alert(lang === 'ml' 
        ? 'ഈ ബ്രൗസറിൽ നോട്ടിഫിക്കേഷൻ അനുവദിച്ചിട്ടില്ല. ദയവായി Allow ചെയ്യുക.' 
        : 'Notifications are not allowed in this browser. Please enable them.');
    }
  };

  const isGranted = notifPermission === 'granted';
  const isDenied = notifPermission === 'denied';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className={`modal-badge ${isGranted ? 'badge-stockin' : 'badge-takeout'}`}>
              {isGranted ? <BellRing size={20} /> : <Bell size={20} />}
            </div>
            <div>
              <h3>{t.notificationSettings}</h3>
              <p className="modal-sub">{t.notificationSettingsDesc}</p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Section 1: Browser Push Notifications */}
          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-info">
                <span className="setting-title">{t.pushAlerts}</span>
                <span className="setting-desc">
                  {lang === 'ml' 
                    ? 'സാധനങ്ങൾ തീരുമ്പോൾ ഫോണിലും കമ്പ്യൂട്ടറിലും പോപ്പ്-അപ്പ് നോട്ടിഫിക്കേഷൻ വരും' 
                    : 'Get device pop-up alerts when items reach critical levels'}
                </span>
              </div>
              <span className={`status-pill ${isGranted ? 'status-good' : isDenied ? 'status-out' : 'status-low'}`}>
                {isGranted ? (
                  <>
                    <CheckCircle2 size={13} />
                    <span>{t.notificationsEnabled}</span>
                  </>
                ) : isDenied ? (
                  <>
                    <AlertOctagon size={13} />
                    <span>{t.notificationsBlocked}</span>
                  </>
                ) : (
                  <>
                    <Bell size={13} />
                    <span>{t.enableNotifications}</span>
                  </>
                )}
              </span>
            </div>

            {isDenied && (
              <div className="setting-warning-box">
                <p>
                  <strong>{t.browserBlockedMsg}</strong>
                </p>
                <ol className="blocked-steps">
                  <li>{lang === 'ml' ? 'ബ്രൗസറിലെ അഡ്രസ് ബാറിലെ 🔒 പൂട്ടടയാളം ക്ലിക്ക് ചെയ്യുക' : 'Click the 🔒 lock icon in the address bar'}</li>
                  <li>{lang === 'ml' ? '"Permissions" അല്ലെങ്കിൽ "Notifications" -> Allow ആക്കുക' : 'Change "Notifications" to "Allow"'}</li>
                  <li>{lang === 'ml' ? 'പേജ് ഒന്നു റീലോഡ് (Refresh) ചെയ്യുക' : 'Reload this page'}</li>
                </ol>
              </div>
            )}

            <div className="setting-actions mt-2">
              {!isGranted ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onEnableNotifications}
                >
                  <BellRing size={16} />
                  <span>{t.enableNotifications}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleSendTest}
                >
                  <Send size={16} />
                  <span>{testSent ? (lang === 'ml' ? 'അയച്ചു! ✅' : 'Sent! ✅') : t.testNotificationBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Audio Sound Alerts */}
          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-info">
                <span className="setting-title">{t.soundAlerts}</span>
                <span className="setting-desc">
                  {lang === 'ml' 
                    ? 'സ്റ്റോക്ക് തീരാറാവുമ്പോഴും പൂർണ്ണമായി തീരുമ്പോഴും കേൾക്കുന്ന മുന്നറിയിപ്പ് ശബ്ദം' 
                    : 'Audible chime when stock is low or runs out'}
                </span>
              </div>
              <button
                type="button"
                className={`btn ${soundEnabled ? 'btn-success' : 'btn-secondary'}`}
                onClick={onToggleSound}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{soundEnabled ? (lang === 'ml' ? 'ഓൺ' : 'ON') : (lang === 'ml' ? 'ഓഫ്' : 'OFF')}</span>
              </button>
            </div>

            <div className="setting-sound-tests mt-2">
              <span className="text-muted text-sm">{t.testSound}:</span>
              <div className="preset-buttons">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => playAlertSound('warning')}
                >
                  <Volume2 size={14} className="text-amber" />
                  <span>Warning Chime</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => playAlertSound('danger')}
                >
                  <Volume2 size={14} className="text-danger" />
                  <span>Urgent Danger Beep</span>
                </button>
              </div>
            </div>
          </div>

          {/* Informational tip */}
          <div className="setting-info-box">
            <HelpCircle size={18} className="text-accent" />
            <p className="text-sm text-secondary">
              {t.howAlertsWork}
            </p>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              {lang === 'ml' ? 'പൂർത്തിയായി' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
