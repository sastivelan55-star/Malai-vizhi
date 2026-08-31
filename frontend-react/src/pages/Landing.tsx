// src/pages/Landing.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BrainCircuit, Satellite, Bell, Users,
  ArrowDownRight, ChevronDown, ShieldCheck, Zap, Eye
} from 'lucide-react';
import { Logo } from '../components/UI/Logo';
import { useSystemStatus } from '../hooks/useSystemStatus';
import { StatusBadge } from '../components/UI/StatusBadge';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Risk Prediction',
    desc: 'Physics-informed machine learning combines precipitation, soil saturation, and slope data to compute landslide probability scores in real time.',
  },
  {
    icon: Satellite,
    title: 'Real-Time Monitoring',
    desc: 'Continuous data ingestion from NASA POWER satellite feeds and ground sensor networks across 12 high-risk stations in Northeast India.',
  },
  {
    icon: Bell,
    title: 'Early Warning',
    desc: 'Automated alert dispatching when risk thresholds are exceeded — reaching emergency coordinators with actionable intelligence before events escalate.',
  },
  {
    icon: Users,
    title: 'Citizen Reporting',
    desc: 'Ground-truth verification through community hazard reports integrated directly into the risk assessment pipeline.',
  },
];

const DATA_OVERLAYS = [
  { label: 'Rainfall', value: '168mm', color: '#14B8A6' },
  { label: 'Soil Moisture', value: '82%', color: '#0F766E' },
  { label: 'Risk Score', value: '74/100', color: '#F59E0B' },
  { label: 'AI Analysis', value: 'High', color: '#DC2626' },
];

