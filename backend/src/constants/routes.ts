const BASE_API = '/api';

export const ROUTES = {
  SEASONS: `${BASE_API}/seasons`,
  RACES: `${BASE_API}/races`,
  SEASON_RACES: (season: string) => `${BASE_API}/seasons/${season}/races`, // Dynamic route
};
