// src/pages/Dashboard.tsx
import React, { useState, useCallback } from 'react';
import { Satellite, RefreshCw } from 'lucide-react';
import { Layout } from '../components/Layout/Layout';
import { StatusBadge } from '../components/UI/StatusBadge';
import { RiskOverviewCards } from '../components/Risk/RiskOverviewCards';
import { StationMap } from '../components/Map/StationMap';
import { LocationDrawer } from '../components/Risk/LocationDrawer';
import { EnvGauges } from '../components/Risk/EnvGauges';
import { SimulationButton } from '../components/Risk/SimulationButton';
import { ToastContainer, useToast } from '../components/UI/Toast';
import { useRiskData, useLocation } from '../hooks/useRiskData';
import { useSystemStatus } from '../hooks/useSystemStatus';
import type { SimulationResponse } from '../types';

export const Dashboard: React.FC = () => {
  const { data: locations, loading: locLoading, error: locError, refetch } = useRiskData();
  const { data: status, online, loading: statusLoading } = useSystemStatus();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: selectedLoc, loading: selLoading } = useLocation(selectedId);
  const { toasts, addToast, dismissToast } = useToast();

  const handleSelectLocation = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleSimSuccess = useCallback(async (result: SimulationResponse) => {
    addToast(
      result.risk_level === 'HIGH' ? 'warning' : 'success',
      'Simulation Complete',
      `${result.location_name}: Risk escalated to ${result.risk_level} (Score: ${result.risk_score})`
    );
    await refetch();
  }, [addToast, refetch]);

  const handleSimError = useCallback((msg: string) => {
    addToast('error', 'Simulation Failed', msg);
  }, [addToast]);

  const lastInf = status?.last_inference
    ? new Date(status.last_inference).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : undefined;

  return (
    <Layout fullWidth noFooter>
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-screen-xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-base font-bold text-[#102A43] flex items-center gap-2">
                <Satellite size={15} className="text-[#14B8A6]" />
                Live Monitoring Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Northeast India · 12 Station Network</p>
            </div>
            <div className="flex items-center gap-3">
              {!statusLoading && <StatusBadge online={online} lastUpdated={lastInf} />}
              <button
                onClick={refetch}
                disabled={locLoading}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw size={14} className={locLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {locError && !online && (
          <div className="flex-shrink-0 bg-[#DC2626]/10 border-b border-[#DC2626]/20 px-6 py-2">
            <p className="text-xs text-[#DC2626] font-semibold text-center">
              BACKEND OFFLINE — Unable to reach Flask server. Retrying…
            </p>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Left panel — overview + map */}
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 gap-4 min-w-0">
            {/* Risk overview */}
            <div className="flex-shrink-0">
              <RiskOverviewCards locations={locations} loading={locLoading} />
            </div>

            {/* Map — takes remaining height */}
            <div className="flex-1 relative min-h-[320px]">
              <StationMap
                locations={locations}
                selectedId={selectedId}
                onSelectLocation={handleSelectLocation}
              />
              {/* Map legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-100 px-3 py-2 flex items-center gap-3 text-xs shadow-sm" aria-label="Map legend">
                {[
                  { color: '#DC2626', label: 'High' },
                  { color: '#F59E0B', label: 'Moderate' },
                  { color: '#16A34A', label: 'Low' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: color }} />
                    <span className="text-slate-500 font-medium">{label}</span>
                  </div>
                ))}
                <div className="text-slate-300 text-xs">·</div>
                <span className="text-slate-400 font-medium">Click marker for details</span>
              </div>
            </div>
          </div>

          {/* Right panel — sidebar */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col overflow-y-auto bg-[#F5F7F8]">
            <div className="p-4 flex flex-col gap-4">
              {/* Location Intelligence */}
              {selectedId ? (
                <LocationDrawer
                  location={selectedLoc}
                  loading={selLoading}
                  onClose={() => setSelectedId(null)}
                />
              ) : (
                <div className="bg-white rounded-xl border border-slate-100 p-6 text-center shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Satellite size={16} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">Location Intelligence</p>
                  <p className="text-xs text-slate-300 mt-1">Select a station on the map to view detailed telemetry.</p>
                </div>
              )}

              {/* Environmental gauges */}
              <EnvGauges location={selectedLoc} allLocations={locations} />

              {/* Simulation */}
              <SimulationButton
                locationId={selectedId}
                locationName={selectedLoc?.name}
                onSuccess={handleSimSuccess}
                onError={handleSimError}
              />

              {/* Station list quick select */}
              {locations.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-50">
                    <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400">
                      All Stations
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {locations.map((loc) => {
                      const riskColor = loc.risk_level === 'HIGH' ? '#DC2626' : loc.risk_level === 'MODERATE' ? '#F59E0B' : '#16A34A';
                      return (
                        <button
                          key={loc.id}
                          onClick={() => handleSelectLocation(loc.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0
                            ${selectedId === loc.id ? 'bg-slate-50' : ''}`}
                          aria-label={`Select ${loc.name} monitoring station`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: riskColor }} />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-[#102A43] truncate">{loc.name}</div>
                            <div className="text-[10px] text-slate-400">{loc.state}</div>
                          </div>
                          <span className="text-xs font-bold" style={{ color: riskColor }}>{loc.risk_score}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </Layout>
  );
};
