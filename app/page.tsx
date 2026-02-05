'use client';

import { useState } from 'react';
import ScheduleGenerator from './components/ScheduleGenerator';
import ScheduleDisplay from './components/ScheduleDisplay';
import DataDisplay from './components/DataDisplay';

export default function Home() {
  const [schedule, setSchedule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'schedule' | 'info'>('schedule');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            NCSAA Basketball Scheduling System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Generate and view optimized basketball game schedules
          </p>
        </header>
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1 shadow-sm">
            <button
              onClick={() => setActiveView('schedule')}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${activeView === 'schedule'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              📅 Schedule
            </button>
            <button
              onClick={() => setActiveView('info')}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${activeView === 'info'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }
              `}
            >
              ℹ️ Information
            </button>
          </div>
        </div>
        {activeView === 'schedule' && (
          <>
            <ScheduleGenerator 
              onScheduleGenerated={setSchedule}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
            {schedule && !isLoading && (
              <ScheduleDisplay schedule={schedule} />
            )}
          </>
        )}
        {activeView === 'info' && (
          <DataDisplay />
        )}
      </div>
    </div>
  );
}
