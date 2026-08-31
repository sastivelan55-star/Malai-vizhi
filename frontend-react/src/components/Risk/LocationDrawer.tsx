// src/components/Risk/LocationDrawer.tsx
import React from 'react';
import {
  MapPin, Droplets, Thermometer, Wind, Clock, Database,
  BarChart2, X, ChevronRight, BrainCircuit
} from 'lucide-react';
import { RiskBadge } from '../UI/RiskBadge';
import type { LocationData } from '../../types';

interface LocationDrawerProps {
  location: LocationData | null;
  loading: boolean;
  onClose: () => void;
}

function DataRow({ icon: Icon, label, value, unit = '' }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={13} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold text-[#102A43]">
        {value}{unit}
      </span>
    </div>
  );
}

export const LocationDrawer: React.FC<LocationDrawerProps> = ({
  location,
  loading,
  onClose,
}) => {
  if (!location && !loading) return null;

  return (
    <aside
      className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
      aria-label="Location intelligence panel"
    >
      {/* Header */}
      <div className="bg-[#071A2B] px-5 py-4 flex items-start justify-between">
        <div>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-5 bg-white/20 rounded w-28 mb-2" />
              <div className="h-3 bg-white/10 rounded w-20" />
            </div>
          ) : location ? (
            <>
              <h2 className="text-white font-bold text-base">{location.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={11} className="text-[#14B8A6]" />
                <span className="text-[#14B8A6] text-xs font-medium">{location.state}</span>
              </div>
            </>
          ) : null}
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors p-1"
          aria-label="Close location panel"
        >
          <X size={16} />
        </button>
      </div>

      {loading ? (
        <div className="p-5 space-y-3 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-slate-100 rounded" />
          ))}
        </div>
      ) : location ? (
        <div className="flex-1 overflow-y-auto">
          {/* Risk Score + Badge */}
          <div className="px-5 py-4 border-b border-slate-50">
            <div className="flex items-center justify-between mb-3">
              <RiskBadge level={location.risk_level} />
              <div className="text-right">
                <div className="text-3xl font-bold text-[#102A43]">{location.risk_score}</div>
                <div className="text-xs text-slate-400 font-medium">AI Risk Score</div>
              </div>
            </div>
            {/* Score bar */}
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={location.risk_score} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${location.risk_score}%`,
                  background: location.risk_level === 'HIGH' ? '#DC2626' : location.risk_level === 'MODERATE' ? '#F59E0B' : '#16A34A',
                }}
              />
            </div>
          </div>

          {/* Environmental Data */}
          <div className="px-5 py-3">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
              Environmental Conditions
            </h3>
            <DataRow icon={Droplets} label="Rainfall" value={location.rainfall_mm.toFixed(1)} unit=" mm" />
            <DataRow icon={Droplets} label="Soil Moisture" value={location.soil_moisture.toFixed(1)} unit="%" />
            {location.temperature !== undefined && (
              <DataRow icon={Thermometer} label="Temperature" value={location.temperature.toFixed(1)} unit=" °C" />
            )}
            {location.humidity !== undefined && (
              <DataRow icon={Wind} label="Humidity" value={location.humidity.toFixed(1)} unit="%" />
            )}
            <DataRow icon={BarChart2} label="Slope" value={location.slope_deg.toFixed(1)} unit="°" />
          </div>

          {/* Metadata */}
          <div className="px-5 py-3 border-t border-slate-50">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-2">
              Station Metadata
            </h3>
            <DataRow icon={MapPin} label="Coordinates" value={`${location.latitude.toFixed(3)}°N, ${location.longitude.toFixed(3)}°E`} />
            <DataRow icon={Clock} label="Last Updated" value={location.last_updated?.split(' ')[1]?.slice(0, 5) || 'N/A'} />
            <DataRow icon={Database} label="Data Source" value={location.data_source || 'NASA POWER'} />
          </div>

          {/* AI Assessment */}
          {location.ai_assessment && (
            <div className="mx-5 mb-5 p-4 bg-[#071A2B]/4 rounded-xl border border-[#14B8A6]/15">
              <div className="flex items-center gap-1.5 mb-2">
                <BrainCircuit size={13} className="text-[#14B8A6]" />
                <span className="text-xs font-semibold text-[#0F766E] tracking-wider uppercase">
                  AI Assessment
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {location.ai_assessment}
              </p>
            </div>
          )}

          {/* Coordinates */}
          <div className="mx-5 mb-5 flex items-center gap-1 text-xs text-slate-400">
            <ChevronRight size={11} />
            <span>
              {location.latitude.toFixed(4)}°N · {location.longitude.toFixed(4)}°E
            </span>
          </div>
        </div>
      ) : null}
    </aside>
  );
};
