// src/components/Analytics/RegionalBarChart.tsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { RegionalComparison } from '../../types';

interface RegionalBarChartProps {
  data: RegionalComparison[];
}

const CustomTooltip = ({ active, payload, label }: Record<string, unknown>) => {
  if (!active || !payload) return null;
  const items = payload as Array<{ name: string; value: number; color: string }>;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-xs font-medium">
      <p className="text-[#102A43] font-bold mb-1.5">{label as string}</p>
      {items.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value.toFixed(1)}
        </p>
      ))}
    </div>
  );
};

export const RegionalBarChart: React.FC<RegionalBarChartProps> = ({ data }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="state"
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter', color: '#94a3b8' }}
          />
          <Bar dataKey="avg_rainfall" name="Avg Rainfall (mm)" fill="#14B8A6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="avg_moisture" name="Avg Moisture (%)" fill="#0B3948" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
