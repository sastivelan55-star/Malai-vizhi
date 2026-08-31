// src/components/UI/InstallPWA.tsx — PWA Installation Button & iOS Guide
import React from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface InstallPWAProps {
  variant?: 'button' | 'banner';
  className?: string;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ variant = 'button', className = '' }) => {
  const { canInstall, isInstalled, showIOSPrompt, promptInstall, dismissIOSPrompt } = usePWAInstall();

  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <>
      {/* Install Button */}
      {variant === 'button' ? (
        <button
          onClick={promptInstall}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-xs font-semibold tracking-wider transition-all active:scale-95 shadow-sm ${className}`}
          title="Install MALAI VIZHI as a desktop or mobile application"
          aria-label="Install App"
        >
          <Download size={13} className="text-teal-400 animate-bounce" />
          <span>INSTALL APP</span>
        </button>
      ) : (
        <div className={`bg-[#0B2D42] border border-teal-500/30 rounded-xl p-3 flex items-center justify-between gap-3 shadow-lg ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0">
              <Download size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-wide">Install Malai Vizhi App</p>
              <p className="text-[11px] text-slate-300">Fast offline access & emergency alerts</p>
            </div>
          </div>
          <button
            onClick={promptInstall}
            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex-shrink-0"
          >
            Install
          </button>
        </div>
      )}

      {/* iOS Safari Instruction Modal */}
      {showIOSPrompt && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#071A2B] border border-teal-500/30 rounded-2xl p-5 max-w-sm w-full text-white shadow-2xl relative">
            <button
              onClick={dismissIOSPrompt}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              aria-label="Close installation guide"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 border border-teal-500/30">
                <Download size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Install on iPhone / iPad</h3>
                <p className="text-xs text-teal-400 font-medium">Add to Home Screen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Install <strong>Malai Vizhi</strong> on your device for full-screen emergency monitoring:
            </p>

            <div className="space-y-3 bg-[#0B2D42]/60 rounded-xl p-3.5 border border-white/5 text-xs text-slate-200 mb-5">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span className="flex items-center gap-1.5">
                  Tap the <Share size={14} className="text-teal-400 inline" /> <strong>Share</strong> button in Safari's toolbar
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span className="flex items-center gap-1.5">
                  Scroll down and tap <PlusSquare size={14} className="text-teal-400 inline" /> <strong>Add to Home Screen</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span>
                  Tap <strong>Add</strong> in the top right corner
                </span>
              </div>
            </div>

            <button
              onClick={dismissIOSPrompt}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors tracking-wide"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
