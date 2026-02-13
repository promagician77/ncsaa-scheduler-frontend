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
    <div className="min-h-screen bg-image-overlay">
      <div className="container mx-auto px-4 py-10 max-w-7xl relative z-10">
        {/* Header */}
        <header className="mb-12 text-center animate-slide-in-top">
          <div className="inline-block mb-5">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-5xl animate-gentle-float">🏀</div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-rose-500 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent tracking-tight">
                NCSAA Basketball Scheduler
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-600/90 dark:text-gray-300/90 max-w-2xl mx-auto font-light leading-relaxed">
            Generate and view optimized basketball game schedules with intelligent constraint solving
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-10 flex justify-center animate-slide-in-bottom">
          <Tabs tabs={tabs} activeTab={activeView} onChange={(id) => setActiveView(id as 'schedule' | 'info')} />
        </div>

        {/* Content */}
        {activeView === 'schedule' && (
          <div className="space-y-8">
            <ScheduleGenerator onScheduleGenerated={setSchedule} />
            {schedule && <ScheduleDisplay schedule={schedule} />}
          </div>
        )}
        
        {activeView === 'info' && <DataDisplay />}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 text-center text-sm text-gray-500/80 dark:text-gray-400/80">
        <div className="glass-subtle max-w-md mx-auto rounded-full py-3 px-6">
          <p className="font-light">NCSAA Basketball Scheduling System &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
}
