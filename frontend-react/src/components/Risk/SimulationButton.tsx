// src/components/Risk/SimulationButton.tsx
import React, { useState } from 'react';
import { CloudRain, Loader2, FlaskConical } from 'lucide-react';
import { simulateRain } from '../../services/api';
import type { SimulationResponse } from '../../types';

interface SimulationButtonProps {
  locationId: number | null;
  locationName?: string;
  onSuccess: (result: SimulationResponse) => void;
  onError: (msg: string) => void;
}

export const SimulationButton: React.FC<SimulationButtonProps> = ({
  locationId,
  locationName,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!locationId) {
      onError('Please select a station from the map or list first.');
      return;
    }
    setLoading(true);
    try {
      const result = await simulateRain(locationId);
      onSuccess(result);
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <FlaskConical size={16} className="text-[#14B8A6]" />
        <h3 className="text-sm font-semibold text-[#102A43]">Simulation</h3>
        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border border-amber-300 bg-amber-50 text-amber-600">
          DEMO
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4 leading-relaxed">
        Inject a synthetic precipitation spike event to observe risk escalation in real time.
        {locationName ? (
          <span className="block mt-1 text-[#0F766E] font-medium">
            Target: {locationName}
          </span>
        ) : (
          <span className="block mt-1 text-amber-600 font-medium">
            Select a station from the map or list below.
          </span>
        )}
      </p>
      <button
        type="button"
        onClick={handleSimulate}
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold
          transition-all duration-200 border min-h-[44px] active:scale-[0.99]
          ${loading
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            : !locationId
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 shadow-sm'
            : 'bg-[#0F766E] hover:bg-[#0B3948] active:bg-[#071A2B] text-white border-transparent shadow-md'
          }`}
        aria-label={`Simulate rain spike${locationName ? ` for ${locationName}` : ''}`}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Simulating…
          </>
        ) : (
          <>
            <CloudRain size={16} />
            {locationName ? `Simulate Rain on ${locationName}` : 'Simulate Rain Spike'}
          </>
        )}
      </button>
      <p className="text-[10px] text-slate-400 text-center mt-2 font-medium tracking-wider">
        DEMO EVENT — Updates backend database
      </p>
    </div>
  );
};
