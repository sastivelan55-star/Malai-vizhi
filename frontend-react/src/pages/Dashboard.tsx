// src/pages/Dashboard.tsx
import React, { useState, useCallback, useEffect } from 'react';
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
import { notifyAlert } from '../services/notificationService';
import type { SimulationResponse } from '../types';

export const Dashboard: React.FC = () => {
  const { data: locations, loading: locLoading, error: locError, refetch } = useRiskData();
  const { data: status, online, loading: statusLoading } = useSystemStatus();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: selectedLoc, loading: selLoading } = useLocation(selectedId);
  const { toasts, addToast, dismissToast } = useToast();

  // Auto-select the highest risk station once loaded if nothing is selected yet
  useEffect(() => {
    if (locations.length > 0 && selectedId === null) {
      const highest = [...locations].sort((a, b) => b.risk_score - a.risk_score)[0];
      if (highest) {
        setSelectedId(highest.id);
      }
    }
  }, [locations, selectedId]);

  const handleSelectLocation = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleSimSuccess = useCallback(async (result: SimulationResponse) => {
    addToast(
      result.risk_level === 'HIGH' ? 'warning' : 'success',
      'Simulation Complete',
      `${result.location_name}: Risk escalated to ${result.risk_level} (Score: ${result.risk_score})`
    );
    notifyAlert({
      id: `sim-${result.location_id}-${Date.now()}`,
      title: `${result.risk_level} Risk Simulation: ${result.location_name}`,
      message: `Rainfall surged to ${result.rainfall_mm.toFixed(1)} mm, soil moisture ${result.soil_moisture.toFixed(1)}%. Risk: ${result.risk_level}`,
      severity: result.risk_level,
    });
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
      <div className="flex flex-col min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
        {/* Dashboard Header */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[#102A43] flex items-center gap-2">
                <Satellite size={16} className="text-[#14B8A6] flex-shrink-0" />
                <span>Live Monitoring Dashboard</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Northeast India · 12 Station Network</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {!statusLoading && (
                <div className="hidden sm:block">
                  <StatusBadge online={online} lastUpdated={lastInf} />
                </div>
              )}
              <button
                type="button"
                onClick={refetch}
                disabled={locLoading}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 transition-colors"
                aria-label="Refresh data"
              >
                <RefreshCw size={15} className={locLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {locError && !online && (
          <div className="flex-shrink-0 bg-[#DC2626]/10 border-b border-[#DC2626]/20 px-4 sm:px-6 py-2">
            <p className="text-xs text-[#DC2626] font-semibold text-center">
              BACKEND OFFLINE — Unable to reach server. Retrying…
            </p>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-1 lg:overflow-hidden flex flex-col lg:flex-row">
          {/* Left panel — overview + map */}
          <div className="flex-1 flex flex-col p-3.5 sm:p-6 gap-3.5 sm:gap-4 min-w-0">
            {/* Risk overview */}
            <div className="flex-shrink-0">
              <RiskOverviewCards locations={locations} loading={locLoading} />
            </div>

            {/* Map — responsive height */}
            <div className="h-[340px] sm:h-[420px] lg:h-auto lg:flex-1 relative min-h-[300px]">
              <StationMap
                locations={locations}
                selectedId={selectedId}
                onSelectLocation={handleSelectLocation}
              />
              {/* Map legend */}
              <div
                className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl border border-slate-100 px-2.5 py-1.5 sm:px-3 sm:py-2 flex items-center gap-2.5 sm:gap-3 text-xs shadow-md z-[400]"
                aria-label="Map legend"
              >
                {[
                  { color: '#DC2626', label: 'High' },
                  { color: '#F59E0B', label: 'Mod' },
                  { color: '#16A34A', label: 'Low' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: color }} />
                    <span className="text-slate-600 font-medium text-[11px] sm:text-xs">{label}</span>
                  </div>
                ))}
                <span className="text-slate-400 font-medium hidden sm:inline">· Tap marker for details</span>
              </div>
            </div>
          </div>

          {/* Right panel — sidebar */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col lg:overflow-y-auto bg-[#F5F7F8]">
            <div className="p-3.5 sm:p-4 flex flex-col gap-4">
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
                  <p className="text-xs font-semibold text-slate-500">Location Intelligence</p>
                  <p className="text-xs text-slate-400 mt-1">Select a station on the map to view detailed telemetry.</p>
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
                      All Stations ({locations.length})
                    </h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {locations.map((loc) => {
                      const riskColor = loc.risk_level === 'HIGH' ? '#DC2626' : loc.risk_level === 'MODERATE' ? '#F59E0B' : '#16A34A';
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => handleSelectLocation(loc.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors border-b border-slate-50 last:border-0 min-h-[44px]
                            ${selectedId === loc.id ? 'bg-teal-50/50 border-l-4 border-l-[#14B8A6]' : ''}`}
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
