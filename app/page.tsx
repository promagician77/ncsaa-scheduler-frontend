'use client';

import { useState } from 'react';
import { Tabs } from '@/app/components/ui';
import ScheduleGenerator from './components/schedule/ScheduleGenerator';
import ScheduleDisplay from './components/schedule/ScheduleDisplay';
import DataDisplay from './components/data/DataDisplay';
import type { ScheduleData } from './types';

export default function Home() {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [activeView, setActiveView] = useState<'schedule' | 'info'>('schedule');

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'info', label: 'Information', icon: 'ℹ️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-10 text-center animate-slide-in-top">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-5xl">🏀</div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                NCSAA Basketball Scheduler
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Generate and view optimized basketball game schedules with intelligent constraint solving
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8 flex justify-center animate-slide-in-bottom">
          <Tabs tabs={tabs} activeTab={activeView} onChange={(id) => setActiveView(id as 'schedule' | 'info')} />
        </div>

        {/* Content */}
        {activeView === 'schedule' && (
          <div className="space-y-6">
            <ScheduleGenerator onScheduleGenerated={setSchedule} />
            {schedule && <ScheduleDisplay schedule={schedule} />}
          </div>
        )}
        
        {activeView === 'info' && <DataDisplay />}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>NCSAA Basketball Scheduling System &copy; 2025</p>
      </footer>
    </div>
  );
}
