import { describe, it, expect } from 'vitest';
import { handleApiError, APIError } from '../../../lib/api/errorHandler';
import { AxiosError } from 'axios';

describe('Error Handler', () => {
  describe('handleApiError', () => {
    it('handles Axios error with response data', () => {
      const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 400,
        data: { message: 'Bad Request' },
      } as any);

      const apiError = handleApiError(axiosError);
      expect(apiError).toBeInstanceOf(APIError);
      expect(apiError.message).toBe('Bad Request');
      expect(apiError.status).toBe(400);
      expect(apiError.data).toEqual({ message: 'Bad Request' });
    });

    it('handles Axios error without response data', () => {
      const axiosError = new AxiosError('Network Error', 'ERR_NETWORK');

      const apiError = handleApiError(axiosError);
      expect(apiError).toBeInstanceOf(APIError);
      expect(apiError.message).toBe('Network Error');
      expect(apiError.status).toBeUndefined();
      expect(apiError.data).toBeUndefined();
    });

    it('handles regular Error', () => {
      const error = new Error('Test error');
      const apiError = handleApiError(error);
      expect(apiError).toBeInstanceOf(APIError);
      expect(apiError.message).toBe('Test error');
      expect(apiError.status).toBeUndefined();
      expect(apiError.data).toBeUndefined();
    });

    it('handles unknown error types', () => {
      const apiError = handleApiError('unexpected error');
      expect(apiError).toBeInstanceOf(APIError);
      expect(apiError.message).toBe('Unexpected error');
      expect(apiError.status).toBeUndefined();
      expect(apiError.data).toBeUndefined();
    });
  });

  describe('APIError', () => {
    it('creates APIError with message, status, and data', () => {
      const error = new APIError('Test error', 400, { details: 'test' });
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('APIError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.data).toEqual({ details: 'test' });
    });

    it('creates APIError with only message', () => {
      const error = new APIError('Test error');
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('APIError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.data).toBeUndefined();
    });
  });
});
