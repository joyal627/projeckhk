import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_ITEMS } from './data/defaultItems';
import { translations } from './translations';
import { playAlertSound } from './utils/audioAlert';
import { requestNotificationPermission, sendLowStockNotification } from './utils/notifications';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { AlertBanner } from './components/AlertBanner';
import { StockTable } from './components/StockTable';
import { QuickIssueModal } from './components/QuickIssueModal';
import { StockInModal } from './components/StockInModal';
import { AddItemModal } from './components/AddItemModal';
import { HistoryLogModal } from './components/HistoryLogModal';
import { WhatsAppShareModal } from './components/WhatsAppShareModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import './App.css';

const STORAGE_KEY_ITEMS = 'hk_supplies_exact_v3';
const STORAGE_KEY_LOGS = 'hk_supplies_logs_v3';
const STORAGE_KEY_LANG = 'hk_supplies_lang_v3';
const STORAGE_KEY_SOUND = 'hk_supplies_sound_v3';
const STORAGE_KEY_NOTIF_PROMPT = 'hk_notif_prompted_v3';

export default function App() {
  // Language (default to 'ml' for Malayalam)
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_LANG) || 'ml';
  });

  const t = translations[lang] || translations.en;

  // Sound Alert Setting (default to true)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_SOUND) !== 'false';
  });

  // Items State
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse saved items:", e);
    }
    return DEFAULT_ITEMS;
  });

  // History Activity Logs
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to parse saved logs:", e);
    }
    return [
      {
        id: 'log-1',
        timestamp: new Date().toLocaleString(),
        type: 'issue',
        itemId: 'item-1',
        itemName: 'Bath Towel (White 70x140)',
        quantity: 5,
        unit: 'Nos',
        destination: 'Floor 2 (Rooms 201-205)',
        note: 'Morning room turnover'
      },
      {
        id: 'log-2',
        timestamp: new Date().toLocaleString(),
        type: 'restock',
        itemId: 'item-6',
        itemName: 'Dental Kit (Toothbrush + Paste)',
        quantity: 50,
        unit: 'Packets',
        supplier: 'National Amenities Supply',
        note: 'PO-8821'
      }
    ];
  });

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'instock', 'low', 'out'

  // Notification status
  const [notifPermission, setNotifPermission] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // Modals state
  const [activeIssueItem, setActiveIssueItem] = useState(null);
  const [activeStockInItem, setActiveStockInItem] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [shareInitialMode, setShareInitialMode] = useState('out'); // 'out', 'low', 'all'
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, soundEnabled);
  }, [soundEnabled]);

  // Initial prompt for web notifications (Settings popup) if not yet granted
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const hasPrompted = localStorage.getItem(STORAGE_KEY_NOTIF_PROMPT);
      if (Notification.permission === 'default' && !hasPrompted) {
        const timer = setTimeout(() => {
          setIsNotifModalOpen(true);
          localStorage.setItem(STORAGE_KEY_NOTIF_PROMPT, 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Handle notification permission request
  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setNotifPermission(res);
    if (res === 'granted') {
      if (soundEnabled) playAlertSound('warning');
      alert(lang === 'ml' 
        ? 'സ്റ്റോക്ക് തീർന്നുപോകുമ്പോൾ നിങ്ങൾക്ക് ഫോണിലും കമ്പ്യൂട്ടറിലും നോട്ടിഫിക്കേഷൻ ലഭിക്കും!' 
        : 'Low stock notifications are now active on your device!');
    }
  };

  // Add new item or edit existing
  const handleSaveItem = (itemData) => {
    if (editingItem) {
      setItems(prev => prev.map(i => i.id === itemData.id ? itemData : i));
    } else {
      setItems(prev => [itemData, ...prev]);
    }
    setEditingItem(null);
  };

  // Delete item
  const handleDeleteItem = (item) => {
    const displayName = lang === 'ml' && item.nameMl ? item.nameMl : item.name;
    if (window.confirm(`${t.confirmDelete}\n\n${displayName}`)) {
      setItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  // Handle Issue Stock (-qty)
  const handleConfirmIssue = ({ itemId, quantity, destination, note }) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = Math.max(0, item.quantity - quantity);
          const updatedItem = { ...item, quantity: newQty };

          // Log entry
          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            type: 'issue',
            itemId: item.id,
            itemName: item.name,
            quantity,
            unit: item.unit,
            destination,
            note
          };
          setLogs(prevLogs => [newLog, ...prevLogs]);

          // Sound and Web notification alerts
          if (newQty <= 0) {
            if (soundEnabled) playAlertSound('danger');
            sendLowStockNotification(updatedItem, true, lang);
          } else if (newQty <= item.minThreshold) {
            if (soundEnabled) playAlertSound('warning');
            sendLowStockNotification(updatedItem, false, lang);
          }

          return updatedItem;
        }
        return item;
      });
    });
  };

  // Handle Stock In (+qty)
  const handleConfirmStockIn = ({ itemId, quantity, supplier, note }) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + quantity;
          const updatedItem = { ...item, quantity: newQty };

          // Log entry
          const newLog = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            type: 'restock',
            itemId: item.id,
            itemName: item.name,
            quantity,
            unit: item.unit,
            supplier,
            note
          };
          setLogs(prevLogs => [newLog, ...prevLogs]);

          return updatedItem;
        }
        return item;
      });
    });
  };

  // Handle correcting / editing a historical log entry (quantity, destination, note)
  const handleEditLog = (logId, updatedFields) => {
    const existingLog = logs.find(l => l.id === logId);
    if (!existingLog) return;

    const oldQty = Number(existingLog.quantity) || 0;
    const newQty = Number(updatedFields.quantity) || 0;

    // Calculate stock adjustment
    let diff = 0;
    if (existingLog.type === 'issue') {
      // If we previously issued 10, and now correct to 2: return 8 to stock (10 - 2 = +8)
      // If we previously issued 2, and now correct to 10: deduct 8 from stock (2 - 10 = -8)
      diff = oldQty - newQty;
    } else if (existingLog.type === 'restock') {
      // If we previously restocked 10, and now correct to 15: add 5 to stock
      diff = newQty - oldQty;
    }

    setItems(prevItems => prevItems.map(item => {
      const isMatch = (existingLog.itemId && item.id === existingLog.itemId) || 
                      item.name === existingLog.itemName;
      if (isMatch) {
        const updatedQty = Math.max(0, item.quantity + diff);
        return { ...item, quantity: updatedQty };
      }
      return item;
    }));

    setLogs(prevLogs => prevLogs.map(l => {
      if (l.id === logId) {
        return {
          ...l,
          ...updatedFields,
          editedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return l;
    }));
  };

  // Handle deleting / reverting a historical log entry (returns stock)
  const handleDeleteLog = (logId) => {
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    const isIssue = log.type === 'issue';
    setItems(prevItems => prevItems.map(item => {
      const isMatch = (log.itemId && item.id === log.itemId) || item.name === log.itemName;
      if (isMatch) {
        // If it was an issue, revert: return stock back
        // If it was a restock, revert: deduct that restock
        const updatedQty = isIssue 
          ? item.quantity + log.quantity 
          : Math.max(0, item.quantity - log.quantity);
        return { ...item, quantity: updatedQty };
      }
      return item;
    }));

    setLogs(prevLogs => prevLogs.filter(l => l.id !== logId));
  };

  // Open Out-of-stock / Requisition modal with mode
  const handleOpenShare = (mode = 'out') => {
    setShareInitialMode(mode);
    setIsWhatsAppOpen(true);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ["ID", "Item Name", "Malayalam Name", "Category", "Quantity", "Min Threshold", "Unit", "Location", "Notes"];
    const rows = items.map(i => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${(i.nameMl || '').replace(/"/g, '""')}"`,
      i.category,
      i.quantity,
      i.minThreshold,
      i.unit,
      `"${(i.location || '').replace(/"/g, '""')}"`,
      `"${(i.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `housekeeping_store_stock_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear Activity Logs
  const handleClearHistory = () => {
    if (window.confirm("Clear all historical stock activity records?")) {
      setLogs([]);
    }
  };

  // Reset to default supplies list
  const handleResetSupplies = () => {
    if (window.confirm(lang === 'ml' 
      ? "സപ്ലൈസ് ലിസ്റ്റ് തുടക്കത്തിലെ അവസ്ഥയിലേക്ക് റീസെറ്റ് ചെയ്യണോ? (Cleaning, Brooms, Dental kit, Shaving kit...)" 
      : "Reset supplies list to default (Cleaning, Brooms, Dental Kit, Shaving Kit...)?"
    )) {
      setItems(DEFAULT_ITEMS);
    }
  };

  // Filtered items
  const filteredItems = items.filter(item => {
    // Category filter
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false;
    }

    // Filter Mode from top cards
    if (filterMode === 'instock' && item.quantity <= item.minThreshold) {
      return false;
    }
    if (filterMode === 'low' && (item.quantity <= 0 || item.quantity > item.minThreshold)) {
      return false;
    }
    if (filterMode === 'out' && item.quantity > 0) {
      return false;
    }

    // Show low stock only checkbox
    if (showLowOnly && item.quantity > item.minThreshold) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchMl = (item.nameMl || '').toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchLoc = (item.location || '').toLowerCase().includes(q);
      if (!matchName && !matchMl && !matchCat && !matchLoc) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="app-layout">
      {/* Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        t={t}
        notifPermission={notifPermission}
        onOpenNotificationSettings={() => setIsNotifModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExportCSV={handleExportCSV}
        onResetSupplies={handleResetSupplies}
      />

      <main className="main-content">
        {/* Top Summary Stats */}
        <StatsOverview
          items={items}
          t={t}
          filterMode={filterMode}
          setFilterMode={setFilterMode}
          onOpenWhatsApp={() => handleOpenShare('out')}
        />

        {/* Urgent Alert Banner (when items are low or out of stock) */}
        <AlertBanner
          items={items}
          t={t}
          lang={lang}
          onOpenWhatsApp={() => handleOpenShare('out')}
          onSelectItem={(item) => {
            setSearchQuery(item.name);
          }}
        />

        {/* Stock Items Grid / Table */}
        <StockTable
          items={filteredItems}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showLowOnly={showLowOnly}
          setShowLowOnly={setShowLowOnly}
          onQuickIssue={(item) => setActiveIssueItem(item)}
          onStockIn={(item) => setActiveStockInItem(item)}
          onEdit={(item) => {
            setEditingItem(item);
            setIsAddModalOpen(true);
          }}
          onDelete={handleDeleteItem}
          onAddNew={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          t={t}
          lang={lang}
        />
      </main>

      {/* Modals */}
      <QuickIssueModal
        item={activeIssueItem}
        isOpen={Boolean(activeIssueItem)}
        onClose={() => setActiveIssueItem(null)}
        onConfirm={handleConfirmIssue}
        t={t}
        lang={lang}
      />

      <StockInModal
        item={activeStockInItem}
        isOpen={Boolean(activeStockInItem)}
        onClose={() => setActiveStockInItem(null)}
        onConfirm={handleConfirmStockIn}
        t={t}
        lang={lang}
      />

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editItem={editingItem}
        t={t}
        lang={lang}
      />

      {/* History Log with Edit & Undo Stock functionality */}
      <HistoryLogModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        logs={logs}
        onClearHistory={handleClearHistory}
        onEditLog={handleEditLog}
        onDeleteLog={handleDeleteLog}
        t={t}
        lang={lang}
      />

      {/* Out-of-Stock List & WhatsApp Share Modal */}
      <WhatsAppShareModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        items={items}
        initialMode={shareInitialMode}
        t={t}
        lang={lang}
      />

      {/* Web Notification & Audio Alert Settings Popup */}
      <NotificationSettingsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        notifPermission={notifPermission}
        onEnableNotifications={handleEnableNotifications}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        t={t}
        lang={lang}
      />
    </div>
  );
}
