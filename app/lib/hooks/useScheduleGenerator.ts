/**
 * Custom hook for schedule generation
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { API_CONFIG } from '../constants';
import type { ScheduleData, TaskStatus } from '@/app/types';

interface UseScheduleGeneratorReturn {
  schedule: ScheduleData | null;
  isLoading: boolean;
  error: string | null;
  progress: string;
  generateSchedule: () => Promise<void>;
  clearError: () => void;
}

export function useScheduleGenerator(): UseScheduleGeneratorReturn {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const pollTaskStatus = useCallback(async (taskId: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE_STATUS}/${taskId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TaskStatus = await response.json();

      if (data.status === 'PENDING') {
        setProgress('Task is waiting to start...');
      } else if (data.status === 'PROGRESS') {
        setProgress(data.message || 'Processing...');
      } else if (data.status === 'SUCCESS') {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
        setProgress('Schedule generated successfully!');
        if (data.result) {
          setSchedule(data.result);
        }
        setIsLoading(false);
      } else if (data.status === 'FAILURE') {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
        throw new Error(data.message || 'Task failed');
      }
    } catch (err) {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      setError(err instanceof Error ? err.message : 'Failed to check task status');
      setIsLoading(false);
    }
  }, []);

  const generateSchedule = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setProgress('Starting schedule generation...');

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SCHEDULE_ASYNC}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            force_regenerate: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProgress('Task started, waiting for results...');

      pollingInterval.current = setInterval(() => {
        pollTaskStatus(data.task_id);
      }, API_CONFIG.POLLING_INTERVAL);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate schedule');
      console.error('Error generating schedule:', err);
      setIsLoading(false);
    }
  }, [pollTaskStatus]);

  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  return {
    schedule,
    isLoading,
    error,
    progress,
    generateSchedule,
    clearError,
  };
}