// Topographic SVG illustration
const TopoHero: React.FC = () => (
  <div className="relative w-full h-80 lg:h-full select-none pointer-events-none" aria-hidden="true">
    <svg
      viewBox="0 0 600 400"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contour lines */}
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((opacity, i) => (
        <ellipse
          key={i}
          cx="300" cy="220"
          rx={60 + i * 55} ry={30 + i * 25}
          fill="none"
          stroke="#14B8A6"
          strokeWidth="1"
          opacity={opacity * 0.4}
        />
      ))}
      {/* Mountain range */}
      <path
        d="M0 300 L80 180 L140 230 L220 100 L300 160 L360 80 L430 140 L500 90 L560 160 L600 200 L600 400 L0 400 Z"
        fill="#0B3948"
        opacity="0.8"
      />
      <path
        d="M0 340 L60 250 L120 290 L200 160 L280 210 L340 130 L400 190 L470 120 L530 180 L600 220 L600 400 L0 400 Z"
        fill="#071A2B"
        opacity="0.9"
      />
      {/* Snow highlights */}
      <path d="M220 100 L240 125 L200 125 Z" fill="#14B8A6" opacity="0.4" />
      <path d="M360 80 L378 108 L342 108 Z" fill="#14B8A6" opacity="0.5" />
      <path d="M500 90 L515 112 L485 112 Z" fill="#14B8A6" opacity="0.3" />
      {/* Grid overlay */}
      {[...Array(7)].map((_, i) => (
        <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="400" stroke="#14B8A6" strokeWidth="0.3" opacity="0.12" />
      ))}
      {[...Array(5)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 100} x2="600" y2={i * 100} stroke="#14B8A6" strokeWidth="0.3" opacity="0.12" />
      ))}
      {/* Scan line */}
      <line x1="0" y1="180" x2="600" y2="180" stroke="#14B8A6" strokeWidth="1" opacity="0.3" strokeDasharray="4 8" />
      {/* Station dots */}
      {[
        [220, 100], [360, 80], [300, 160], [140, 230], [500, 90]
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#DC2626" opacity="0.9" />
          <circle cx={x} cy={y} r="10" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.4" />
        </g>
      ))}
    </svg>
    {/* Data overlay chips */}
    <div className="absolute top-6 right-6 flex flex-col gap-2">
      {DATA_OVERLAYS.map(({ label, value, color }) => (
        <div key={label} className="flex items-center gap-2 bg-[#071A2B]/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs text-white/60 font-medium">{label}</span>
          <span className="text-xs font-bold ml-1" style={{ color }}>{value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const Landing: React.FC = () => {
  const { data, online } = useSystemStatus();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F8]">
      {/* Top bar */}
      <div className="bg-[#071A2B] px-6 py-3 flex items-center justify-between border-b border-white/5">
        <Logo size="sm" variant="light" />
        <div className="flex items-center gap-3">
          <StatusBadge online={online} />
          <Link
            to="/admin"
            className="px-3 py-1.5 rounded-lg border border-[#14B8A6]/40 text-[#14B8A6] text-xs font-semibold tracking-wider hover:bg-[#14B8A6]/10 transition-colors hidden sm:flex items-center gap-1.5"
          >
            <ShieldCheck size={12} />
            ADMIN
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-[#071A2B] flex-1 min-h-[80vh] flex flex-col lg:flex-row" aria-label="Hero section">
        {/* Left content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-16 lg:py-0">
          {/* System badge */}
          {data && (
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-8 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-xs font-medium text-white/60">
                {data.stations_monitored} stations · {data.active_alerts_count} active alerts
              </span>
            </div>
          )}

          {/* Tagline */}
          <p className="text-xs font-semibold tracking-widest uppercase text-[#14B8A6] mb-4">
            WATCHING OVER EVERY MOUNTAIN
          </p>

          {/* Main heading */}
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-none tracking-tight mb-4">
            MALAI<br />
            <span className="text-[#14B8A6]">VIZHI</span>
          </h1>

          <p className="text-lg text-white/50 font-medium mb-6 tracking-wide">
            AI-Based Landslide Early Warning System
          </p>

          <p className="text-base text-white/60 max-w-lg leading-relaxed mb-10">
            An intelligent monitoring platform combining environmental signals, risk analysis and early warning to help identify landslide threats before they become emergencies.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#14B8A6] hover:bg-[#0F766E] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
              aria-label="View Live Dashboard"
            >
              VIEW LIVE DASHBOARD
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold text-sm transition-all"
              aria-label="Explore the system"
            >
              EXPLORE THE SYSTEM
            </Link>
          </div>
        </div>

        {/* Right — topographic illustration */}
        <div className="flex-1 relative lg:max-w-lg xl:max-w-xl border-l border-white/5">
          <TopoHero />
        </div>
      </section>

      {/* Scroll cue */}
      <div className="bg-[#071A2B] flex justify-center pb-6" aria-hidden="true">
        <ChevronDown size={20} className="text-white/20 animate-bounce" />
      </div>

      {/* Features */}
      <section className="py-20 px-6 sm:px-12 max-w-screen-xl mx-auto w-full" aria-label="System capabilities">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#14B8A6] mb-3">
            System Capabilities
          </p>
          <h2 className="text-3xl font-bold text-[#102A43]">
            Integrated Intelligence at Every Layer
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
            From satellite telemetry to citizen ground-truth, MALAI VIZHI connects every data source into a unified risk picture.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#071A2B] flex items-center justify-center mb-5 group-hover:bg-[#0B3948] transition-colors">
                <Icon size={18} className="text-[#14B8A6]" />
              </div>
              <h3 className="text-sm font-bold text-[#102A43] mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* System stats */}
      {data && (
        <section className="bg-[#071A2B] py-12 px-6" aria-label="Live system statistics">
          <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Monitored Stations', value: data.stations_monitored, icon: Eye },
              { label: 'Active Alerts', value: data.active_alerts_count, icon: Bell },
              { label: 'Citizen Reports', value: data.citizen_reports_count, icon: Users },
              { label: 'Model Confidence', value: data.telemetry_grid.model_confidence, icon: Zap },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon size={16} className="text-[#14B8A6] mx-auto mb-2" />
                <div className="text-3xl font-black text-white mb-1">{value}</div>
                <div className="text-xs text-white/40 font-medium tracking-wider uppercase">{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="py-16 px-6 bg-[#F5F7F8]" aria-label="Call to action">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#102A43] mb-4">Ready to Monitor the Mountains?</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Access live risk assessments, environmental telemetry, and early warning intelligence for Northeast India's most vulnerable terrain.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#071A2B] hover:bg-[#0B3948] text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl"
          >
            Launch Dashboard
            <ArrowDownRight size={15} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#071A2B] border-t border-white/5 py-6 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <Logo size="sm" variant="light" />
          <p className="text-white/25 text-xs">
            Research prototype — not for operational emergency use without field validation.
          </p>
        </div>
      </footer>
    </div>
  );
};
