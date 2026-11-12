// Browser Notification Service
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }
  return Notification.permission;
}

export function sendLowStockNotification(item, isOutOfStock = false, lang = 'ml') {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const title = isOutOfStock
    ? (lang === 'ml' ? `⚠️ സ്റ്റോക്ക് തീർന്നു: ${item.name}` : `⚠️ Out of Stock: ${item.name}`)
    : (lang === 'ml' ? `🔔 സ്റ്റോക്ക് കുറവാണ്: ${item.name}` : `🔔 Low Stock Alert: ${item.name}`);

  const body = isOutOfStock
    ? (lang === 'ml' 
        ? `${item.name} സ്റ്റോക്ക് പൂർണ്ണമായും കഴിഞ്ഞിരിക്കുന്നു! ഉടൻ റീ-ഓർഡർ ചെയ്യുക.`
        : `${item.name} has run out completely (0 ${item.unit})! Restock immediately.`)
    : (lang === 'ml'
        ? `ബാക്കി: ${item.quantity} ${item.unit} മാത്രം. (മിനിമം അളവ്: ${item.minThreshold} ${item.unit})`
        : `Only ${item.quantity} ${item.unit} remaining (Minimum limit: ${item.minThreshold} ${item.unit}).`);

  try {
    new Notification(title, {
      body,
      icon: '/favicon.svg',
      tag: `stock-${item.id}`,
      requireInteraction: isOutOfStock
    });
  } catch (e) {
    console.warn("Notification error:", e);
  }
}
