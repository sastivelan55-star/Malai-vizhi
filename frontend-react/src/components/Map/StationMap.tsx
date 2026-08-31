// src/components/Map/StationMap.tsx
import React, { useEffect, useRef, memo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LocationData } from '../../types';
import { COLORS, MAP_CENTER, MAP_ZOOM } from '../../data/constants';

// Fix Leaflet default icon path issues in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface StationMapProps {
  locations: LocationData[];
  selectedId: number | null;
  onSelectLocation: (id: number) => void;
}

function riskColor(level: string): string {
  if (level === 'HIGH') return COLORS.risk.HIGH;
  if (level === 'MODERATE') return COLORS.risk.MODERATE;
  return COLORS.risk.LOW;
}

function createRiskMarker(level: string, score: number): L.DivIcon {
  const color = riskColor(level);
  const pulseAnim = level === 'HIGH' ? 'animation: pulse 1.5s ease-in-out infinite;' : '';
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        ${level === 'HIGH' ? `
          <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:${color}22;${pulseAnim}border:1.5px solid ${color}55;"></div>
        ` : ''}
        <div style="
          width:26px;height:26px;border-radius:50%;
          background:${color};
          border:2.5px solid white;
          box-shadow:0 2px 8px ${color}66;
          display:flex;align-items:center;justify-content:center;
          font-size:9px;font-weight:700;color:white;font-family:Inter,sans-serif;
        ">${score}</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

export const StationMap: React.FC<StationMapProps> = memo(({ locations, selectedId, onSelectLocation }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !locations.length) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    locations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: createRiskMarker(loc.risk_level, loc.risk_score),
        title: loc.name,
        alt: `${loc.name} - ${loc.risk_level} risk`,
      });

      marker.bindTooltip(
        `<div style="font-family:Inter,sans-serif;font-size:12px;font-weight:600;color:#102A43;padding:2px 4px;">
          ${loc.name}<br/>
          <span style="font-weight:400;color:#64748b;font-size:11px;">${loc.state}</span>
        </div>`,
        { direction: 'top', offset: [0, -10] }
      );

      marker.on('click', () => onSelectLocation(loc.id));
      marker.addTo(map);
      markersRef.current.set(loc.id, marker);
    });
  }, [locations, onSelectLocation]);

  // Highlight selected marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;

    const loc = locations.find((l) => l.id === selectedId);
    if (!loc) return;

    const marker = markersRef.current.get(selectedId);
    if (marker) {
      map.setView([loc.latitude, loc.longitude], Math.max(map.getZoom(), 9), { animate: true });
    }
  }, [selectedId, locations]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-xl overflow-hidden"
      role="application"
      aria-label="Interactive Northeast India monitoring station map"
      style={{ minHeight: '400px' }}
    />
  );
});

StationMap.displayName = 'StationMap';
