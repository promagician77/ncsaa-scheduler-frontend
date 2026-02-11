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
    {
      label: 'Hard Violations',
      value: schedule.validation.hard_violations,
      color: schedule.validation.hard_violations === 0 ? 'green' : 'red',
      icon: schedule.validation.hard_violations === 0 ? '✓' : '✕',
    },
    {
      label: 'Soft Violations',
      value: schedule.validation.soft_violations,
      color: 'yellow',
      icon: '⚠',
    },
  ];

  return (
    <Card className="animate-slide-in-bottom">
      <CardTitle className="mb-6">Schedule Summary</CardTitle>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${getStatColor(stat.color)} rounded-xl p-5 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Games by Division */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Games by Division
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(gamesByDivision)
            .sort()
            .map(([division, count]) => (
              <div
                key={division}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 text-center border border-gray-200 dark:border-gray-600 transition-transform hover:scale-105"
              >
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                  {division}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {count as number}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Validation Status */}
      {!schedule.validation.is_valid && (
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium flex items-center">
            <span className="mr-2">⚠️</span>
            Schedule has constraint violations
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 ml-6">
            Total Penalty Score: {schedule.validation.total_penalty.toFixed(2)}
          </p>
        </div>
      )}
    </Card>
  );
}
