// api.ts
export const API_ROUTES = {
  BASE: '/api',
  SEASONS: '/seasons',
  RACE_WINNERS: (season: string) => `/seasons/${season}/races`,
} as const;
