// src/hooks/useAlerts.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { getAlerts, updateAlertStatus } from '../services/api';
import { notifyAlert } from '../services/notificationService';
import type { AlertItem, AlertStatus } from '../types';
import { POLL_INTERVAL_MS } from '../data/constants';

export function useAlerts() {
  const [data, setData] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const knownIdsRef = useRef<Set<number>>(new Set());
  const initialFetchDone = useRef<boolean>(false);

  const fetch = useCallback(async () => {
    try {
      const result = await getAlerts();
      setData(result);
      setError(null);

      // Trigger notifications for new active alerts detected after initial load
      if (initialFetchDone.current) {
        for (const alert of result) {
          if (!knownIdsRef.current.has(alert.id) && alert.status === 'Sent') {
            notifyAlert({
              id: alert.id,
              title: `${alert.severity} Risk: ${alert.location_name}`,
              message: alert.message,
              severity: alert.severity,
            });
          }
        }
      }

      // Update known IDs
      result.forEach((a) => knownIdsRef.current.add(a.id));
      initialFetchDone.current = true;
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
