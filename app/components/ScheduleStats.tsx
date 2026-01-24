'use client';

interface ScheduleStatsProps {
  schedule: {
    success: boolean;
    message: string;
    total_games: number;
    games: any[];
    validation: {
      is_valid: boolean;
      hard_violations: number;
      soft_violations: number;
      total_penalty: number;
    };
    generation_time: number;
  };
}

export default function ScheduleStats({ schedule }: ScheduleStatsProps) {
  // Calculate games by division
  const gamesByDivision = schedule.games.reduce((acc: { [key: string]: number }, game) => {
    acc[game.division] = (acc[game.division] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Schedule Summary
      </h2>

      {/* Success Message */}
      <div className={`mb-4 p-4 rounded-lg ${
        schedule.success 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
          : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
      }`}>
        <p className={`font-medium ${
          schedule.success 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
        }`}>
          {schedule.message}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total Games</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{schedule.total_games}</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Generation Time</p>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {schedule.generation_time.toFixed(1)}s
          </p>
        </div>

        <div className={`rounded-lg p-4 ${
          schedule.validation.hard_violations === 0 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <p className={`text-sm font-medium mb-1 ${
            schedule.validation.hard_violations === 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            Hard Violations
          </p>
          <p className={`text-3xl font-bold ${
            schedule.validation.hard_violations === 0 
              ? 'text-green-900 dark:text-green-100' 
              : 'text-red-900 dark:text-red-100'
          }`}>
            {schedule.validation.hard_violations}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">Soft Violations</p>
          <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
            {schedule.validation.soft_violations}
          </p>
        </div>
      </div>

      {/* Games by Division */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Games by Division
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(gamesByDivision).sort().map(([division, count]) => (
            <div 
              key={division}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{division}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{count as number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Status */}
      {!schedule.validation.is_valid && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium">
            ⚠️ Schedule has constraint violations
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Total Penalty Score: {schedule.validation.total_penalty.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
