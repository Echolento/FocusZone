let showNativeAlarm: (() => void) | null = null;
try {
  const mod = require('focuszone-fullscreen-alarm');
  if (mod && typeof mod.showFullScreenAlarm === 'function') {
    showNativeAlarm = mod.showFullScreenAlarm;
  }
} catch {}

export async function fireExitNotification(): Promise<void> {
  try {
    if (showNativeAlarm) {
      showNativeAlarm();
    }
  } catch {}
}
