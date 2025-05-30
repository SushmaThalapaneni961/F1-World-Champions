import { ERGAST_API_BASE_URL, ERGAST_ENDPOINTS, RETRY_CONFIG } from '../../constants/external';

describe('External Constants', () => {
  describe('ERGAST_API_BASE_URL', () => {
    it('should have the correct base URL', () => {
      expect(ERGAST_API_BASE_URL).toBe('https://api.jolpi.ca/ergast/f1');
    });
  });

  describe('ERGAST_ENDPOINTS', () => {
    it('should have the correct SEASONS endpoint', () => {
      expect(ERGAST_ENDPOINTS.SEASONS).toBe(`${ERGAST_API_BASE_URL}/seasons`);
    });

    it('should generate correct CHAMPION_BY_YEAR endpoint', () => {
      const season = '2023';
      expect(ERGAST_ENDPOINTS.CHAMPION_BY_YEAR(season))
        .toBe(`${ERGAST_API_BASE_URL}/${season}/driverStandings/1.json`);
    });

    it('should generate correct RACE_BY_SEASONID endpoint', () => {
      const season = '2023';
      expect(ERGAST_ENDPOINTS.RACE_BY_SEASONID(season))
        .toBe(`${ERGAST_API_BASE_URL}/${season}/races.json`);
    });

    it('should generate correct RACE_RESULTS_BY_SEASON endpoint', () => {
      const season = '2023';
      expect(ERGAST_ENDPOINTS.RACE_RESULTS_BY_SEASON(season))
        .toBe(`${ERGAST_API_BASE_URL}/${season}/results/1.json`);
    });
  });

  describe('RETRY_CONFIG', () => {
    it('should have correct retry configuration values', () => {
      expect(RETRY_CONFIG.MAX_ATTEMPTS).toBe(3);
      expect(RETRY_CONFIG.DELAY_MS).toBe(500);
    });
  });
}); 