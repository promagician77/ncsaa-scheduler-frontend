/**
 * Utility functions for styling and CSS class management
 */

import { DIVISION_COLORS, DEFAULT_DIVISION_COLOR } from '../constants';

/**
 * Get division color classes
 */
export function getDivisionColor(division: string): string {
  return DIVISION_COLORS[division as keyof typeof DIVISION_COLORS]?.full || DEFAULT_DIVISION_COLOR.full;
}

/**
 * Merge class names conditionally
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get stat color classes
 */
export function getStatColor(color: string): string {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/40 dark:border-blue-700/30',
    green: 'bg-emerald-50/70 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/40 dark:border-emerald-700/30',
    purple: 'bg-purple-50/70 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200/40 dark:border-purple-700/30',
    orange: 'bg-amber-50/70 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200/40 dark:border-amber-700/30',
    red: 'bg-rose-50/70 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-200/40 dark:border-rose-700/30',
    yellow: 'bg-yellow-50/70 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200/40 dark:border-yellow-700/30',
  };
  return colors[color] || colors.blue;
}
