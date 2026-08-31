// src/components/Analytics/RiskPieChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { LocationData } from '../../types';

interface RiskPieChartProps {
  locations: LocationData[];
}

export const RiskPieChart: React.FC<RiskPieChartProps> = ({ locations }) => {
  const high = locations.filter((l) => l.risk_level === 'HIGH').length;
  const moderate = locations.filter((l) => l.risk_level === 'MODERATE').length;
  const low = locations.filter((l) => l.risk_level === 'LOW').length;

  const data = [
    { name: 'High Risk', value: high, color: '#DC2626' },
    { name: 'Moderate Risk', value: moderate, color: '#F59E0B' },
    { name: 'Low Risk', value: low, color: '#16A34A' },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-sm text-slate-400">No data</div>;
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown, name: unknown) => [String(value), String(name)]}
            contentStyle={{ fontFamily: 'Inter', fontSize: '12px', borderRadius: '10px', border: '1px solid #f0f0f0' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Inter' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
