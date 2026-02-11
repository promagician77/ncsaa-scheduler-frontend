/**
 * Utility functions for sorting and filtering
 */

import type { Game } from '@/app/types';

/**
 * Extract base facility name (before " - Court")
 */
export function getFacilityBase(facility: string): string {
  const match = facility.match(/^(.+?)\s*-\s*Court/i);
  return match ? match[1] : facility;
}

/**
 * Sort games by facility, court, then time
 */
export function sortGames(games: Game[]): Game[] {
  return [...games].sort((a, b) => {
    // First sort by base facility name
    const facilityA = getFacilityBase(a.facility);
    const facilityB = getFacilityBase(b.facility);
    const facilityCompare = facilityA.localeCompare(facilityB);
    if (facilityCompare !== 0) return facilityCompare;

    // Then by court number
    const courtCompare = a.court - b.court;
    if (courtCompare !== 0) return courtCompare;

    // Finally by time
    return a.time.localeCompare(b.time);
  });
}

/**
 * Group games by date
 */
export function groupGamesByDate(games: Game[]): Record<string, Game[]> {
  const grouped: Record<string, Game[]> = {};
  
  games.forEach((game) => {
    if (!grouped[game.date]) {
      grouped[game.date] = [];
    }
    grouped[game.date].push(game);
  });

  // Sort games within each date
  Object.keys(grouped).forEach((date) => {
    grouped[date] = sortGames(grouped[date]);
  });

  return grouped;
}
