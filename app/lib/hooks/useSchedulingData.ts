/**
 * Custom hook for fetching scheduling data with caching
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { API_CONFIG } from '../constants';
import type { SchedulingData } from '@/app/types';

// Cache data outside component to persist across re-renders
let cachedData: SchedulingData | null = null;
let cacheTimestamp: number | null = null;

interface UseSchedulingDataReturn {
  data: SchedulingData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: number | null;
}

export function useSchedulingData(): UseSchedulingDataReturn {
  const [data, setData] = useState<SchedulingData | null>(cachedData);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DATA}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Store in cache
      cachedData = result;
      cacheTimestamp = Date.now();
      
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    // Clear cache
    cachedData = null;
    cacheTimestamp = null;
    hasFetchedRef.current = false;
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    const now = Date.now();
    const isCacheValid =
      cachedData && cacheTimestamp && now - cacheTimestamp < API_CONFIG.CACHE_DURATION;

    if (!isCacheValid && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    } else if (isCacheValid) {
      setData(cachedData);
      setIsLoading(false);
    }
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    lastUpdated: cacheTimestamp,
  };
}
