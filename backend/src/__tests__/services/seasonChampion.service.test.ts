import axios from 'axios';
import { ERGAST_ENDPOINTS } from '../../constants/external';
import * as seasonChampionService from '../../services/seasonChampionService';

jest.mock('axios');
jest.mock('../../utils/logger');

describe('Season Champion Service', () => {
  const mockChampionData = {
    MRData: {
      StandingsTable: {
        StandingsLists: [
          {
            DriverStandings: [
              {
                Driver: {
                  driverId: 'max_verstappen',
                  givenName: 'Max',
                  familyName: 'Verstappen',
                  nationality: 'Dutch',
                },
              },
            ],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch champion data successfully', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockChampionData });
    const year = '2023';

    // Act
    const result = await seasonChampionService.getSeasonChampion(year);

    // Assert
    expect(axios.get).toHaveBeenCalledWith(ERGAST_ENDPOINTS.CHAMPION_BY_YEAR(year));
    expect(result).toEqual({
      driverId: 'max_verstappen',
      givenName: 'Max',
      familyName: 'Verstappen',
      fullName: 'Max Verstappen',
      nationality: 'Dutch',
    });
  });

  it('should return null when no champion data is found', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { MRData: { StandingsTable: { StandingsLists: [] } } },
    });

    // Act
    const result = await seasonChampionService.getSeasonChampion('2023');

    // Assert
    expect(result).toBeNull();
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    const error = new Error('Network error');
    (axios.get as jest.Mock).mockRejectedValue(error);

    // Act
    const result = await seasonChampionService.getSeasonChampion('2023');

    // Assert
    expect(result).toBeNull();
  });

  it('should handle malformed API response', async () => {
    // Arrange
    (axios.get as jest.Mock).mockResolvedValueOnce({
      data: { MRData: {} }, // Missing StandingsTable
    });

    // Act
    const result = await seasonChampionService.getSeasonChampion('2023');

    // Assert
    expect(result).toBeNull();
  });

  it('should handle empty driver data', async () => {
    // Arrange
    const emptyDriverData = {
      MRData: {
        StandingsTable: {
          StandingsLists: [
            {
              DriverStandings: [
                {
                  Driver: null,
                },
              ],
            },
          ],
        },
      },
    };
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: emptyDriverData });

    // Act
    const result = await seasonChampionService.getSeasonChampion('2023');

    // Assert
    expect(result).toBeNull();
  });
});
