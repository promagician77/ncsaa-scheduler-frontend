"use client";

import { useEffect } from 'react';
import { Button, Card, CardTitle, CardDescription, Alert } from '@/app/components/ui';
import { useScheduleGenerator } from '@/app/lib/hooks';
import type { ScheduleData } from '@/app/types';

interface ScheduleGeneratorProps {
  onScheduleGenerated: (schedule: ScheduleData) => void;
}

export default function ScheduleGenerator({ onScheduleGenerated }: ScheduleGeneratorProps) {
  const { schedule, isLoading, error, progress, generateSchedule, clearError } = useScheduleGenerator();

  // Update parent when schedule is generated (runs after render)
  useEffect(() => {
    if (schedule && !isLoading) {
      onScheduleGenerated(schedule);
    }
  }, [schedule, isLoading, onScheduleGenerated]);

  return (
    <Card className="mb-8 animate-slide-in-top">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <CardTitle>Generate Schedule</CardTitle>
          <CardDescription>
            Click the button to generate an optimized basketball schedule from Google Sheets data
          </CardDescription>
        </div>

        <Button
          onClick={generateSchedule}
          isLoading={isLoading}
          size="lg"
          className="whitespace-nowrap"
        >
          {isLoading ? 'Generating...' : 'Generate Schedule'}
        </Button>
      </div>

      {progress && isLoading && (
        <Alert variant="info" className="mt-6">
          <p className="font-medium">Progress:</p>
          <p>{progress}</p>
        </Alert>
      )}

      {error && (
        <Alert variant="error" title="Error" onClose={clearError} className="mt-6">
          {error}
        </Alert>
      )}
    </Card>
  );
}
