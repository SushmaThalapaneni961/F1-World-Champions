import { NextFunction, Request, Response } from 'express';
import redisClient from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../constants/cache';
import { fetchAndStoreRaceWinnersForSeason } from '../services/racesErgastService';
import { getRacesBySeasonFromDb } from '../services/raceService';
import { getSeasonChampion } from '../services/seasonChampionService';
import { logger } from '../utils/logger';
import { sendError, sendSuccess } from '../utils/response';

// Fetch all races winners for a specific season
export const getAllRaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { season } = req.params;
    if (!season) {
      return sendError(res, 'Season/Year is required', 400);
    }
    const cacheKey = `${CACHE_KEYS.RACES}_${season}`;
    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached)?.data ?? [];
      logger.info('[CACHE HIT] Returning races from Redis');
      return sendSuccess(res, data, 'Race winners retrieved (cached)');
    }

    // 1. Get champion for the season
    const champion = await getSeasonChampion(season);
    const championName = champion?.fullName ?? null;

    // 2. Get races from DB or external API
    let races = await getRacesBySeasonFromDb(season);
    if (!races.length) {
      races = await fetchAndStoreRaceWinnersForSeason(season);
    }

    // 3. Mark if the race winner is the champion
    const raceData = races.map((race: any) => {
      const plain = race?.toObject ? race.toObject() : race;
      return {
        ...plain,
        isChampionWinner: plain.winner?.fullName === championName,
      };
    });

    const responseToCache = {
      status: 'success',
      statusCode: 200,
      message: `Race winners for season ${season}`,
      data: raceData,
    };

    await redisClient.setEx(cacheKey, CACHE_TTL.ONE_HOUR, JSON.stringify(responseToCache)); // Cache for 1 hour

    return sendSuccess(res, raceData, `Race winners for season ${season}`);
  } catch (err: any) {
    next(err);
  }
};
