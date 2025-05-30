export const ERGAST_API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const ERGAST_ENDPOINTS = {
  SEASONS: `${ERGAST_API_BASE_URL}/seasons`,
  CHAMPION_BY_YEAR: (season: string) => `${ERGAST_API_BASE_URL}/${season}/driverStandings/1.json`,
  RACE_BY_SEASONID: (season: string) => `${ERGAST_API_BASE_URL}/${season}/races.json`,
  RACE_RESULTS_BY_SEASON: (season: string) => `${ERGAST_API_BASE_URL}/${season}/results/1.json`,
};

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  DELAY_MS: 500,
};
