// src/components/UI/MetricCard.tsx
import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  color?: string;
  trend?: 'up' | 'down' | 'stable';
  suffix?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  color = '#14B8A6',
  suffix,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-[#102A43]">{value}</span>
        {unit && <span className="text-sm text-slate-400 font-medium">{unit}</span>}
        {suffix && <span className="text-xs text-slate-400 ml-1">{suffix}</span>}
      </div>
    </div>
  );
};
