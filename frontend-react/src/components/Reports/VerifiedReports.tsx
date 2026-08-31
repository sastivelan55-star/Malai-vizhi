// src/components/Reports/VerifiedReports.tsx
import React from 'react';
import { MapPin, Clock, Tag, Image } from 'lucide-react';
import type { CitizenReport } from '../../types';
import { getUploadUrl } from '../../services/api';

interface VerifiedReportsProps {
  reports: CitizenReport[];
  loading: boolean;
}

export const VerifiedReports: React.FC<VerifiedReportsProps> = ({ reports, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-40 mb-2" />
            <div className="h-3 bg-slate-50 rounded w-full mb-1" />
            <div className="h-3 bg-slate-50 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-10 text-center">
        <MapPin size={28} className="text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">No community reports submitted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[#14B8A6]" />
                <span className="text-sm font-semibold text-[#102A43]">{report.location}</span>
              </div>
              {report.latitude && report.longitude && (
                <span className="text-xs text-slate-400 ml-5">
                  {report.latitude.toFixed(4)}°N, {report.longitude.toFixed(4)}°E
                </span>
              )}
            </div>
            {report.photo_path && (
              <a
                href={getUploadUrl(report.photo_path)}
                target="_blank"
                rel="noopener noreferrer"
                title="View photo evidence"
                className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-700"
              >
                <Image size={14} />
              </a>
            )}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">
            {report.description}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Tag size={10} />
              {report.category}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock size={10} />
              {report.submitted_at}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
