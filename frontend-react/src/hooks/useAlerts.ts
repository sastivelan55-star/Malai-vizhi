// src/hooks/useAlerts.ts
import { useState, useEffect, useCallback } from 'react';
import { getAlerts, updateAlertStatus } from '../services/api';
import type { AlertItem, AlertStatus } from '../types';
import { POLL_INTERVAL_MS } from '../data/constants';

export function useAlerts() {
  const [data, setData] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const result = await getAlerts();
      setData(result);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetch]);

  const acknowledge = useCallback(async (id: number, status: AlertStatus) => {
    await updateAlertStatus(id, status);
    await fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch, acknowledge };
}
