// src/data/constants.ts — Static constants and location definitions

export const BRAND = {
  name: 'MALAI VIZHI',
  subtitle: 'AI-Based Landslide Early Warning System',
  tagline: 'WATCHING OVER EVERY MOUNTAIN',
  version: '2.4.0',
} as const;

export const COLORS = {
  navy: { 900: '#071A2B', 800: '#0B2D42', 700: '#0B3948' },
  teal: { 700: '#0F766E', 500: '#14B8A6', 400: '#2DD4BF' },
  risk: {
    LOW: '#16A34A',
    MODERATE: '#F59E0B',
    HIGH: '#DC2626',
  },
} as const;

// 12 NER monitoring locations (used as fallback / map seed)
export const LOCATIONS_SEED = [
  { name: 'Cherrapunji',  state: 'Meghalaya',         latitude: 25.2800, longitude: 91.7200 },
  { name: 'Shillong',     state: 'Meghalaya',         latitude: 25.5788, longitude: 91.8933 },
  { name: 'Guwahati',     state: 'Assam',             latitude: 26.1445, longitude: 91.7362 },
  { name: 'Dima Hasao',   state: 'Assam',             latitude: 25.5694, longitude: 93.0069 },
  { name: 'Lunglei',      state: 'Mizoram',           latitude: 22.8873, longitude: 92.7360 },
  { name: 'Aizawl',       state: 'Mizoram',           latitude: 23.7272, longitude: 92.7176 },
  { name: 'Dimapur',      state: 'Nagaland',          latitude: 25.9040, longitude: 93.7265 },
  { name: 'Kohima',       state: 'Nagaland',          latitude: 25.6701, longitude: 94.1077 },
  { name: 'Imphal',       state: 'Manipur',           latitude: 24.8170, longitude: 93.9368 },
  { name: 'Tawang',       state: 'Arunachal Pradesh', latitude: 27.5860, longitude: 91.8620 },
  { name: 'Itanagar',     state: 'Arunachal Pradesh', latitude: 27.0844, longitude: 93.6053 },
  { name: 'Gangtok',      state: 'Sikkim',            latitude: 27.3389, longitude: 88.6065 },
] as const;

export const MAP_CENTER: [number, number] = [25.5, 92.5];
export const MAP_ZOOM = 7;

export const RISK_LABELS = {
  LOW: 'Low Risk',
  MODERATE: 'Moderate Risk',
  HIGH: 'High Risk',
} as const;

export const ALERT_STATUSES = ['Sent', 'Acknowledged', 'Resolved'] as const;
export const SEVERITY_LEVELS = ['HIGH', 'MODERATE', 'LOW'] as const;

export const API_BASE = '';
export const POLL_INTERVAL_MS = 30000;
