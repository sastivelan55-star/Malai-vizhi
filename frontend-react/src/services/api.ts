// src/services/api.ts — Centralized API service layer for MALAI VIZHI

import type {
  LocationData,
  AlertItem,
  SystemStatus,
  CitizenReport,
  SimulationResponse,
  AnalyticsData,
} from '../types';

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) || '';

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Risk Data ────────────────────────────────────────────────────────────────

export async function getRiskData(): Promise<LocationData[]> {
  return request<LocationData[]>('/api/risk-data');
}

export async function getLocation(id: number): Promise<LocationData> {
  return request<LocationData>(`/api/risk-data/${id}`);
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export async function getAlerts(): Promise<AlertItem[]> {
  return request<AlertItem[]>('/api/alerts');
}

export async function updateAlertStatus(
  id: number,
  status: 'Sent' | 'Acknowledged' | 'Resolved'
): Promise<{ success: boolean; alert: AlertItem }> {
  return request(`/api/alerts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// ─── Simulation ───────────────────────────────────────────────────────────────

export async function simulateRain(locationId: number): Promise<SimulationResponse> {
  return request<SimulationResponse>('/api/simulate-rain', {
    method: 'POST',
    body: JSON.stringify({ location_id: locationId }),
  });
}

// ─── Citizen Reports ──────────────────────────────────────────────────────────

export async function submitReport(formData: FormData): Promise<{
  success: boolean;
  report_id: number;
  submitted_at: string;
  message: string;
}> {
  const res = await fetch(`${BASE}/api/submit-report`, {
    method: 'POST',
    body: formData, // multipart/form-data — no Content-Type header; browser sets boundary
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getReports(): Promise<CitizenReport[]> {
  return request<CitizenReport[]>('/api/reports');
}

// ─── System Status ────────────────────────────────────────────────────────────

export async function getSystemStatus(): Promise<SystemStatus> {
  return request<SystemStatus>('/api/system-status');
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<AnalyticsData> {
  return request<AnalyticsData>('/api/analytics');
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function getHealth(): Promise<{ status: string; version: string }> {
  return request<{ status: string; version: string }>('/api/health');
}
