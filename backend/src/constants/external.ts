export const ERGAST_API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

export const ERGAST_ENDPOINTS = {
  SEASONS: `${ERGAST_API_BASE_URL}/seasons`,
  CHAMPION_BY_YEAR: (year: string) => `${ERGAST_API_BASE_URL}/${year}/driverStandings/1.json`,
  RACE_BY_SEASONID: (seasonId: string) => `${ERGAST_API_BASE_URL}/${seasonId}/races.json`,
  RACE_RESULTS_BY_SEASON: (year: string) => `${ERGAST_API_BASE_URL}/${year}/results/1.json`,
};

export const RETRY_CONFIG = {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 500,
};