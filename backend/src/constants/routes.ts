const BASE_API = '/api';

export const ROUTES = {
  SEASONS: `${BASE_API}/seasons`,
  RACES: `${BASE_API}/races`,
  SEASON_RACES: (seasonId: string) => `${BASE_API}/raceWinners/${seasonId}/races`, // Dynamic route
};