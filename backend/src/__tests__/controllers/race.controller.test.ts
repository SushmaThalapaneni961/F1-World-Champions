import { Request, NextFunction } from 'express';
import { mockResponse, generateMockRace } from '../utils/testUtils';
import * as raceService from '../../services/raceService';
import * as racesErgastService from '../../services/racesErgastService';
import * as seasonChampionService from '../../services/seasonChampionService';
import * as raceController from '../../controllers/raceController';
import redisClient from '../../config/redis';
import { Champion } from '../../types/season.types';

// Mock the services
jest.mock('../../services/raceService');
jest.mock('../../services/racesErgastService');
jest.mock('../../services/seasonChampionService');
jest.mock('../../config/redis', () => ({
  get: jest.fn(),
  setEx: jest.fn(),
}));
jest.mock('../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Race Controller', () => {
  // Reset all mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllRaces', () => {
    it('should return races from cache if available', async () => {
      // Arrange
      const mockRaces = [
        generateMockRace(),
        generateMockRace({
          round: '2',
          raceName: 'Spanish Grand Prix',
          winner: {
            driverId: 'lewis_hamilton',
            givenName: 'Lewis',
            familyName: 'Hamilton',
            fullName: 'Lewis Hamilton',
            nationality: 'British',
            laps: '58',
            time: '1:34:00.000',
          },
        }),
      ];
      const req = { params: { season: '2023' } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const cachedData = {
        status: 'success',
        statusCode: 200,
        message: 'Race winners for season 2023',
        data: mockRaces,
      };

      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedData));

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        data: mockRaces,
        message: 'Race winners retrieved (cached)',
      });
      expect(raceService.getRacesBySeasonFromDb).not.toHaveBeenCalled();
    });

    it('should handle invalid JSON in cache', async () => {
      // Arrange
      const req = { params: { season: '2023' } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      (redisClient.get as jest.Mock).mockResolvedValue('invalid json');

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(raceService.getRacesBySeasonFromDb).not.toHaveBeenCalled();
    });

    it('should handle errors when fetching from external API', async () => {
      // Arrange
      const req = { params: { season: '2023' } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;
      const error = new Error('API error');

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonChampionService.getSeasonChampion as jest.Mock).mockResolvedValue(null);
      (raceService.getRacesBySeasonFromDb as jest.Mock).mockResolvedValue([]);
      (racesErgastService.fetchAndStoreRaceWinnersForSeason as jest.Mock).mockRejectedValue(error);

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should fetch races from DB and external API when not in cache', async () => {
      // Arrange
      const mockRaces = [generateMockRace()];
      const req = { params: { season: '2023' } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      const mockChampion: Champion = {
        driverId: 'max_verstappen',
        givenName: 'Max',
        familyName: 'Verstappen',
        fullName: 'Max Verstappen',
        nationality: 'Dutch',
      };

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonChampionService.getSeasonChampion as jest.Mock).mockResolvedValue(mockChampion);
      (raceService.getRacesBySeasonFromDb as jest.Mock).mockResolvedValue(mockRaces);
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(seasonChampionService.getSeasonChampion).toHaveBeenCalledWith('2023');
      expect(raceService.getRacesBySeasonFromDb).toHaveBeenCalledWith('2023');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        data: expect.any(Array),
        message: 'Race winners for season 2023',
      });
    });

    it('should fetch from external API if DB has no races', async () => {
      // Arrange
      const mockRaces = [generateMockRace()];
      const req = { params: { season: '2023' } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonChampionService.getSeasonChampion as jest.Mock).mockResolvedValue(null);
      (raceService.getRacesBySeasonFromDb as jest.Mock).mockResolvedValue([]);
      (racesErgastService.fetchAndStoreRaceWinnersForSeason as jest.Mock).mockResolvedValue(
        mockRaces,
      );
      (redisClient.setEx as jest.Mock).mockResolvedValue('OK');

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(raceService.getRacesBySeasonFromDb).toHaveBeenCalledWith('2023');
      expect(racesErgastService.fetchAndStoreRaceWinnersForSeason).toHaveBeenCalledWith('2023');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors appropriately', async () => {
      // Arrange
      const req = { params: { season: '2023' } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;
      const error = new Error('Database error');

      (redisClient.get as jest.Mock).mockRejectedValue(error);

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should return 400 if season parameter is missing', async () => {
      // Arrange
      const req = { params: {} } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 400,
        message: 'Season/Year is required',
      });
    });

    it('should handle errors when setting cache', async () => {
      // Arrange
      const mockRaces = [generateMockRace()];
      const req = { params: { season: '2023' } } as unknown as Request;
      const res = mockResponse();
      const next = jest.fn() as NextFunction;
      const error = new Error('Redis error');

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (seasonChampionService.getSeasonChampion as jest.Mock).mockResolvedValue(null);
      (raceService.getRacesBySeasonFromDb as jest.Mock).mockResolvedValue(mockRaces);
      (redisClient.setEx as jest.Mock).mockRejectedValue(error);

      // Act
      await raceController.getAllRaces(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
