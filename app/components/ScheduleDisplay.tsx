"use client"

import { useState, useMemo } from "react"
import GameCard from "./GameCard"
import ScheduleStats from "./ScheduleStats"

interface Game {
  id: string
  home_team: string
  away_team: string
  date: string
  day: string // Day of week from backend
  time: string
  facility: string
  court: number
  division: string
}

interface ScheduleData {
  success: boolean
  message: string
  total_games: number
  games: Game[]
  validation: {
    is_valid: boolean
    hard_violations: number
    soft_violations: number
    total_penalty: number
  }
  generation_time: number
}

interface ScheduleDisplayProps {
  schedule: ScheduleData
}

export default function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
  const [selectedDivision, setSelectedDivision] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Get unique divisions and dates
  const divisions = useMemo(() => {
    const divs = new Set(schedule.games.map((game) => game.division))
    return ["all", ...Array.from(divs).sort()]
  }, [schedule.games])

  const dates = useMemo(() => {
    const uniqueDates = new Set(schedule.games.map((game) => game.date))
    return ["all", ...Array.from(uniqueDates).sort()]
  }, [schedule.games])

  // Filter games
  const filteredGames = useMemo(() => {
    return schedule.games.filter((game) => {
      const matchesDivision =
        selectedDivision === "all" || game.division === selectedDivision
      const matchesDate = selectedDate === "all" || game.date === selectedDate
      const matchesSearch =
        searchQuery === "" ||
        game.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.facility.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesDivision && matchesDate && matchesSearch
    })
  }, [schedule.games, selectedDivision, selectedDate, searchQuery])

  // Group games by date
  const gamesByDate = useMemo(() => {
    const grouped: { [key: string]: Game[] } = {}
    filteredGames.forEach((game) => {
      if (!grouped[game.date]) {
        grouped[game.date] = []
      }
      grouped[game.date].push(game)
    })

    // Sort games within each date by COURT first, then TIME
    // This helps see all games for each court together
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => {
        // Extract base facility name (before " - Court")
        const getFacilityBase = (facility: string) => {
          const match = facility.match(/^(.+?)\s*-\s*Court/i)
          return match ? match[1] : facility
        }

        // First sort by base facility name
        const facilityA = getFacilityBase(a.facility)
        const facilityB = getFacilityBase(b.facility)
        const facilityCompare = facilityA.localeCompare(facilityB)
        if (facilityCompare !== 0) return facilityCompare

        // Then by court number (use the court field, not extracted from string)
        const courtCompare = a.court - b.court
        if (courtCompare !== 0) return courtCompare

        // Finally by time
        return a.time.localeCompare(b.time)
      })
    })

    return grouped
  }, [filteredGames])

  // Get division color for badges
  const getDivisionColor = (division: string) => {
    const colors: { [key: string]: string } = {
      "ES K-1 REC":
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "ES 2-3 REC":
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "ES BOY'S COMP":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "ES GIRL'S COMP":
        "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      "BOY'S JV":
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      "GIRL'S JV":
        "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    }
    return (
      colors[division] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <ScheduleStats schedule={schedule} />

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Filter Schedule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Division Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Division
            </label>
            <select
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div === "all" ? "All Divisions" : div}
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {dates.map((date) => {
                if (date === "all") {
                  return (
                    <option key={date} value={date}>
                      All Dates
                    </option>
                  )
                }
                // Parse date string without timezone conversion
                const [year, month, day] = date.split("-").map(Number)
                const dateObj = new Date(year, month - 1, day)
                const dayName =
                  schedule.games.find((g) => g.date === date)?.day ||
                  dateObj.toLocaleDateString("en-US", { weekday: "short" })
                return (
                  <option key={date} value={date}>
                    {dayName},{" "}
                    {dateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </option>
                )
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
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredGames.length} of {schedule.total_games} games
        </div>
      </div>

      {/* Games Section - Table Layout */}
      <div className="space-y-6">
        {Object.keys(gamesByDate)
          .sort()
          .map((date) => (
            <div
              key={date}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {(() => {
                    // Get day name from first game to avoid timezone issues
                    const firstGame = gamesByDate[date][0]
                    const dayName = firstGame?.day || ""
                    // Parse date string without timezone conversion (YYYY-MM-DD)
                    const [year, month, day] = date.split("-").map(Number)
                    const dateObj = new Date(year, month - 1, day)
                    const dateStr = dateObj.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    return `${dayName}, ${dateStr}`
                  })()}
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({gamesByDate[date].length} games)
                  </span>
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Facility
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Division
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Home Team
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        VS
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Away Team
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {gamesByDate[date].map((game, idx) => {
                      // Check if this is the first game for a new facility/court
                      const prevGame =
                        idx > 0 ? gamesByDate[date][idx - 1] : null
                      const isNewCourt =
                        !prevGame || prevGame.facility !== game.facility

                      return (
                        <tr
                          key={game.id}
                          className={`${
                            idx % 2 === 0
                              ? "bg-white dark:bg-gray-800"
                              : "bg-gray-50 dark:bg-gray-900"
                          } ${isNewCourt ? "border-t-2 border-blue-500" : ""}`}
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {game.facility}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {game.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDivisionColor(
                                game.division
                              )}`}
                            >
                              {game.division}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {game.home_team}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center text-xs font-semibold text-gray-400 dark:text-gray-500">
                            VS
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {game.away_team}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

        {filteredGames.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No games found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
