import React, { useState } from 'react';
import { X, History, ArrowDownRight, ArrowUpRight, Search, Trash2 } from 'lucide-react';

export function HistoryLogModal({ isOpen, onClose, logs, onClearHistory, t, lang }) {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(log => {
    const text = `${log.itemName} ${log.destination || ''} ${log.supplier || ''} ${log.note || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge badge-history">
              <History size={20} />
            </div>
            <div>
              <h3>{t.historyTitle}</h3>
              <p className="modal-sub">
                {lang === 'ml' ? 'ഏതൊക്കെ സാധനങ്ങൾ എങ്ങോട്ട് നൽകി, എപ്പോൾ പുതിയ സ്റ്റോക്ക് വന്നു' : 'Log of items issued to rooms and restocked'}
              </p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="history-toolbar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="form-input"
              />
            </div>
            {logs.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary btn-icon text-danger"
                onClick={onClearHistory}
                title="Clear Logs"
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="history-table-wrapper">
            {filteredLogs.length === 0 ? (
              <div className="empty-state">
                <p>{t.noHistory}</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t.date}</th>
                    <th>{t.type}</th>
                    <th>{t.itemName}</th>
                    <th>{t.quantity}</th>
                    <th>{lang === 'ml' ? 'ലൊക്കേഷൻ / സപ്ലയർ' : 'Destination / Source'}</th>
                    <th>{t.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => {
                    const isIssue = log.type === 'issue';
                    return (
                      <tr key={log.id}>
                        <td className="text-muted text-sm">{log.timestamp}</td>
                        <td>
                          <span className={`log-badge ${isIssue ? 'log-badge-issue' : 'log-badge-stockin'}`}>
                            {isIssue ? (
                              <>
                                <ArrowDownRight size={14} /> {lang === 'ml' ? 'നൽകി (Issue)' : 'Issue'}
                              </>
                            ) : (
                              <>
                                <ArrowUpRight size={14} /> {lang === 'ml' ? 'സ്റ്റോക്ക് വന്നു' : 'Restock'}
                              </>
                            )}
                          </span>
                        </td>
                        <td><strong>{log.itemName}</strong></td>
                        <td className={isIssue ? 'text-amber' : 'text-green'}>
                          <strong>{isIssue ? `-${log.quantity}` : `+${log.quantity}`} {log.unit}</strong>
                        </td>
                        <td>{log.destination || log.supplier || '-'}</td>
                        <td className="text-muted text-sm">{log.note || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="modal-actions mt-3">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
