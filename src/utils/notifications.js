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
    ? (lang === 'ml' ? `⚠️ സ്റ്റോക്ക് തീർന്നു: ${item.nameMl || item.name}` : `⚠️ Out of Stock: ${item.name}`)
    : (lang === 'ml' ? `🔔 സ്റ്റോക്ക് കുറവാണ്: ${item.nameMl || item.name}` : `🔔 Low Stock Alert: ${item.name}`);

  const body = isOutOfStock
    ? (lang === 'ml' 
        ? `${item.nameMl || item.name} സ്റ്റോക്ക് പൂർണ്ണമായും കഴിഞ്ഞിരിക്കുന്നു (0 ${item.unit})! ഉടൻ റീ-ഓർഡർ ചെയ്യുക.`
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

export function testNotification(lang = 'ml') {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission !== 'granted') return 'not-granted';

  try {
    const title = lang === 'ml' ? '🔔 ടെസ്റ്റ് സ്റ്റോക്ക് അലർട്ട്' : '🔔 Test Stock Alert';
    const body = lang === 'ml'
      ? 'ഹൗസ്‌കീപ്പിംഗ് സ്റ്റോക്ക് അലർട്ട് നോട്ടിഫിക്കേഷനുകൾ നിങ്ങളുടെ ഡിവൈസിൽ ശരിയായി പ്രവർത്തിക്കുന്നുണ്ട്!'
      : 'Stock warning alert notifications are working properly on your device!';

    new Notification(title, {
      body,
      icon: '/favicon.svg',
      tag: 'test-notification'
    });
    return 'success';
  } catch (e) {
    console.warn("Notification error:", e);
    return 'error';
  }
}
