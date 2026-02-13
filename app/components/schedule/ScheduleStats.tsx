"use client";

import { Card, CardTitle } from '@/app/components/ui';
import { getStatColor } from '@/app/lib/utils';
import type { ScheduleData } from '@/app/types';

interface ScheduleStatsProps {
  schedule: ScheduleData;
}

export default function ScheduleStats({ schedule }: ScheduleStatsProps) {
  const gamesByDivision = schedule.games.reduce(
    (acc: { [key: string]: number }, game) => {
      acc[game.division] = (acc[game.division] || 0) + 1;
      return acc;
    },
    {}
  );

  const stats = [
    {
      label: 'Total Games',
      value: schedule.total_games,
      color: 'blue',
      icon: '🏀',
    },
    {
      label: 'Generation Time',
      value: `${schedule.generation_time.toFixed(1)}s`,
      color: 'purple',
      icon: '⚡',
    },
  ];

  return (
    <Card className="animate-slide-in-bottom">
      <CardTitle className="mb-6">Schedule Summary</CardTitle>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${getStatColor(stat.color)} rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium opacity-80">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Games by Division */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Games by Division
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(gamesByDivision)
            .sort()
            .map(([division, count]) => (
              <div
                key={division}
                className="bg-white/50 dark:bg-gray-700/40 rounded-xl p-4 text-center border border-white/40 dark:border-gray-600/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  {division}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {count as number}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Validation Status */}
      {!schedule.validation.is_valid && (
        <div className="mt-6 p-4 bg-amber-50/70 dark:bg-amber-900/15 border border-amber-200/60 dark:border-amber-800/40 rounded-xl backdrop-blur-sm">
          <p className="text-amber-800 dark:text-amber-200 font-medium flex items-center">
            <span className="mr-2">⚠️</span>
            Schedule has constraint violations
          </p>
          <p className="text-sm text-amber-700/80 dark:text-amber-300/80 mt-1 ml-6 font-light">
            Total Penalty Score: {schedule.validation.total_penalty.toFixed(2)}
          </p>
        </div>
      )}
    </Card>
  );
}
