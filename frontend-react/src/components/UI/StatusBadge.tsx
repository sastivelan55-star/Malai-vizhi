// src/components/UI/StatusBadge.tsx
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface StatusBadgeProps {
  online: boolean;
  lastUpdated?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ online, lastUpdated }) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border
          ${online
            ? 'bg-green-50 text-[#16A34A] border-[#16A34A]/30'
            : 'bg-red-50 text-[#DC2626] border-[#DC2626]/30'
          }`}
        role="status"
        aria-label={online ? 'System operational' : 'Backend offline'}
      >
        {online ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
            <Wifi size={11} />
            SYSTEM OPERATIONAL
          </>
        ) : (
          <>
            <WifiOff size={11} />
            BACKEND OFFLINE
          </>
        )}
      </span>
      {lastUpdated && online && (
        <span className="text-xs text-slate-400">
          Updated {lastUpdated}
        </span>
      )}
    </div>
  );
};
