'use client';

interface Game {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  facility: string;
  court: number;
  division: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  // Get division color
  const getDivisionColor = (division: string) => {
    const colors: { [key: string]: string } = {
      "ES K-1 REC": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "ES 2-3 REC": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "ES BOY'S COMP": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "ES GIRL'S COMP": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      "BOY'S JV": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      "GIRL'S JV": "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    };
    return colors[division] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Division Badge */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getDivisionColor(game.division)}`}>
          {game.division}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Home:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{game.home_team}</span>
        </div>
        <div className="flex items-center justify-center text-gray-400 dark:text-gray-500">
          <span className="text-xs">VS</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">Away:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{game.away_team}</span>
        </div>
      </div>

      {/* Details */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {game.time}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {game.facility}
        </div>
        {game.court > 1 && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Court {game.court}
          </div>
        )}
      </div>
    </div>
  );
}
