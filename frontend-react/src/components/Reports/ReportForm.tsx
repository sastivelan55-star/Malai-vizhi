// src/components/Reports/ReportForm.tsx
import React, { useState, useRef } from 'react';
import { Upload, MapPin, Lock, CheckCircle, Loader2, X, ImageIcon } from 'lucide-react';
import { ReportPickerMap } from '../Map/ReportPickerMap';
import { submitReport } from '../../services/api';

interface ReportFormProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const CATEGORIES = [
  'Landslide Risk',
  'Mudslide & Debris',
  'Tension Cracks',
  'Road Blockage',
  'Flash Flood',
  'Slope Erosion',
  'Other Hazard',
];

export const ReportForm: React.FC<ReportFormProps> = ({ onSuccess, onError }) => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Landslide Risk');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) { onError('Please enter a location description.'); return; }
    if (!description.trim()) { onError('Please describe the hazard observed.'); return; }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('location', location.trim());
      fd.append('description', description.trim());
      fd.append('category', category);
      if (coords) {
        fd.append('latitude', String(coords.lat));
        fd.append('longitude', String(coords.lng));
      }
      if (photo) {
        fd.append('photo', photo);
      }
      await submitReport(fd);
      setSubmitted(true);
      onSuccess();
    } catch (e) {
      onError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-[#16A34A]/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-[#16A34A]" />
        </div>
        <h2 className="text-xl font-bold text-[#102A43] mb-2">Report Submitted</h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
          Thank you for helping identify potential hazards. Your report has been securely received and queued for verification.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setLocation('');
            setDescription('');
            setCoords(null);
            removePhoto();
          }}
          className="mt-6 px-5 py-2.5 rounded-lg bg-[#071A2B] text-white text-sm font-semibold hover:bg-[#0B3948] transition-colors"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6" noValidate>
      {/* Photo upload */}
      <div>
        <label className="block text-sm font-semibold text-[#102A43] mb-2">
          Photo Evidence <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 h-44">
            <img src={photoPreview} alt="Uploaded preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-slate-600 hover:text-red-500 shadow-sm"
              aria-label="Remove photo"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-slate-200 hover:border-[#14B8A6] rounded-xl p-8 flex flex-col items-center gap-2 transition-colors group"
            aria-label="Upload photo"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
              <ImageIcon size={20} className="text-slate-300 group-hover:text-[#14B8A6] transition-colors" />
            </div>
            <span className="text-sm text-slate-400 group-hover:text-[#0F766E] font-medium transition-colors">
              <Upload size={13} className="inline mr-1" />
              Upload a photo
            </span>
            <span className="text-xs text-slate-300">PNG, JPG, JPEG, WebP</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
          onChange={handlePhotoChange}
          className="hidden"
          aria-label="Photo file input"
        />
      </div>

      {/* Location map */}
      <div>
        <label className="block text-sm font-semibold text-[#102A43] mb-2">
          Incident Location
        </label>
        <ReportPickerMap value={coords} onChange={setCoords} />
        {coords && (
          <div className="mt-2 flex items-center gap-2 text-xs text-[#0F766E] font-medium bg-teal-50 px-3 py-2 rounded-lg border border-[#14B8A6]/20">
            <MapPin size={12} />
            {coords.lat}°N, {coords.lng}°E
          </div>
        )}
      </div>

      {/* Location name */}
      <div>
        <label htmlFor="report-location" className="block text-sm font-semibold text-[#102A43] mb-1.5">
          Location Description <span className="text-[#DC2626]">*</span>
        </label>
        <input
          id="report-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Near Mawphlang Road, Meghalaya"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#102A43] placeholder-slate-300
            focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="report-category" className="block text-sm font-semibold text-[#102A43] mb-1.5">
          Hazard Category
        </label>
        <select
          id="report-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#102A43]
            focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors bg-white"
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="report-description" className="block text-sm font-semibold text-[#102A43] mb-1.5">
          Observation Details <span className="text-[#DC2626]">*</span>
        </label>
        <textarea
          id="report-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          placeholder="Describe what you observed — soil movement, cracks, water flow, road damage, etc."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#102A43] placeholder-slate-300
            focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 focus:border-[#14B8A6] transition-colors resize-y"
        />
      </div>

      {/* Security indicator */}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
        <Lock size={12} className="text-[#14B8A6]" />
        <span><strong className="text-[#0F766E]">Secure Submission</strong> — Your report is encrypted and sent directly to our verification team.</span>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
          bg-[#071A2B] hover:bg-[#0B3948] text-white font-semibold text-sm
          transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Submit hazard report"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting Report…
          </>
        ) : (
          <>
            <Lock size={15} />
            Submit Report
          </>
        )}
      </button>
    </form>
  );
};
