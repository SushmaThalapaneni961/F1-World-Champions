import axios from 'axios';
import { ERGAST_ENDPOINTS } from '../constants/external';
import { Champion } from '../types/season.types';
import { logger } from '../utils/logger';
import { withRetry } from '../utils/retry';

export const getSeasonChampion = async (year: string): Promise<Champion | null> => {
  try {
    const championResponse = await withRetry(async () => {
      return await axios.get(ERGAST_ENDPOINTS.CHAMPION_BY_YEAR(year));
    }, `fetch champion for ${year}`);

    const driver =
      championResponse.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0]
        ?.Driver;

    if (!driver) return null;

    logger.info(`driver from getSeasonChampion: ${driver}`);

    return {
      driverId: driver.driverId,
      givenName: driver.givenName,
      familyName: driver.familyName,
      fullName: `${driver.givenName} ${driver.familyName}`,
      nationality: driver.nationality,
    };
  } catch (err: any) {
    logger.error(`[getSeasonChampion] Failed for ${year}: ${err}`);
    return null;
  }
};
