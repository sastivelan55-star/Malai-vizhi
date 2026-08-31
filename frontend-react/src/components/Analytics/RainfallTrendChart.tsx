// src/components/Analytics/RainfallTrendChart.tsx
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { RegionalComparison } from '../../types';

interface RainfallTrendChartProps {
  data: RegionalComparison[];
}

export const RainfallTrendChart: React.FC<RainfallTrendChartProps> = ({ data }) => {
  const sorted = [...data].sort((a, b) => b.avg_rainfall - a.avg_rainfall);

  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sorted} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
          <defs>
            <linearGradient id="rainfallGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
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
            unit="mm"
          />
          <Tooltip
            contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '10px', border: '1px solid #f0f0f0' }}
            formatter={(v: unknown) => [`${typeof v === 'number' ? v.toFixed(1) : v} mm`, 'Avg Rainfall']}
          />
          <Area
            type="monotone"
            dataKey="avg_rainfall"
            stroke="#14B8A6"
            strokeWidth={2}
            fill="url(#rainfallGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
