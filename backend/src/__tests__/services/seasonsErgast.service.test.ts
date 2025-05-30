import axios from 'axios';
import { ERGAST_ENDPOINTS } from '../../constants/external';
import Season from '../../models/season.model';
import * as seasonsErgastService from '../../services/seaonsErgastService';
import * as seasonChampionService from '../../services/seasonChampionService';
import { Champion } from '../../types/season.types';

jest.mock('axios');
jest.mock('../../models/season.model');
jest.mock('../../services/seasonChampionService');
jest.mock('../../utils/logger');

// Mock the delay function
jest.mock('../../services/seaonsErgastService', () => {
  const originalModule = jest.requireActual('../../services/seaonsErgastService');
  return {
    ...originalModule,
    delay: jest.fn().mockResolvedValue(undefined),
  };
});

describe('Seasons Ergast Service', () => {
  const mockSeasonData = {
    MRData: {
      SeasonTable: {
        Seasons: [{ season: '2023' }, { season: '2022' }, { season: '2021' }],
      },
    },
  };

  const mockChampion: Champion = {
    driverId: 'max_verstappen',
    givenName: 'Max',
    familyName: 'Verstappen',
    fullName: 'Max Verstappen',
    nationality: 'Dutch',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and store seasons successfully', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockSeasonData });
    (seasonChampionService.getSeasonChampion as jest.Mock).mockResolvedValue(mockChampion);
    (Season.deleteMany as jest.Mock).mockResolvedValue({});
    (Season.insertMany as jest.Mock).mockResolvedValue([
      { season: '2023', champion: mockChampion },
      { season: '2022', champion: mockChampion },
      { season: '2021', champion: mockChampion },
    ]);

    // Act
    const result = await seasonsErgastService.fetchAndStoreSeasonsFromErgast();

    // Assert
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(ERGAST_ENDPOINTS.SEASONS));
    expect(seasonChampionService.getSeasonChampion).toHaveBeenCalledTimes(3);
    expect(Season.deleteMany).toHaveBeenCalled();
    expect(Season.insertMany).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ season: '2023', champion: mockChampion })]),
    );
    expect(result).toHaveLength(3);
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const error = new Error('Network error');
    (axios.get as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(seasonsErgastService.fetchAndStoreSeasonsFromErgast()).rejects.toThrow(
      'Failed to fetch seasons from external API',
    );
  });

  it('should handle missing data in API response', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        MRData: {
          SeasonTable: {
            Seasons: [],
          },
        },
      },
    });
    (Season.deleteMany as jest.Mock).mockResolvedValue({});
    (Season.insertMany as jest.Mock).mockResolvedValue([]);

    // Act
    const result = await seasonsErgastService.fetchAndStoreSeasonsFromErgast();

    // Assert
    expect(result).toEqual([]);
    expect(Season.insertMany).toHaveBeenCalledWith([]);
  });

  it('should handle null champion data', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockSeasonData });
    (seasonChampionService.getSeasonChampion as jest.Mock).mockResolvedValue(null);
    (Season.deleteMany as jest.Mock).mockResolvedValue({});
    (Season.insertMany as jest.Mock).mockResolvedValue([
      { season: '2023', champion: null },
      { season: '2022', champion: null },
      { season: '2021', champion: null },
    ]);

    // Act
    const result = await seasonsErgastService.fetchAndStoreSeasonsFromErgast();

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0].champion).toBeNull();
  });
});
