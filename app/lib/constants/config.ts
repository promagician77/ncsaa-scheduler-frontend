/**
 * Application configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
  ENDPOINTS: {
    SCHEDULE_ASYNC: '/api/schedule/async',
    SCHEDULE_STATUS: '/api/schedule/status',
    DATA: '/api/data',
    INFO: '/api/info',
  },
  POLLING_INTERVAL: 2000, // milliseconds
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const;

export const UI_CONFIG = {
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 200,
      SLOW: 300,
    },
  },
} as const;
