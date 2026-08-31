// src/components/Alerts/AlertList.tsx
import React, { useState, useMemo } from 'react';
import { AlertTriangle, ChevronRight, Filter } from 'lucide-react';
import { RiskBadge } from '../UI/RiskBadge';
import type { AlertItem, RiskLevel } from '../../types';

interface AlertListProps {
  alerts: AlertItem[];
  loading: boolean;
  onSelect: (alert: AlertItem) => void;
}

const STATUS_COLORS: Record<string, string> = {
  Sent: 'bg-red-50 text-[#DC2626] border-[#DC2626]/20',
  Acknowledged: 'bg-amber-50 text-[#F59E0B] border-[#F59E0B]/20',
  Resolved: 'bg-green-50 text-[#16A34A] border-[#16A34A]/20',
};

export const AlertList: React.FC<AlertListProps> = ({ alerts, loading, onSelect }) => {
  const [severityFilter, setSeverityFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Sent' | 'Acknowledged' | 'Resolved'>('ALL');

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      return true;
    });
  }, [alerts, severityFilter, statusFilter]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 animate-pulse flex gap-4">
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-slate-100 rounded w-32 mb-2" />
              <div className="h-3 bg-slate-50 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Alert filters">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Filter size={12} />
          Filter:
        </div>
        <div className="flex gap-1 flex-wrap">
          {(['ALL', 'HIGH', 'MODERATE', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                ${severityFilter === sev
                  ? 'bg-[#071A2B] text-white border-[#071A2B]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              aria-pressed={severityFilter === sev}
            >
              {sev}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap border-l border-slate-100 pl-3">
          {(['ALL', 'Sent', 'Acknowledged', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors
                ${statusFilter === st
                  ? 'bg-[#071A2B] text-white border-[#071A2B]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              aria-pressed={statusFilter === st}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-10 text-center">
          <AlertTriangle size={28} className="text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No alerts match the current filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm" role="table" aria-label="Alert management table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-slate-400 tracking-wider uppercase">ID</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-slate-400 tracking-wider uppercase">Location</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-slate-400 tracking-wider uppercase hidden sm:table-cell">Severity</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-slate-400 tracking-wider uppercase hidden md:table-cell">Timestamp</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-semibold text-slate-400 tracking-wider uppercase">Status</th>
                <th scope="col" className="px-4 py-3 sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((alert) => (
                <tr
                  key={alert.id}
                  onClick={() => onSelect(alert)}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition-colors group"
                  role="row"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') onSelect(alert); }}
                  aria-label={`Alert ${alert.id}: ${alert.severity} - ${alert.location_name}`}
                >
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">#{alert.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#102A43]">{alert.location_name}</div>
                    <div className="text-xs text-slate-400">{alert.location_state}</div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <RiskBadge level={alert.severity} size="sm" />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-slate-400">
                    {alert.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_COLORS[alert.status]}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" aria-hidden="true" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
