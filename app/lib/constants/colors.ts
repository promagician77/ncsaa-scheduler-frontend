/**
 * Division colors and styling constants
 */

export const DIVISION_COLORS = {
  "ES K-1 REC": {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    full: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  },
  "ES 2-3 REC": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-800 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
    full: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  },
  "ES BOY'S COMP": {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-800 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
    full: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  },
  "ES GIRL'S COMP": {
    bg: "bg-pink-100 dark:bg-pink-900/30",
    text: "text-pink-800 dark:text-pink-300",
    border: "border-pink-200 dark:border-pink-800",
    full: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  },
  "BOY'S JV": {
    bg: "bg-indigo-100 dark:bg-indigo-900/30",
    text: "text-indigo-800 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-800",
    full: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  "GIRL'S JV": {
    bg: "bg-rose-100 dark:bg-rose-900/30",
    text: "text-rose-800 dark:text-rose-300",
    border: "border-rose-200 dark:border-rose-800",
    full: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
  },
} as const;

export const DEFAULT_DIVISION_COLOR = {
  bg: "bg-gray-100 dark:bg-gray-900/30",
  text: "text-gray-800 dark:text-gray-300",
  border: "border-gray-200 dark:border-gray-700",
  full: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
} as const;

/**
 * Stat card color schemes
 */
export const STAT_COLORS = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
} as const;
