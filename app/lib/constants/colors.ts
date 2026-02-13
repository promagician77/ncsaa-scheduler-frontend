/**
 * Division colors and styling constants - soft gentle palette
 */

export const DIVISION_COLORS = {
  "ES K-1 REC": {
    bg: "bg-emerald-50/70 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/50 dark:border-emerald-700/30",
    full: "bg-emerald-50/70 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  },
  "ES 2-3 REC": {
    bg: "bg-blue-50/70 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200/50 dark:border-blue-700/30",
    full: "bg-blue-50/70 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  },
  "ES BOY'S COMP": {
    bg: "bg-purple-50/70 dark:bg-purple-900/20",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200/50 dark:border-purple-700/30",
    full: "bg-purple-50/70 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
  },
  "ES GIRL'S COMP": {
    bg: "bg-pink-50/70 dark:bg-pink-900/20",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-200/50 dark:border-pink-700/30",
    full: "bg-pink-50/70 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
  },
  "BOY'S JV": {
    bg: "bg-indigo-50/70 dark:bg-indigo-900/20",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200/50 dark:border-indigo-700/30",
    full: "bg-indigo-50/70 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
  "GIRL'S JV": {
    bg: "bg-rose-50/70 dark:bg-rose-900/20",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200/50 dark:border-rose-700/30",
    full: "bg-rose-50/70 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
  },
} as const;

export const DEFAULT_DIVISION_COLOR = {
  bg: "bg-gray-50/70 dark:bg-gray-800/30",
  text: "text-gray-700 dark:text-gray-300",
  border: "border-gray-200/50 dark:border-gray-700/30",
  full: "bg-gray-50/70 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300",
} as const;

/**
 * Stat card color schemes - soft palette
 */
export const STAT_COLORS = {
  blue: "bg-blue-50/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  green: "bg-emerald-50/70 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
  purple: "bg-purple-50/70 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  orange: "bg-amber-50/70 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  red: "bg-rose-50/70 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
  yellow: "bg-yellow-50/70 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
  indigo: "bg-indigo-50/70 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
} as const;
