import mongoose from 'mongoose';
import Race from '../../models/race.model';
import * as raceService from '../../services/raceService';
import { generateMockRace } from '../utils/testUtils';

jest.mock('../../models/race.model');

describe('Race Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRacesBySeasonFromDb', () => {
    it('should return races for a valid season', async () => {
      // Arrange
      const mockRaces = [
        generateMockRace(),
        generateMockRace({ round: '2', raceName: 'Spanish Grand Prix' }),
      ];

      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue(mockRaces);

      (Race.find as jest.Mock) = mockFind;
      (Race.find().sort as jest.Mock) = mockSort;

      // Act
      const result = await raceService.getRacesBySeasonFromDb('2023');

      // Assert
      expect(mockFind).toHaveBeenCalledWith({ season: '2023' });
      expect(mockSort).toHaveBeenCalledWith({ round: 1 });
      expect(result).toEqual(mockRaces);
    });

    it('should return empty array if no races found', async () => {
      // Arrange
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockResolvedValue([]);

      (Race.find as jest.Mock) = mockFind;
      (Race.find().sort as jest.Mock) = mockSort;

      // Act
      const result = await raceService.getRacesBySeasonFromDb('2099');

      // Assert
      expect(mockFind).toHaveBeenCalledWith({ season: '2099' });
      expect(result).toEqual([]);
    });

    it('should throw error if DB call fails', async () => {
      // Arrange
      const mockError = new Error('Database connection failed');
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockRejectedValue(mockError);

      (Race.find as jest.Mock) = mockFind;
      (Race.find().sort as jest.Mock) = mockSort;

      // Act & Assert
      await expect(raceService.getRacesBySeasonFromDb('2023')).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
