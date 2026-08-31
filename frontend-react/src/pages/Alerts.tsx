// src/pages/Alerts.tsx
import React, { useState } from 'react';
import { AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { Layout } from '../components/Layout/Layout';
import { AlertList } from '../components/Alerts/AlertList';
import { AlertDetailModal } from '../components/Alerts/AlertDetailModal';
import { ToastContainer, useToast } from '../components/UI/Toast';
import { useAlerts } from '../hooks/useAlerts';
import type { AlertItem, AlertStatus } from '../types';

export const Alerts: React.FC = () => {
  const { data: alerts, loading, acknowledge } = useAlerts();
  const [selected, setSelected] = useState<AlertItem | null>(null);
  const { toasts, addToast, dismissToast } = useToast();

  const active = alerts.filter((a) => a.status === 'Sent').length;
  const acknowledged = alerts.filter((a) => a.status === 'Acknowledged').length;
  const resolved = alerts.filter((a) => a.status === 'Resolved').length;

  const handleAcknowledge = async (id: number, status: AlertStatus) => {
    try {
      await acknowledge(id, status);
      addToast('success', 'Alert Updated', `Alert #${id} marked as ${status}.`);
    } catch {
      addToast('error', 'Update Failed', 'Could not update alert status. Check backend.');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-[#102A43]">Early Warning Alerts</h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and manage landslide risk alerts across the Northeast India sensor network.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#DC2626]/15 bg-red-50/50 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle size={18} className="text-[#DC2626]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#DC2626]">{active}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#F59E0B]/15 bg-amber-50/50 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Activity size={18} className="text-[#F59E0B]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F59E0B]">{acknowledged}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Acknowledged</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#16A34A]/15 bg-green-50/50 p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle size={18} className="text-[#16A34A]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#16A34A]">{resolved}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Resolved</div>
            </div>
          </div>
        </div>

        {/* Alert list */}
        <AlertList alerts={alerts} loading={loading} onSelect={setSelected} />

        {/* Detail modal */}
        <AlertDetailModal
          alert={selected}
          onClose={() => setSelected(null)}
          onAcknowledge={handleAcknowledge}
        />

        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </Layout>
  );
};
