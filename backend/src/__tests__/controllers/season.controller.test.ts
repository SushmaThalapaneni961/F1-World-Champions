import { NextFunction, Request, Response } from 'express';
import redisClient from '../../config/redis';
import { CACHE_KEYS } from '../../constants/cache';
import * as seasonService from '../../services/seasonService';
import * as seasonsErgastService from '../../services/seaonsErgastService';
import * as seasonController from '../../controllers/seasonController';
import { ISeason } from '../../types/season.types';

jest.mock('../../config/redis');
jest.mock('../../services/seasonService');
jest.mock('../../services/seaonsErgastService');
jest.mock('../../utils/logger');

describe('Season Controller', () => {
  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockSeasons: ISeason[] = [
    {
      season: '2023',
      champion: {
        driverId: 'max_verstappen',
        givenName: 'Max',
        familyName: 'Verstappen',
        fullName: 'Max Verstappen',
        nationality: 'Dutch'
      }
    },
    {
      season: '2022',
      champion: {
        driverId: 'max_verstappen',
        givenName: 'Max',
        familyName: 'Verstappen',
        fullName: 'Max Verstappen',
        nationality: 'Dutch'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSeasons', () => {
    it('should return seasons from cache if available', async () => {
      // Arrange
      const cachedData = {
        status: 'success',
        statusCode: 200,
        message: 'Seasons list',
        data: mockSeasons.map(s => ({
          season: s.season,
          championName: s.champion?.fullName,
          nationality: s.champion?.nationality
        }))
      };
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedData));

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(redisClient.get).toHaveBeenCalledWith(CACHE_KEYS.SEASONS);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        message: 'Seasons retrieved (cached)',
        data: cachedData.data
      });
      expect(seasonService.getAllSeasonsFromDb).not.toHaveBeenCalled();
    });

    it('should fetch seasons from DB when cache is empty', async () => {
      // Arrange
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonService.getAllSeasonsFromDb as jest.Mock).mockResolvedValue(mockSeasons);

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(seasonService.getAllSeasonsFromDb).toHaveBeenCalled();
      expect(seasonsErgastService.fetchAndStoreSeasonsFromErgast).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        message: 'Seasons retrieved',
        data: mockSeasons.map(s => ({
          season: s.season,
          championName: s.champion?.fullName,
          nationality: s.champion?.nationality
        }))
      });
    });

    it('should fetch seasons from Ergast API when DB is empty', async () => {
      // Arrange
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonService.getAllSeasonsFromDb as jest.Mock).mockResolvedValue([]);
      (seasonsErgastService.fetchAndStoreSeasonsFromErgast as jest.Mock).mockResolvedValue(mockSeasons);

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(seasonService.getAllSeasonsFromDb).toHaveBeenCalled();
      expect(seasonsErgastService.fetchAndStoreSeasonsFromErgast).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        message: 'Seasons retrieved',
        data: mockSeasons.map(s => ({
          season: s.season,
          championName: s.champion?.fullName,
          nationality: s.champion?.nationality
        }))
      });
    });

    it('should handle seasons with no champion data', async () => {
      // Arrange
      const seasonsWithoutChampion: ISeason[] = [
        {
          season: '2023',
          champion: null
        }
      ];
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonService.getAllSeasonsFromDb as jest.Mock).mockResolvedValue(seasonsWithoutChampion);

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        message: 'Seasons retrieved',
        data: [{
          season: '2023',
          championName: null,
          nationality: null
        }]
      });
    });

    it('should handle Redis cache errors gracefully', async () => {
      // Arrange
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;
      const error = new Error('Redis error');

      (redisClient.get as jest.Mock).mockRejectedValue(error);

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;
      const error = new Error('Database error');

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonService.getAllSeasonsFromDb as jest.Mock).mockRejectedValue(error);

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle Ergast API errors gracefully', async () => {
      // Arrange
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;
      const error = new Error('API error');

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonService.getAllSeasonsFromDb as jest.Mock).mockResolvedValue([]);
      (seasonsErgastService.fetchAndStoreSeasonsFromErgast as jest.Mock).mockRejectedValue(error);

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle cache setting errors gracefully', async () => {
      // Arrange
      const req = {} as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;
      const error = new Error('Redis setEx error');

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonService.getAllSeasonsFromDb as jest.Mock).mockResolvedValue(mockSeasons);
      (redisClient.setEx as jest.Mock).mockRejectedValue(error);

      // Act
      await seasonController.getAllSeasons(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });
}); 