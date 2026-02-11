/**
 * Data-related type definitions for teams, facilities, schools, etc.
 */

export interface Team {
  id: string;
  school: string;
  school_name?: string;
  division: string;
  coach_name: string;
  coach_email: string;
  home_facility: string | null;
  tier: string | null;
  cluster: string | null;
  rivals?: string[];
  do_not_play?: string[];
}

export interface Facility {
  name: string;
  address: string;
  max_courts: number;
  has_8ft_rims: boolean;
  notes: string;
  available_dates_count: number;
  unavailable_dates_count: number;
  available_dates: string[];
  unavailable_dates: string[];
}

export interface School {
  name: string;
  cluster: string | null;
  tier: string | null;
  teams: Array<{
    id: string;
    division: string;
    coach_name?: string;
    coach_email?: string;
    coach?: string;
  }>;
}

export interface Division {
  name: string;
  team_count: number;
  estimated_games: number;
}

export interface Cluster {
  name: string;
  school_count: number;
  team_count: number;
}

export interface Tier {
  name: string;
  school_count: number;
  team_count: number;
}

export interface SchedulingRules {
  season_start: string;
  season_end: string;
  game_duration_minutes: number;
  weeknight_time: string;
  saturday_time: string;
  no_games_on_sunday: boolean;
  games_per_team: number;
  max_games_per_7_days: number;
  max_games_per_14_days: number;
  max_doubleheaders_per_season: number;
  weeknight_slots_required: number;
  holidays: string[];
}

export interface DataSummary {
  total_teams: number;
  total_schools: number;
  total_facilities: number;
  total_divisions: number;
  total_estimated_games: number;
}

export interface SchedulingData {
  success: boolean;
  rules: SchedulingRules;
  teams: Team[];
  facilities: Facility[];
  schools: School[];
  divisions: Division[];
  clusters: Cluster[];
  tiers: Tier[];
  summary: DataSummary;
}
