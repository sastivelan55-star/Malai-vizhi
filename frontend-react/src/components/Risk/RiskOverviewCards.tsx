// src/components/Risk/RiskOverviewCards.tsx
import React from 'react';
import { AlertTriangle, CheckCircle, Activity, MapPin } from 'lucide-react';
import type { LocationData } from '../../types';

interface RiskOverviewCardsProps {
  locations: LocationData[];
  loading?: boolean;
}

export const RiskOverviewCards: React.FC<RiskOverviewCardsProps> = ({ locations, loading }) => {
  const high = locations.filter((l) => l.risk_level === 'HIGH').length;
  const moderate = locations.filter((l) => l.risk_level === 'MODERATE').length;
  const low = locations.filter((l) => l.risk_level === 'LOW').length;
  const total = locations.length;

  const cards = [
    {
      label: 'High Risk',
      value: high,
      icon: AlertTriangle,
      color: '#DC2626',
      bg: 'bg-red-50',
      border: 'border-[#DC2626]/15',
    },
    {
      label: 'Moderate Risk',
      value: moderate,
      icon: Activity,
      color: '#F59E0B',
      bg: 'bg-amber-50',
      border: 'border-[#F59E0B]/15',
    },
    {
      label: 'Low Risk',
      value: low,
      icon: CheckCircle,
      color: '#16A34A',
      bg: 'bg-green-50',
      border: 'border-[#16A34A]/15',
    },
    {
      label: 'Monitored',
      value: total,
      icon: MapPin,
      color: '#14B8A6',
      bg: 'bg-teal-50',
      border: 'border-[#14B8A6]/15',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
            <div className="h-3 bg-slate-200 rounded w-20 mb-4" />
            <div className="h-8 bg-slate-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" role="region" aria-label="Risk overview statistics">
      {cards.map(({ label, value, icon: Icon, color, bg, border }) => (
        <div
          key={label}
          className={`rounded-xl border p-5 ${bg} ${border} flex flex-col gap-3`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
              {label}
            </span>
            <Icon size={16} style={{ color }} aria-hidden="true" />
          </div>
          <div>
            <span className="text-4xl font-bold tabular-nums" style={{ color }}>
              {value}
            </span>
            <span className="text-sm text-slate-400 ml-1.5 font-medium">stations</span>
          </div>
        </div>
      ))}
    </div>
  );
};
