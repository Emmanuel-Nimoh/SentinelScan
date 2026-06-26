import { useState, useEffect, useCallback } from 'react';
import { getScanResults, getApiErrorMessage } from '../services/api';

// Fetches and stores a single scan's data, exposing a manual refetch for polling.
export function useScan(scanId) {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScan = useCallback(async () => {
    if (!scanId) return;
    try {
      setError(null);
      const response = await getScanResults(scanId);
      setScan(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [scanId]);

  useEffect(() => {
    setLoading(true);
    fetchScan();
  }, [fetchScan]);

  return { scan, loading, error, fetchScan };
}
