import { NextFunction, Request, Response } from 'express';
import redisClient from '../config/redis';
import { CACHE_KEYS, CACHE_TTL } from '../constants/cache';
import { fetchAndStoreSeasonsFromErgast } from '../services/seaonsErgastService';
import { getAllSeasonsFromDb } from '../services/seasonService';
import { ISeason } from '../types/season.types';
import { logger } from '../utils/logger';
import { sendSuccess } from '../utils/response';

export const getAllSeasons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cached = await redisClient.get(CACHE_KEYS.SEASONS);
    logger.info(`cahced, ${cached}`);
    //Check chached and return without making additional call
    if (cached) {
      logger.info('[CACHE HIT] Returning seasons from Redis');
      const data = JSON.parse(cached)?.data ?? [];
      return sendSuccess(res, data, 'Seasons retrieved (cached)');
    }
    logger.info('[CACHE MISS] Fetching from DB or External API');
    //If the cache/redis is empty then try to get the data from database
    let seasons: ISeason[] = await getAllSeasonsFromDb();
    //If the database is empty then try to get the data from external library i.e. Ergast
    if (!seasons.length) seasons = await fetchAndStoreSeasonsFromErgast();
    //Data to be send to Frontend
    const data = seasons.map((s: any) => ({
      season: s.season,
      championName: s?.champion?.fullName ?? null,
      nationality: s?.champion?.nationality ?? null,
    }));

    const responseToCache = {
      status: 'success',
      statusCode: 200,
      message: `Seasons list`,
      data: data,
    };

    await redisClient.setEx(
      CACHE_KEYS.SEASONS,
      CACHE_TTL.ONE_HOUR,
      JSON.stringify(responseToCache),
    ); // Cache for 1 hour

    return sendSuccess(res, data, 'Seasons retrieved');
  } catch (err) {
    next(err); // Forward error to centralized error handler
  }
};
