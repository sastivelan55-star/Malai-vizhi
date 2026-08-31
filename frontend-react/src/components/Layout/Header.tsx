// src/components/Layout/Header.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Bell, LayoutDashboard, AlertTriangle, FileText, BarChart2, HelpCircle, ShieldCheck } from 'lucide-react';
import { Logo } from '../UI/Logo';
import { StatusBadge } from '../UI/StatusBadge';
import { InstallPWA } from '../UI/InstallPWA';
import { useSystemStatus } from '../../hooks/useSystemStatus';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/alerts', label: 'Alerts', icon: AlertTriangle },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
];

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data, online } = useSystemStatus();

  const lastInf = data?.last_inference
    ? new Date(data.last_inference).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;

  return (
    <header className="bg-[#071A2B] border-b border-white/5 sticky top-0 z-50" role="banner">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex-shrink-0" aria-label="MALAI VIZHI Home">
          <Logo size="sm" variant="light" />
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* System status - desktop */}
          <div className="hidden sm:block">
            <StatusBadge online={online} lastUpdated={lastInf} />
          </div>

          {/* Active alerts indicator */}
          {data && data.active_alerts_count > 0 && (
            <NavLink
              to="/alerts"
              className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#DC2626]/20 text-[#DC2626] hover:bg-[#DC2626]/30 transition-colors"
              aria-label={`${data.active_alerts_count} active alerts`}
            >
              <Bell size={15} />
              <span className="absolute -top-1 -right-1 min-w-4 h-4 flex items-center justify-center bg-[#DC2626] text-white text-[10px] font-bold rounded-full px-1">
                {data.active_alerts_count}
              </span>
            </NavLink>
          )}

          {/* PWA Install Button */}
          <InstallPWA variant="button" className="hidden md:flex" />

          {/* Admin */}
          <NavLink
            to="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#14B8A6]/40 text-[#14B8A6] text-xs font-semibold tracking-wider hover:bg-[#14B8A6]/10 transition-colors"
          >
            <ShieldCheck size={13} />
            ADMIN
          </NavLink>

          {/* Mobile toggle */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center text-white/70 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#0B2D42] px-4 py-3" role="navigation" aria-label="Mobile navigation">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#14B8A6] hover:bg-white/5 transition-all mt-1 border-t border-white/5 pt-3"
            >
              <ShieldCheck size={15} />
              Admin Portal
            </NavLink>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2.5">
            <InstallPWA variant="banner" />
            <StatusBadge online={online} lastUpdated={lastInf} />
          </div>
        </div>
      )}
    </header>
  );
};
