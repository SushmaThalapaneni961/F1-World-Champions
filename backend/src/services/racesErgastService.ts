// src/services/externalErgastService.ts

import axios from 'axios';
import { ERGAST_ENDPOINTS } from '../constants/external';
import Race from '../models/race.model';
import { IRace } from '../types/race.types';
import { logger } from '../utils/logger';
import { withRetry } from '../utils/retry';

// Fetch and store races from Ergast API
export const fetchAndStoreRaceWinnersForSeason = async (season: string): Promise<IRace[]> => {
  try {
    // Using the ERGAST_ENDPOINTS constant to get the URL
    const fetchRaces = async () => {
      const response = await axios.get(ERGAST_ENDPOINTS.RACE_RESULTS_BY_SEASON(season));
      return response.data.MRData.RaceTable.Races ?? [];
    };

    // Retry the API call with retry logic
    const racesData = await withRetry(() => fetchRaces(), 'fetch Race Winners');

    // Transform the data according to DB model
    const processedRaces = racesData
      .map((race: any) => {
        const winner = race.Results?.[0]?.Driver;
        if (!winner) return null;

        return {
          season: race.season,
          round: race.round,
          raceName: race.raceName,
          date: race.date,
          circuit: {
            name: race.Circuit?.circuitName,
            locality: race.Circuit?.Location?.locality,
            country: race.Circuit?.Location?.country,
          },
          winner: {
            driverId: winner.driverId,
            fullName: `${winner.givenName} ${winner.familyName}`,
            nationality: winner.nationality,
            laps: race?.Results?.[0]?.laps,
            time: race?.Results?.[0]?.Time?.time,
          },
        };
      })
      .filter(Boolean); // remove nulls if any race didn't have a winner

    // You can store it in the DB (this is an example, you might want to clean up data before saving)
    // Upsert logic to avoid duplicates
    const bulkRaces = processedRaces.map((race: any) => ({
      updateOne: {
        filter: { season: race.season, round: race.round },
        update: { $set: race },
        upsert: true,
      },
    }));

    await Race.bulkWrite(bulkRaces);
    logger.info(`[MongoDB] Upserted ${processedRaces.length} races for season ${season}`);

    return processedRaces;
  } catch (err: any) {
    logger.error(`Error fetching race winners for season ${season}: ${err?.message}`);
    throw err; // Rethrow to be handled by controller
  }
};
