// src/services/notificationService.ts — Mobile Alert Notifications, Vibration & Audio Feedback
// Supports Android (Capacitor WebView) and Web/PWA with permission handling & anti-spam deduplication.

export type NotificationSeverity = 'LOW' | 'MODERATE' | 'HIGH';

interface AlertNotificationOptions {
  id?: string | number;
  title: string;
  message: string;
  severity: NotificationSeverity;
  vibrate?: boolean;
  sound?: boolean;
}

// Track recently alerted IDs to prevent notification spam (within 30 seconds)
const recentAlerts = new Map<string, number>();
const DEDUP_WINDOW_MS = 30_000;

// Safe Web Audio Context singleton for synthesized alert chimes
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx && AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {
        // Audio will resume on next user gesture if browser policies apply
      });
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Play a synthesized sound tone appropriate for the alert severity.
 * - HIGH: Urgent dual-frequency alert burst (880Hz -> 1100Hz)
 * - MODERATE / LOW: Gentle two-tone chime (523Hz -> 659Hz)
 */
export function playAlertSound(severity: NotificationSeverity = 'MODERATE'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (severity === 'HIGH') {
      // Urgent, clear warning tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1100, now + 0.12);
      osc.frequency.setValueAtTime(880, now + 0.24);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.46);
    } else {
      // Subtle advisory chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.31);
    }
  } catch {
    // Audio synthesis failure should never crash the application
  }
}

/**
 * Trigger controlled vibration on Android / supported devices.
 * Strictly non-continuous:
 * - HIGH: [200, 100, 200] (urgent two-pulse pattern)
 * - MODERATE: [120] (single pulse)
 * - LOW: [40] (subtle tap)
 */
export function triggerAlertVibration(severity: NotificationSeverity = 'MODERATE'): void {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      if (severity === 'HIGH') {
        navigator.vibrate([200, 100, 200]);
      } else if (severity === 'MODERATE') {
        navigator.vibrate([120]);
      } else {
        navigator.vibrate([40]);
      }
    }
  } catch {
    // Vibration failure (e.g. permission or hardware unsupported) safely ignored
  }
}

/**
 * Request notification permission safely from the user / Android system.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem('mv_notifications_permission', permission);
    return permission;
  } catch {
    return 'denied';
  }
}

/**
 * Check current notification permission state.
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Dispatch an alert notification across visual, vibration, and sound channels.
 * Prevents spam with automatic deduplication.
 */
export function notifyAlert({
  id,
  title,
  message,
  severity,
  vibrate = true,
  sound = true,
}: AlertNotificationOptions): void {
  const alertKey = id !== undefined ? String(id) : `${title}:${message}`;
  const now = Date.now();

  // Spam prevention: ignore if already notified recently
  const lastFired = recentAlerts.get(alertKey);
  if (lastFired && now - lastFired < DEDUP_WINDOW_MS) {
    return;
  }
  recentAlerts.set(alertKey, now);

  // Clean old entries
  recentAlerts.forEach((timestamp, key) => {
    if (now - timestamp > DEDUP_WINDOW_MS) {
      recentAlerts.delete(key);
    }
  });

  // 1. Audio feedback
  if (sound) {
    playAlertSound(severity);
  }

  // 2. Vibration feedback (especially prominent for HIGH risk)
  if (vibrate) {
    triggerAlertVibration(severity);
  }

  // 3. System notification (if permission is granted)
  try {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const icon = '/favicon.svg';
      new Notification(`MALAI VIZHI: ${title}`, {
        body: message,
        icon,
        tag: `malai-alert-${alertKey}`,
      });
    }
  } catch {
    // Background notification catch
  }
}
