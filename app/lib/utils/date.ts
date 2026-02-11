/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Parse a date string (YYYY-MM-DD) without timezone conversion
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format a date to short format (e.g., "Jan 15")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get day name from date
 */
export function getDayName(date: Date, format: 'short' | 'long' = 'short'): string {
  return date.toLocaleDateString('en-US', {
    weekday: format,
  });
}

/**
 * Format time string to 12-hour format
 */
export function formatTime(time: string): string {
  // If already formatted, return as is
  if (time.includes('AM') || time.includes('PM')) {
    return time;
  }
  
  // Parse 24-hour format (HH:MM)
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
