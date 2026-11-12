import React from 'react';
import { 
  Sparkles, 
  Bell, 
  BellRing, 
  Volume2, 
  Languages, 
  FileSpreadsheet, 
  History,
  RotateCcw
} from 'lucide-react';
import { playAlertSound } from '../utils/audioAlert';

export function Navbar({ 
  lang, 
  setLang, 
  t, 
  notifPermission, 
  onOpenNotificationSettings,
  onOpenHistory,
  onExportCSV,
  onResetSupplies
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="logo-group">
          <div className="logo-badge">
            <Sparkles className="logo-icon" />
          </div>
          <div>
            <h1 className="logo-title">{t.appTitle}</h1>
            <p className="logo-sub">{t.appSubtitle}</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Language Switch */}
          <button 
            type="button" 
            className="btn btn-secondary btn-icon"
            onClick={() => setLang(lang === 'ml' ? 'en' : 'ml')}
            title="Switch Language"
          >
            <Languages size={18} />
            <span className="btn-text">{lang === 'ml' ? 'English' : 'മലയാളം'}</span>
          </button>

          {/* Notification & Alert Settings Popup Trigger */}
          <button 
            type="button"
            className={`btn btn-icon ${notifPermission === 'granted' ? 'btn-success' : 'btn-warning'}`}
            onClick={onOpenNotificationSettings}
            title={t.notificationSettings}
          >
            {notifPermission === 'granted' ? <BellRing size={18} /> : <Bell size={18} />}
            <span className="btn-text">
              {notifPermission === 'granted' ? t.notificationsEnabled : t.enableNotifications}
            </span>
          </button>

          {/* Sound Alert Quick Test */}
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={() => playAlertSound('warning')}
            title={t.testSound}
          >
            <Volume2 size={18} />
            <span className="btn-text">{t.testSound}</span>
          </button>

          {/* History Log */}
          <button 
            type="button" 
            className="btn btn-secondary btn-icon"
            onClick={onOpenHistory}
            title={t.viewHistory}
          >
            <History size={18} />
            <span className="btn-text">{t.viewHistory}</span>
          </button>

          {/* Export CSV / Report */}
          <button 
            type="button" 
            className="btn btn-secondary btn-icon"
            onClick={onExportCSV}
            title={t.exportCSV}
          >
            <FileSpreadsheet size={18} />
            <span className="btn-text">{t.exportCSV}</span>
          </button>

          {/* Reset to Default Supplies */}
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onResetSupplies}
            title={t.resetSupplies}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
