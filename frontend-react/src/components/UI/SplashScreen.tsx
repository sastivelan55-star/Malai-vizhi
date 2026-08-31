// src/components/UI/SplashScreen.tsx — Professional PWA splash / loading animation
import React from 'react';

interface SplashScreenProps {
  message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message = 'Initializing Sensor Grid & Telemetry...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071A2B] text-white">
      {/* Brand Icon with Radar Pulse */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Subtle expanding radar pulse ring */}
        <div className="absolute w-28 h-28 rounded-full border border-teal-500/20 animate-ping opacity-75" />
        <div className="absolute w-20 h-20 rounded-full border border-teal-500/40 animate-pulse" />

        {/* Vector Mountain & Eye Mark */}
        <div className="w-16 h-16 rounded-2xl bg-[#0B2D42] border border-teal-500/30 flex items-center justify-center shadow-2xl relative z-10">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 36 L18 14 L26 24 L32 16 L42 36 Z" fill="#0B3948" stroke="#14B8A6" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M18 14 L22 21 L14 21 Z" fill="#14B8A6" opacity="0.7" />
            <path d="M32 16 L36 22 L28 22 Z" fill="#14B8A6" opacity="0.5" />
            <ellipse cx="24" cy="30" rx="11" ry="6.5" stroke="#2DD4BF" strokeWidth="1.5" fill="none" />
            <circle cx="24" cy="30" r="3.5" fill="#14B8A6" />
            <circle cx="24" cy="30" r="1.5" fill="#071A2B" />
          </svg>
        </div>
      </div>

      {/* Brand Title */}
      <h1 className="text-xl sm:text-2xl font-black tracking-[0.25em] text-white uppercase text-center mb-1">
        MALAI VIZHI
      </h1>
      <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-teal-400 uppercase text-center mb-8">
        AI LANDSLIDE INTELLIGENCE
      </p>

      {/* Subtle Progress Bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full animate-progress" />
      </div>

      <p className="text-[11px] text-slate-400 font-mono tracking-wide animate-pulse text-center">
        {message}
      </p>
    </div>
  );
};
