// Web Audio API beep / chime alert for low stock reminders
export function playAlertSound(type = 'warning') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'danger') {
      // 2-tone urgent warning beep (Out of stock!)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.setValueAtTime(440, now + 0.15); // A4
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Second beep
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(880, now + 0.45);
      osc2.frequency.setValueAtTime(440, now + 0.6);
      gain2.gain.setValueAtTime(0.3, now + 0.45);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.85);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.45);
      osc2.stop(now + 0.85);
    } else {
      // Gentle notification chime for low stock
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (e) {
    console.warn("Audio playback not allowed or not supported:", e);
  }
}
