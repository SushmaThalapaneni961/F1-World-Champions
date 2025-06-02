import axios from 'axios';
import { ERGAST_ENDPOINTS, RETRY_CONFIG } from '../constants/external';
import Season from '../models/season.model';
import { Champion, ISeason } from '../types/season.types';
import { logger } from '../utils/logger';
import { withRetry } from '../utils/retry';
import { getSeasonChampion } from './seasonChampionService';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchAndStoreSeasonsFromErgast = async (): Promise<ISeason[]> => {
  const currentYear = new Date().getFullYear();
  const startYear = 2005;
  const offset = startYear - 1950;
  const limit = currentYear - startYear + 1;

  try {
    const response = await withRetry(
      () => axios.get(`${ERGAST_ENDPOINTS.SEASONS}?limit=${limit}&offset=${offset}`),
      'fetch seasons list',
    );
    const seasons = response?.data?.MRData?.SeasonTable?.Seasons ?? [];

    const results = [];

    for (const s of seasons) {
      const year = s.season;
      let champion: Champion | null = await getSeasonChampion(year) ?? null;
      logger.info(`Champion from getSeasonChampion: ${champion}`);
      results.push({
        season: year,
        champion,
      });

      await delay(RETRY_CONFIG.DELAY_MS); // Add delay between API calls
    }

    await Season.deleteMany({});
    return await Season.insertMany(results);
  } catch (err: any) {
    logger.error(`Error fetching seasons: ${err.message}`);
    throw new Error('Failed to fetch seasons from external API');
  }
};
