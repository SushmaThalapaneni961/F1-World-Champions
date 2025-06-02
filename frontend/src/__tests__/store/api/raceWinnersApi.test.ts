import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRaceWinners } from '../../../store/api/raceWinnersApi';
import axiosInstance from '../../../lib/api/axiosSetup';
import { APIError } from '../../../lib/api/errorHandler';

vi.mock('../../../lib/api/axiosSetup', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Race Winners API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRaceWinners', () => {
    const season = '2023';

    it('successfully fetches race winners data', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              round: '1',
              raceName: 'Bahrain Grand Prix',
              circuit: 'Bahrain International Circuit',
              winner: {
                firstName: 'Max',
                lastName: 'Verstappen',
                constructor: 'Red Bull',
              },
            },
          ],
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

      const result = await getRaceWinners(season);

      expect(result).toEqual([
        {
          round: '1',
          raceName: 'Bahrain Grand Prix',
          circuit: 'Bahrain International Circuit',
          winner: {
            firstName: 'Max',
            lastName: 'Verstappen',
            constructor: 'Red Bull',
          },
        },
      ]);

      expect(axiosInstance.get).toHaveBeenCalledWith(`/seasons/${season}/races`, {
        timeout: 10000,
      });
    });

    it('handles API error response', async () => {
      const mockError = new APIError('API Error', 500);
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

      await expect(getRaceWinners(season)).rejects.toThrow(APIError);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/seasons/${season}/races`, {
        timeout: 10000,
      });
    });

    it('handles network error', async () => {
      const mockError = new Error('Network Error');
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

      await expect(getRaceWinners(season)).rejects.toThrow(APIError);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/seasons/${season}/races`, {
        timeout: 10000,
      });
    });

    it('handles empty response data', async () => {
      const mockResponse = {
        data: {
          data: [],
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

      const result = await getRaceWinners(season);
      expect(result).toEqual([]);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/seasons/${season}/races`, {
        timeout: 10000,
      });
    });

    it('handles malformed response data', async () => {
      const mockResponse = {
        data: {
          // Missing data property
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

      const result = await getRaceWinners(season);
      expect(result).toEqual([]);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/seasons/${season}/races`, {
        timeout: 10000,
      });
    });

    it('handles missing winner data in race results', async () => {
      const mockResponse = {
        data: {
          data: [
            {
              round: '1',
              raceName: 'Bahrain Grand Prix',
              circuit: 'Bahrain International Circuit',
              // Missing winner data
            },
          ],
        },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

      const result = await getRaceWinners(season);
      expect(result).toEqual([
        {
          round: '1',
          raceName: 'Bahrain Grand Prix',
          circuit: 'Bahrain International Circuit',
        },
      ]);
      expect(axiosInstance.get).toHaveBeenCalledWith(`/seasons/${season}/races`, {
        timeout: 10000,
      });
    });
  });
});
