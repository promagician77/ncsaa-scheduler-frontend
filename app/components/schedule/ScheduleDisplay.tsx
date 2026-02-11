"use client";

import { useMemo } from 'react';
import { Card, CardTitle, Badge } from '@/app/components/ui';
import { useScheduleFilters } from '@/app/lib/hooks';
import { groupGamesByDate, parseLocalDate, formatDate, getDivisionColor } from '@/app/lib/utils';
import ScheduleStats from './ScheduleStats';
import type { ScheduleData } from '@/app/types';

interface ScheduleDisplayProps {
  schedule: ScheduleData;
}

export default function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
  const {
    selectedDivision,
    selectedDate,
    searchQuery,
    setSelectedDivision,
    setSelectedDate,
    setSearchQuery,
    filteredGames,
    divisions,
    dates,
  } = useScheduleFilters(schedule.games);

  const gamesByDate = useMemo(() => groupGamesByDate(filteredGames), [filteredGames]);

  return (
    <div className="space-y-6 animate-in">
      {/* Stats Section */}
      <ScheduleStats schedule={schedule} />

      {/* Filters Section */}
      <Card>
        <CardTitle className="mb-4">Filter Schedule</CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Division
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div === 'all' ? 'All Divisions' : div}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {dates.map((date) => {
                if (date === 'all') {
                  return (
                    <option key={date} value={date}>
                      All Dates
                    </option>
                  );
                }
                const dateObj = parseLocalDate(date);
                const dayName = schedule.games.find((g) => g.date === date)?.day || '';
                return (
                  <option key={date} value={date}>
                    {dayName}, {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Team or facility..."
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredGames.length}</span> of{' '}
          <span className="font-semibold">{schedule.total_games}</span> games
        </div>
      </Card>

      {/* Games Section - Table Layout */}
      <div className="space-y-6">
        {Object.keys(gamesByDate)
          .sort()
          .map((date) => (
            <Card key={date} padding="none" className="overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {(() => {
                    const firstGame = gamesByDate[date][0];
                    const dayName = firstGame?.day || '';
                    const dateObj = parseLocalDate(date);
                    const dateStr = formatDate(dateObj);
                    return `${dayName}, ${dateStr}`;
                  })()}
                  <Badge variant="primary" size="sm" className="ml-3">
                    {gamesByDate[date].length} games
                  </Badge>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Facility
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Division
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Home Team
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        VS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Away Team
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {gamesByDate[date].map((game, idx) => {
                      const prevGame = idx > 0 ? gamesByDate[date][idx - 1] : null;
                      const isNewCourt = !prevGame || prevGame.facility !== game.facility;

                      return (
                        <tr
                          key={game.id}
                          className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            isNewCourt ? 'border-t-2 border-blue-500' : ''
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {game.facility}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                            {game.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getDivisionColor(game.division)} size="sm">
                              {game.division}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                            {game.home_team}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                            VS
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                            {game.away_team}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}

        {filteredGames.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No games found matching your filters
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
