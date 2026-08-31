// src/hooks/usePWAInstall.ts — Progressive Web App installation hook
import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    // 2. Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/crios|fxios|edgios|chrome/.test(ua);
    const isIOSSafari = isAppleDevice && isSafari && !isStandalone;
    setIsIOS(isIOSSafari);

    // 3. Listen for Chrome/Edge/Android beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 4. Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowIOSPrompt(false);
      console.log('[PWA] MALAI VIZHI installed successfully as an application.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation dialog
  const promptInstall = useCallback(async () => {
    if (isIOS) {
      setShowIOSPrompt(true);
      return;
    }

    if (!deferredPrompt) {
      console.log('[PWA] Installation prompt not currently available.');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('[PWA] User accepted installation.');
        setIsInstalled(true);
      } else {
        console.log('[PWA] User dismissed installation.');
      }
    } catch (err) {
      console.error('[PWA] Install prompt error:', err);
    } finally {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, isIOS]);

  const dismissIOSPrompt = useCallback(() => {
    setShowIOSPrompt(false);
  }, []);

  return {
    canInstall: !isInstalled && (deferredPrompt !== null || isIOS),
    isInstalled,
    isIOS,
    showIOSPrompt,
    promptInstall,
    dismissIOSPrompt,
  };
}
