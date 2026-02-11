/**
 * Schedule-related type definitions
 */

export interface Game {
  id: string;
  home_team: string;
  away_team: string;
  date: string;
  day: string;
  time: string;
  facility: string;
  court: number;
  division: string;
}

export interface ScheduleValidation {
  is_valid: boolean;
  hard_violations: number;
  soft_violations: number;
  total_penalty: number;
}

export interface ScheduleData {
  success: boolean;
  message: string;
  total_games: number;
  games: Game[];
  validation: ScheduleValidation;
  generation_time: number;
}

export interface TaskStatus {
  status: 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE';
  message?: string;
  result?: ScheduleData;
}
