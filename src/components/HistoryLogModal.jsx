import React, { useState } from 'react';
import { 
  X, 
  History, 
  ArrowDownRight, 
  ArrowUpRight, 
  Search, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export function HistoryLogModal({ 
  isOpen, 
  onClose, 
  logs, 
  onClearHistory, 
  onEditLog, 
  onDeleteLog, 
  t, 
  lang 
}) {
  if (!isOpen) return null;

  const [search, setSearch] = useState('');
  const [editingLogId, setEditingLogId] = useState(null);
  const [editQty, setEditQty] = useState(1);
  const [editLocation, setEditLocation] = useState('');
  const [editNote, setEditNote] = useState('');

  const filteredLogs = logs.filter(log => {
    const text = `${log.itemName} ${log.destination || ''} ${log.supplier || ''} ${log.note || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const startEdit = (log) => {
    setEditingLogId(log.id);
    setEditQty(log.quantity);
    setEditLocation(log.destination || log.supplier || '');
    setEditNote(log.note || '');
  };

  const cancelEdit = () => {
    setEditingLogId(null);
  };

  const handleSaveEdit = (log) => {
    const newQty = Number(editQty);
    if (!newQty || newQty <= 0) {
      alert(lang === 'ml' ? 'ദയവായി ശരിയായ അളവ് നൽകുക' : 'Please provide a valid quantity');
      return;
    }

    onEditLog(log.id, {
      quantity: newQty,
      ...(log.type === 'issue' ? { destination: editLocation } : { supplier: editLocation }),
      note: editNote
    });
    setEditingLogId(null);
  };

  const handleDelete = (log) => {
    const isIssue = log.type === 'issue';
    const actionDesc = isIssue
      ? (lang === 'ml' 
          ? `നൽകിയ അളവ് (${log.quantity} ${log.unit}) തിരികെ സ്റ്റോക്കിലേക്ക് ചേർക്കും!` 
          : `The issued quantity (${log.quantity} ${log.unit}) will be returned to stock!`)
      : (lang === 'ml'
          ? `സ്റ്റോക്കിൽ വന്ന അളവ് (${log.quantity} ${log.unit}) കുറവ് ചെയ്യും!`
          : `The received quantity (${log.quantity} ${log.unit}) will be deducted from stock!`);

    const msg = `${t.confirmDeleteLog}\n\n${log.itemName}\n${actionDesc}`;
    if (window.confirm(msg)) {
      onDeleteLog(log.id);
    }
  };

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
                {lang === 'ml' 
                  ? 'ഇടപാടുകളിൽ വന്ന തെറ്റുകൾ തിരുത്തുകയോ റദ്ദാക്കുകയോ ചെയ്യാം' 
                  : 'Correct quantities, destinations or revert any transactions'}
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
                <span>Clear All</span>
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
                    <th style={{ textAlign: 'center', width: '90px' }}>{t.actions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => {
                    const isIssue = log.type === 'issue';
                    const isEditing = editingLogId === log.id;

                    if (isEditing) {
                      return (
                        <tr key={log.id} className="row-editing">
                          <td className="text-muted text-sm">{log.timestamp}</td>
                          <td>
                            <span className={`log-badge ${isIssue ? 'log-badge-issue' : 'log-badge-stockin'}`}>
                              {isIssue ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                              {isIssue ? (lang === 'ml' ? 'നൽകി' : 'Issue') : (lang === 'ml' ? 'സ്റ്റോക്ക്' : 'Restock')}
                            </span>
                          </td>
                          <td><strong>{log.itemName}</strong></td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={editQty}
                              onChange={e => setEditQty(e.target.value)}
                              className="form-input form-input-sm"
                              style={{ width: '80px' }}
                              autoFocus
                            />
                            <span className="text-xs text-muted ml-1">{log.unit}</span>
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editLocation}
                              placeholder={isIssue ? 'Floor / Room' : 'Supplier'}
                              onChange={e => setEditLocation(e.target.value)}
                              className="form-input form-input-sm"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editNote}
                              placeholder="Notes"
                              onChange={e => setEditNote(e.target.value)}
                              className="form-input form-input-sm"
                            />
                          </td>
                          <td>
                            <div className="action-buttons-inline">
                              <button
                                type="button"
                                className="btn-icon-subtle text-green"
                                onClick={() => handleSaveEdit(log)}
                                title={t.save}
                              >
                                <Check size={16} />
                              </button>
                              <button
                                type="button"
                                className="btn-icon-subtle text-muted"
                                onClick={cancelEdit}
                                title={t.cancel}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={log.id}>
                        <td className="text-muted text-sm">
                          {log.timestamp}
                          {log.editedAt && (
                            <div className="text-xs text-amber mt-0.5" title={`Edited: ${log.editedAt}`}>
                              • {t.editedBadge}
                            </div>
                          )}
                        </td>
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
                        <td>
                          <div className="action-buttons-inline">
                            <button
                              type="button"
                              className="btn-icon-subtle"
                              onClick={() => startEdit(log)}
                              title={t.editLog}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon-subtle text-danger"
                              onClick={() => handleDelete(log)}
                              title={t.undoLog}
                            >
                              <RotateCcw size={15} />
                            </button>
                          </div>
                        </td>
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
