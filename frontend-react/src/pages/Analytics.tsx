// src/pages/Analytics.tsx
import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Zap, Clock } from 'lucide-react';
import { Layout } from '../components/Layout/Layout';
import { RegionalBarChart } from '../components/Analytics/RegionalBarChart';
import { RainfallTrendChart } from '../components/Analytics/RainfallTrendChart';
import { RiskPieChart } from '../components/Analytics/RiskPieChart';
import { getAnalytics } from '../services/api';
import { useRiskData } from '../hooks/useRiskData';
import type { AnalyticsData } from '../types';

export const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: locations } = useRiskData();

  useEffect(() => {
    getAnalytics().then((d) => { setAnalytics(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const kpiCards = analytics ? [
    { label: 'Stations Monitored', value: analytics.total_monitored, icon: BarChart2, suffix: 'stations', color: '#14B8A6' },
    { label: 'Alerts Issued', value: analytics.total_alerts_issued, icon: TrendingUp, suffix: 'total', color: '#F59E0B' },
    { label: 'Model Accuracy', value: `${analytics.model_accuracy}%`, icon: Zap, suffix: '', color: '#16A34A' },
    { label: 'Avg Lead Time', value: `${analytics.lead_time_hours}h`, icon: Clock, suffix: 'warning lead', color: '#0F766E' },
  ] : [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Climate & Risk Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Regional intelligence and system performance metrics from the MALAI VIZHI monitoring network.
          </p>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 animate-pulse">
                <div className="h-3 bg-slate-100 rounded w-20 sm:w-24 mb-3 sm:mb-4" />
                <div className="h-7 sm:h-8 bg-slate-100 rounded w-12 sm:w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {kpiCards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] sm:text-xs font-semibold tracking-wider sm:tracking-widest uppercase text-slate-400 truncate">{label}</span>
                  <Icon size={15} style={{ color }} className="flex-shrink-0" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#102A43] tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Regional comparison — takes 2 cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm overflow-hidden">
            <h2 className="text-sm font-semibold text-[#102A43] mb-1">Regional Comparison</h2>
            <p className="text-xs text-slate-400 mb-4">Average rainfall and soil moisture by state</p>
            {analytics ? (
              <div className="overflow-x-auto">
                <RegionalBarChart data={analytics.regional_comparison} />
              </div>
            ) : (
              <div className="h-64 bg-slate-50 rounded-lg animate-pulse" />
            )}
          </div>

          {/* Risk distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm overflow-hidden">
            <h2 className="text-sm font-semibold text-[#102A43] mb-1">Risk Distribution</h2>
            <p className="text-xs text-slate-400 mb-4">Current station risk levels</p>
            <RiskPieChart locations={locations} />
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rainfall trends */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm overflow-hidden">
            <h2 className="text-sm font-semibold text-[#102A43] mb-1">Rainfall by Region</h2>
            <p className="text-xs text-slate-400 mb-4">Sorted by highest average daily precipitation</p>
            {analytics ? (
              <div className="overflow-x-auto">
                <RainfallTrendChart data={analytics.regional_comparison} />
              </div>
            ) : (
              <div className="h-52 bg-slate-50 rounded-lg animate-pulse" />
            )}
          </div>

          {/* High risk stations table */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-[#102A43] mb-1">High Risk Stations</h2>
            <p className="text-xs text-slate-400 mb-4">Locations exceeding critical thresholds</p>
            <div className="space-y-2">
              {locations
                .filter((l) => l.risk_level === 'HIGH')
                .sort((a, b) => b.risk_score - a.risk_score)
                .slice(0, 6)
                .map((loc) => (
                  <div key={loc.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#102A43] truncate">{loc.name}</div>
                      <div className="text-xs text-slate-400">{loc.state}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-[#DC2626]">{loc.risk_score}</div>
                      <div className="text-[10px] text-slate-400">{loc.rainfall_mm.toFixed(1)} mm</div>
                    </div>
                  </div>
                ))}
              {locations.filter((l) => l.risk_level === 'HIGH').length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No high-risk stations currently detected.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data source note — wraps cleanly on mobile */}
        <div className="bg-[#071A2B] rounded-xl p-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs font-semibold text-white/40 tracking-wider uppercase">Data Sources:</span>
          <span className="text-xs text-[#14B8A6] font-semibold">NASA POWER AG Satellite</span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="text-xs text-white/60">Ground Sensor Network</span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="text-xs text-white/60">Physics-Informed XGBoost Model v2</span>
        </div>
      </div>
    </Layout>
  );
};
