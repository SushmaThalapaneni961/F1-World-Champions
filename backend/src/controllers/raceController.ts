import { NextFunction, Request, Response } from 'express';
import redisClient from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../constants/cache';
import { RETRY_CONFIG } from '../constants/external';
import { fetchAndStoreRaceWinnersForSeason } from '../services/racesErgastService';
import { getRacesBySeasonFromDb } from '../services/raceService';
import { getSeasonChampion } from '../services/seasonChampionService';
import { logger } from '../utils/logger';
import { sendError, sendSuccess } from '../utils/response';

// Fetch all races winners for a specific season
export const getAllRaces = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { seasonId } = req.params;
    if (!seasonId) {
      return sendError(res, 'SeasonId is required', 400);
    }
    const cacheKey = `${CACHE_KEYS.RACES}_${seasonId}`;
    // Check cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const data = JSON.parse(cached)?.data ?? [];
      logger.info('[CACHE HIT] Returning races from Redis');
      return sendSuccess(res, data, 'Race winners retrieved (cached)');
    }

    // 1. Get champion for the season
    const champion = await getSeasonChampion(seasonId);
    const championName = champion?.fullName ?? null;

    // 2. Get races from DB or external API
    let races = await getRacesBySeasonFromDb(seasonId);
    if (!races.length) {
      races = await fetchAndStoreRaceWinnersForSeason(seasonId);
    }

    // 3. Mark if the race winner is the champion
    const raceData = races.map((race) => {
      const plain = race.toObject ? race.toObject() : race;
      return {
        ...plain,
        isChampionWinner: plain.winner?.fullName === championName,
      };
    });

    const responseToCache = {
      status: 'success',
      statusCode: 200,
      message: `Race winners for season ${seasonId}`,
      data: raceData,
    };

    await redisClient.setEx(cacheKey, CACHE_TTL.ONE_HOUR, JSON.stringify(responseToCache)); // Cache for 1 hour

    return sendSuccess(res, raceData, `Race winners for season ${seasonId}`);
  } catch (err: any) {
    next(err);
  }
};