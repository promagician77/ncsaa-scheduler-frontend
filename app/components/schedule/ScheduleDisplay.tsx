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
    <div className="space-y-8 animate-in">
      {/* Stats Section */}
      <ScheduleStats schedule={schedule} />

      {/* Filters Section */}
      <Card>
        <CardTitle className="mb-4">Filter Schedule</CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Division
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-4 py-2.5 border border-white/40 dark:border-gray-600/40 rounded-xl bg-white/60 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all backdrop-blur-sm"
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
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-white/40 dark:border-gray-600/40 rounded-xl bg-white/60 dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all backdrop-blur-sm"
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
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Team or facility..."
              className="w-full px-4 py-2.5 border border-white/40 dark:border-gray-600/40 rounded-xl bg-white/60 dark:bg-gray-700/50 text-gray-800 dark:text-white placeholder-gray-400/70 focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-light">
          Showing <span className="font-medium">{filteredGames.length}</span> of{' '}
          <span className="font-medium">{schedule.total_games}</span> games
        </div>
      </Card>

      {/* Games Section - Table Layout */}
      <div className="space-y-6">
        {Object.keys(gamesByDate)
          .sort()
          .map((date) => (
            <Card key={date} padding="none" className="overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-amber-50/60 to-orange-50/60 dark:from-amber-900/10 dark:to-orange-900/10 border-b border-white/30 dark:border-gray-700/40">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
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
                <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/40">
                  <thead className="bg-white/30 dark:bg-gray-800/30">
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
                  <tbody className="bg-white/20 dark:bg-gray-800/20 divide-y divide-gray-200/30 dark:divide-gray-700/30">
                    {gamesByDate[date].map((game, idx) => {
                      const prevGame = idx > 0 ? gamesByDate[date][idx - 1] : null;
                      const isNewCourt = !prevGame || prevGame.facility !== game.facility;

                      return (
                        <tr
                          key={game.id}
                          className={`transition-colors duration-200 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 ${
                            isNewCourt ? 'border-t-2 border-amber-400/40' : ''
                          }`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-100">
                            {game.facility}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {game.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getDivisionColor(game.division)} size="sm">
                              {game.division}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-100 font-medium">
                            {game.home_team}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-medium text-gray-400/70 dark:text-gray-500/70">
                            VS
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-100 font-medium">
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
            <p className="text-gray-500/80 dark:text-gray-400/80 text-lg font-light">
              No games found matching your filters
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
