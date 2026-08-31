// src/components/Layout/Footer.tsx
import React from 'react';
import { Logo } from '../UI/Logo';
import { Shield, Database, Satellite } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#071A2B] border-t border-white/5 py-8 mt-auto" role="contentinfo">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <Logo size="sm" variant="light" />
            <p className="text-white/40 text-xs mt-2 max-w-sm leading-relaxed">
              AI-powered geospatial intelligence for landslide early warning
              across Northeast India's high-risk terrain.
            </p>
          </div>

          {/* System info */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Satellite size={12} />
              <span>NASA POWER AG</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Database size={12} />
              <span>12 Monitoring Stations</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <Shield size={12} />
              <span>v2.4.0</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-white/25 text-xs">
            © {year} MALAI VIZHI. Research & demonstration prototype.
          </p>
          <p className="text-white/25 text-xs">
            Not for operational emergency use without field validation.
          </p>
        </div>
      </div>
    </footer>
  );
};
