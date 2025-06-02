import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSeasons } from '../../../store/api/seasonsApi';
import axiosInstance from '../../../lib/api/axiosSetup';
import { APIError } from '../../../lib/api/errorHandler';

vi.mock('../../../lib/api/axiosSetup', () => ({
  default: {
    get: vi.fn()
  }
}));

describe('Seasons API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSeasons', () => {
    it('successfully fetches seasons data', async () => {
      const mockResponse = {
        data: {
          data: [
            { season: '2023', url: 'http://example.com/2023' },
            { season: '2022', url: 'http://example.com/2022' }
          ]
        }
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

      const result = await getSeasons();

      expect(result).toEqual([
        { season: '2023', url: 'http://example.com/2023' },
        { season: '2022', url: 'http://example.com/2022' }
      ]);

      expect(axiosInstance.get).toHaveBeenCalledWith('/seasons', {
        timeout: 10000
      });
    });

    it('handles API error response', async () => {
      const mockError = new APIError('API Error', 500);
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

      await expect(getSeasons()).rejects.toThrow(APIError);
      expect(axiosInstance.get).toHaveBeenCalledWith('/seasons', {
        timeout: 10000
      });
    });

    it('handles network error', async () => {
      const mockError = new Error('Network Error');
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

      await expect(getSeasons()).rejects.toThrow(APIError);
      expect(axiosInstance.get).toHaveBeenCalledWith('/seasons', {
        timeout: 10000
      });
    });

    it('handles empty response data', async () => {
      const mockResponse = {
        data: {
          data: []
        }
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

      const result = await getSeasons();
      expect(result).toEqual([]);
      expect(axiosInstance.get).toHaveBeenCalledWith('/seasons', {
        timeout: 10000
      });
    });

    it('handles malformed response data', async () => {
      const mockResponse = {
        data: {
          // Missing data property
        }
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

      const result = await getSeasons();
      expect(result).toBeUndefined();
      expect(axiosInstance.get).toHaveBeenCalledWith('/seasons', {
        timeout: 10000
      });
    });
  });
}); 