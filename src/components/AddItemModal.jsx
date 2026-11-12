import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit, Bell } from 'lucide-react';
import { CATEGORIES, UNITS } from '../data/defaultItems';

export function AddItemModal({ isOpen, onClose, onSave, editItem, t, lang }) {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [nameMl, setNameMl] = useState('');
  const [category, setCategory] = useState('Cleaning Chemicals');
  const [quantity, setQuantity] = useState(10);
  const [minThreshold, setMinThreshold] = useState(5);
  const [unit, setUnit] = useState('Nos');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editItem) {
      setName(editItem.name || '');
      setNameMl(editItem.nameMl || '');
      setCategory(editItem.category || 'Cleaning Chemicals');
      setQuantity(editItem.quantity ?? 10);
      setMinThreshold(editItem.minThreshold ?? 5);
      setUnit(editItem.unit || 'Nos');
      setLocation(editItem.location || '');
      setNotes(editItem.notes || '');
    } else {
      setName('');
      setNameMl('');
      setCategory('Cleaning Chemicals');
      setQuantity(10);
      setMinThreshold(5);
      setUnit('Nos');
      setLocation('');
      setNotes('');
    }
  }, [editItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: editItem ? editItem.id : `item-${Date.now()}`,
      name: name.trim(),
      nameMl: nameMl.trim() || name.trim(),
      category,
      quantity: Number(quantity) || 0,
      minThreshold: Number(minThreshold) || 1,
      unit,
      location: location.trim(),
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge badge-add">
              {editItem ? <Edit size={20} /> : <PlusCircle size={20} />}
            </div>
            <div>
              <h3>{editItem ? t.edit : t.addNewItem}</h3>
              <p className="modal-sub">
                {lang === 'ml' ? 'സ്റ്റോർ ഇനങ്ങളുടെ വിവരങ്ങൾ' : 'Store item parameters & alert thresholds'}
              </p>
            </div>
          </div>
          <button type="button" className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Item Name */}
          <div className="form-group">
            <label className="form-label">{t.itemName} (English) *</label>
            <input
              type="text"
              placeholder="e.g. Bath Towel 70x140 / Harpic Toilet Cleaner"
              value={name}
              onChange={e => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Malayalam Item Name */}
          <div className="form-group">
            <label className="form-label">മലയാളം പേര് (Malayalam / Manglish Name)</label>
            <input
              type="text"
              placeholder="ഉദാ: ബാത്ത് ടവൽ / ടോയ്‌ലറ്റ് ക്ലീനർ"
              value={nameMl}
              onChange={e => setNameMl(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="grid-2">
            {/* Category */}
            <div className="form-group">
              <label className="form-label">{t.category}</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>
                    {t.categories[c] || c}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div className="form-group">
              <label className="form-label">{t.unit}</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="form-select"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid-2">
            {/* Current Stock */}
            <div className="form-group">
              <label className="form-label">{t.quantity} ({unit})</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={e => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="form-input"
                required
              />
            </div>

            {/* Minimum Threshold Limit for Notifications */}
            <div className="form-group">
              <label className="form-label highlight-label">
                <Bell size={14} className="inline mr-1" />
                {t.minLimit} ({unit}) *
              </label>
              <input
                type="number"
                min="0"
                value={minThreshold}
                onChange={e => setMinThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                className="form-input border-amber"
                required
              />
              <span className="form-help">
                {lang === 'ml' 
                  ? 'ഇതിൽ താഴെയായാൽ സിസ്റ്റം അലർട്ടും നോട്ടിഫിക്കേഷനും തരും' 
                  : 'Triggers alerts & notifications when stock reaches or drops below this'}
              </span>
            </div>
          </div>

          <div className="grid-2">
            {/* Shelf Location */}
            <div className="form-group">
              <label className="form-label">{t.location}</label>
              <input
                type="text"
                placeholder="e.g. Shelf A-2, Chemical Store"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">{t.notes}</label>
              <input
                type="text"
                placeholder="e.g. White color, King size only"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
