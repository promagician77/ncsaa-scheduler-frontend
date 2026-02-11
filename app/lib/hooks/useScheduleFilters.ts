/**
 * Custom hook for filtering schedule games
 */

import { useState, useMemo } from 'react';
import type { Game } from '@/app/types';

interface UseScheduleFiltersReturn {
  selectedDivision: string;
  selectedDate: string;
  searchQuery: string;
  setSelectedDivision: (division: string) => void;
  setSelectedDate: (date: string) => void;
  setSearchQuery: (query: string) => void;
  filteredGames: Game[];
  divisions: string[];
  dates: string[];
  resetFilters: () => void;
}

export function useScheduleFilters(games: Game[]): UseScheduleFiltersReturn {
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const divisions = useMemo(() => {
    const divs = new Set(games.map((game) => game.division));
    return ['all', ...Array.from(divs).sort()];
  }, [games]);

  const dates = useMemo(() => {
    const uniqueDates = new Set(games.map((game) => game.date));
    return ['all', ...Array.from(uniqueDates).sort()];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesDivision =
        selectedDivision === 'all' || game.division === selectedDivision;
      const matchesDate = selectedDate === 'all' || game.date === selectedDate;
      const matchesSearch =
        searchQuery === '' ||
        game.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.facility.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDivision && matchesDate && matchesSearch;
    });
  }, [games, selectedDivision, selectedDate, searchQuery]);

  const resetFilters = () => {
    setSelectedDivision('all');
    setSelectedDate('all');
    setSearchQuery('');
  };

  return {
    selectedDivision,
    selectedDate,
    searchQuery,
    setSelectedDivision,
    setSelectedDate,
    setSearchQuery,
    filteredGames,
    divisions,
    dates,
    resetFilters,
  };
}
