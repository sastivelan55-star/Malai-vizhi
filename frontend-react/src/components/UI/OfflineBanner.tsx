// src/components/UI/OfflineBanner.tsx — Real-time connection status banner
import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useSystemStatus } from '../../hooks/useSystemStatus';

export const OfflineBanner: React.FC = () => {
  const [isNetworkOnline, setIsNetworkOnline] = useState<boolean>(navigator.onLine);
  const { online: isBackendOnline, refetch } = useSystemStatus();
  const [retrying, setRetrying] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsNetworkOnline(true);
    const handleOffline = () => setIsNetworkOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualRetry = async () => {
    setRetrying(true);
    await refetch();
    setTimeout(() => setRetrying(false), 800);
  };

  // If fully connected, do not show persistent banner
  if (isNetworkOnline && isBackendOnline) {
    return null;
  }

  return (
    <div
      role="alert"
      className="bg-[#DC2626] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md transition-all sticky top-16 z-40"
    >
      <div className="flex items-center gap-2 max-w-screen-xl mx-auto w-full justify-between">
        <div className="flex items-center gap-2">
          <WifiOff size={14} className="animate-pulse" />
          <span>
            {!isNetworkOnline
              ? 'NETWORK OFFLINE — Device is not connected to the internet. Showing cached application shell.'
              : 'BACKEND OFFLINE — Unable to reach Malai Vizhi server. Live telemetry paused.'}
          </span>
        </div>
        <button
          onClick={handleManualRetry}
          disabled={retrying}
          className="flex items-center gap-1 px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-bold uppercase transition-colors flex-shrink-0"
          aria-label="Retry connection"
        >
          <RefreshCw size={11} className={retrying ? 'animate-spin' : ''} />
          Retry
        </button>
      </div>
    </div>
  );
};
