import axios from 'axios';
import { ERGAST_ENDPOINTS } from '../../constants/external';
import Race from '../../models/race.model';
import * as racesErgastService from '../../services/racesErgastService';
import { withRetry } from '../../utils/retry';
import { connectTestDb, disconnectTestDb, clearTestDb } from '../utils/testUtils';

jest.mock('axios');
jest.mock('../../models/race.model');
jest.mock('../../utils/logger');
jest.mock('../../utils/retry');

describe('Races Ergast Service', () => {
  beforeAll(async () => {
    await connectTestDb();
  });

  afterAll(async () => {
    await disconnectTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
    jest.clearAllMocks();
    (withRetry as jest.Mock).mockImplementation(async (fn) => fn());
  });

  const mockRaceData = {
    MRData: {
      RaceTable: {
        Races: [
          {
            season: '2023',
            round: '1',
            raceName: 'Bahrain Grand Prix',
            date: '2023-03-05',
            Circuit: {
              circuitName: 'Bahrain International Circuit',
              Location: {
                locality: 'Sakhir',
                country: 'Bahrain',
              },
            },
            Results: [
              {
                Driver: {
                  driverId: 'max_verstappen',
                  givenName: 'Max',
                  familyName: 'Verstappen',
                  nationality: 'Dutch',
                },
                laps: '57',
                Time: {
                  time: '1:33:56.736',
                },
              },
            ],
          },
        ],
      },
    },
  };

  it('should fetch and store race winners successfully', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockRaceData });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
      upsertedCount: 1,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(axios.get).toHaveBeenCalledWith(ERGAST_ENDPOINTS.RACE_RESULTS_BY_SEASON('2023'));
    expect(Race.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { season: '2023', round: '1' },
          update: {
            $set: {
              season: '2023',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2023-03-05',
              circuit: {
                name: 'Bahrain International Circuit',
                locality: 'Sakhir',
                country: 'Bahrain',
              },
              winner: {
                driverId: 'max_verstappen',
                fullName: 'Max Verstappen',
                nationality: 'Dutch',
                laps: '57',
                time: '1:33:56.736',
              },
            },
          },
          upsert: true,
        },
      },
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].winner.fullName).toBe('Max Verstappen');
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const error = new Error('Network error');
    (axios.get as jest.Mock).mockRejectedValue(error);
    (withRetry as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(racesErgastService.fetchAndStoreRaceWinnersForSeason('2023')).rejects.toThrow(
      'Network error',
    );
  });

  it('should handle missing data in API response', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: {
        MRData: {
          RaceTable: {
            Races: [],
          },
        },
      },
    });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 0,
      upsertedCount: 0,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toEqual([]);
    expect(Race.bulkWrite).toHaveBeenCalledWith([]);
  });

  it('should handle malformed API response', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { MRData: {} }, // Missing RaceTable
    });

    // Act & Assert
    await expect(racesErgastService.fetchAndStoreRaceWinnersForSeason('2023')).rejects.toThrow();
  });

  it('should handle database errors', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockRaceData });
    const dbError = new Error('Database error');
    (Race.bulkWrite as jest.Mock).mockRejectedValue(dbError);

    // Act & Assert
    await expect(racesErgastService.fetchAndStoreRaceWinnersForSeason('2023')).rejects.toThrow(
      'Database error',
    );
  });

  it('should handle missing winner data in API response', async () => {
    // Arrange
    const mockDataWithoutWinner = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2023',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2023-03-05',
              Circuit: {
                circuitName: 'Bahrain International Circuit',
                Location: {
                  locality: 'Sakhir',
                  country: 'Bahrain',
                },
              },
              Results: [], // Empty results
            },
          ],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockDataWithoutWinner });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 0,
      upsertedCount: 0,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toEqual([]);
    expect(Race.bulkWrite).toHaveBeenCalledWith([]);
  });

  it('should handle missing circuit data in API response', async () => {
    // Arrange
    const mockDataWithoutCircuit = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2023',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2023-03-05',
              Results: [
                {
                  Driver: {
                    driverId: 'max_verstappen',
                    givenName: 'Max',
                    familyName: 'Verstappen',
                    nationality: 'Dutch',
                  },
                  laps: '57',
                  Time: {
                    time: '1:33:56.736',
                  },
                },
              ],
            },
          ],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockDataWithoutCircuit });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
      upsertedCount: 1,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].circuit).toEqual({
      name: undefined,
      locality: undefined,
      country: undefined,
    });
  });

  it('should handle missing time data in API response', async () => {
    // Arrange
    const mockDataWithoutTime = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2023',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2023-03-05',
              Circuit: {
                circuitName: 'Bahrain International Circuit',
                Location: {
                  locality: 'Sakhir',
                  country: 'Bahrain',
                },
              },
              Results: [
                {
                  Driver: {
                    driverId: 'max_verstappen',
                    givenName: 'Max',
                    familyName: 'Verstappen',
                    nationality: 'Dutch',
                  },
                  laps: '57',
                },
              ],
            },
          ],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockDataWithoutTime });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
      upsertedCount: 1,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].winner.time).toBeUndefined();
  });

  it('should retry failed API calls before succeeding', async () => {
    // Arrange
    let retryCount = 0;
    const fetchRacesFn = jest.fn().mockImplementation(() => {
      retryCount++;
      if (retryCount < 3) {
        return Promise.reject(new Error('Temporary failure'));
      }
      return Promise.resolve({ data: mockRaceData });
    });

    (axios.get as jest.Mock).mockImplementation(fetchRacesFn);
    (withRetry as jest.Mock).mockImplementation(async (fn) => {
      let attempts = 0;
      while (attempts < 3) {
        try {
          return await fn();
        } catch (err) {
          attempts++;
          if (attempts === 3) throw err;
        }
      }
    });

    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
      upsertedCount: 0,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(fetchRacesFn).toHaveBeenCalledTimes(3);
    expect(result).toHaveLength(1);
    expect(result[0].winner.fullName).toBe('Max Verstappen');
  });

  it('should handle partial winner data gracefully', async () => {
    // Arrange
    const mockPartialData = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2023',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2023-03-05',
              Circuit: {
                circuitName: 'Bahrain International Circuit',
                Location: {
                  locality: 'Sakhir',
                  country: 'Bahrain',
                },
              },
              Results: [
                {
                  Driver: {
                    driverId: 'max_verstappen',
                    // Missing givenName
                    familyName: 'Verstappen',
                    nationality: 'Dutch',
                  },
                  laps: '57',
                  Time: {
                    time: '1:33:56.736',
                  },
                },
              ],
            },
          ],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockPartialData });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
      upsertedCount: 0,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].winner.fullName).toBe('undefined Verstappen');
  });

  it('should handle partial bulk write failures', async () => {
    // Arrange
    const mockMultipleRaces = {
      MRData: {
        RaceTable: {
          Races: [
            mockRaceData.MRData.RaceTable.Races[0],
            {
              ...mockRaceData.MRData.RaceTable.Races[0],
              round: '2',
            },
          ],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockMultipleRaces });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 1,
      upsertedCount: 1,
      writeErrors: [
        {
          index: 1,
          code: 11000,
          errmsg: 'Duplicate key error',
        },
      ],
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toHaveLength(2);
    expect(Race.bulkWrite).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          updateOne: expect.objectContaining({
            filter: { season: '2023', round: '1' },
          }),
        }),
        expect.objectContaining({
          updateOne: expect.objectContaining({
            filter: { season: '2023', round: '2' },
          }),
        }),
      ]),
    );
  });

  it('should handle completely missing Results array', async () => {
    // Arrange
    const mockNoResults = {
      MRData: {
        RaceTable: {
          Races: [
            {
              season: '2023',
              round: '1',
              raceName: 'Bahrain Grand Prix',
              date: '2023-03-05',
              Circuit: {
                circuitName: 'Bahrain International Circuit',
                Location: {
                  locality: 'Sakhir',
                  country: 'Bahrain',
                },
              },
              // Results array completely missing
            },
          ],
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockNoResults });
    (Race.bulkWrite as jest.Mock).mockResolvedValue({
      modifiedCount: 0,
      upsertedCount: 0,
    });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toHaveLength(0);
    expect(Race.bulkWrite).toHaveBeenCalledWith([]);
  });

  it('should handle missing Races property in API response', async () => {
    // Arrange
    const mockResponse = {
      data: {
        MRData: {
          RaceTable: {
            // No Races property
          },
        },
      },
    };

    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);
    (Race.bulkWrite as jest.Mock).mockResolvedValueOnce({ ok: 1 });

    // Act
    const result = await racesErgastService.fetchAndStoreRaceWinnersForSeason('2023');

    // Assert
    expect(result).toEqual([]);
    expect(Race.bulkWrite).toHaveBeenCalledWith([]);
  });
});
