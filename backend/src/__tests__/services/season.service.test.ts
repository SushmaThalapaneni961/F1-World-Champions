import Season from '../../models/season.model';
import * as seasonService from '../../services/seasonService';
import { ISeason } from '../../types/season.types';

jest.mock('../../models/season.model');
jest.mock('../../utils/logger');

describe('Season Service', () => {
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

  describe('getAllSeasonsFromDb', () => {
    it('should return all seasons sorted by season in descending order', async () => {
      // Arrange
      const findMock = jest.fn().mockReturnThis();
      const sortMock = jest.fn().mockResolvedValue(mockSeasons);
      (Season.find as jest.Mock).mockImplementation(() => ({
        find: findMock,
        sort: sortMock
      }));

      // Act
      const result = await seasonService.getAllSeasonsFromDb();

      // Assert
      expect(Season.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(mockSeasons);
    });

    it('should return empty array when no seasons exist', async () => {
      // Arrange
      const findMock = jest.fn().mockReturnThis();
      const sortMock = jest.fn().mockResolvedValue([]);
      (Season.find as jest.Mock).mockImplementation(() => ({
        find: findMock,
        sort: sortMock
      }));

      // Act
      const result = await seasonService.getAllSeasonsFromDb();

      // Assert
      expect(Season.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const error = new Error('Database error');
      const findMock = jest.fn().mockReturnThis();
      const sortMock = jest.fn().mockRejectedValue(error);
      (Season.find as jest.Mock).mockImplementation(() => ({
        find: findMock,
        sort: sortMock
      }));

      // Act & Assert
      await expect(seasonService.getAllSeasonsFromDb()).rejects.toThrow('Database error');
    });

    it('should handle seasons with missing champion data', async () => {
      // Arrange
      const seasonsWithMissingChampion = [
        {
          season: '2023'
        },
        {
          season: '2022',
          champion: null
        }
      ];
      const findMock = jest.fn().mockReturnThis();
      const sortMock = jest.fn().mockResolvedValue(seasonsWithMissingChampion);
      (Season.find as jest.Mock).mockImplementation(() => ({
        find: findMock,
        sort: sortMock
      }));

      // Act
      const result = await seasonService.getAllSeasonsFromDb();

      // Assert
      expect(Season.find).toHaveBeenCalled();
      expect(sortMock).toHaveBeenCalledWith({ season: -1 });
      expect(result).toEqual(seasonsWithMissingChampion);
    });
  });
}); 