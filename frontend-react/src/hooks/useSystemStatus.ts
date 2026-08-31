// src/hooks/useSystemStatus.ts
import { useState, useEffect, useCallback } from 'react';
import { getSystemStatus } from '../services/api';
import type { SystemStatus } from '../types';
import { POLL_INTERVAL_MS } from '../data/constants';

export function useSystemStatus() {
  const [data, setData] = useState<SystemStatus | null>(null);
  const [online, setOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    try {
      const result = await getSystemStatus();
      setData(result);
      setOnline(true);
      setError(null);
    } catch (e) {
      setOnline(false);
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

  return { data, online, loading, error, refetch: fetch };
}
