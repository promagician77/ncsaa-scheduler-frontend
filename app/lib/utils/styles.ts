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
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  };
  return colors[color] || colors.blue;
}
