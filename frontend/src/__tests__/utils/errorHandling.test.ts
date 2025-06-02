import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { APIError, getErrorDetails, isNetworkError, withTimeout } from '../../utils/errorHandling';

describe('Error Handling Utilities', () => {
  describe('APIError', () => {
    it('should create an APIError with default type', () => {
      const error = new APIError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.type).toBe('api');
      expect(error.details).toBe('');
    });

    it('should create an APIError with custom type and details', () => {
      const error = new APIError('Test error', 'network', 'Test details');
      expect(error.message).toBe('Test error');
      expect(error.type).toBe('network');
      expect(error.details).toBe('Test details');
    });
  });

  describe('isNetworkError', () => {
    let originalNavigator: Navigator;

    beforeEach(() => {
      originalNavigator = window.navigator;
      Object.defineProperty(window, 'navigator', {
        value: { onLine: true },
        writable: true
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'navigator', {
        value: originalNavigator,
        writable: true
      });
    });

    it('should detect offline status', () => {
      Object.defineProperty(window, 'navigator', {
        value: { onLine: false },
        writable: true
      });
      expect(isNetworkError(new Error('Any error'))).toBe(true);
    });

    it('should detect network error message', () => {
      expect(isNetworkError(new Error('Network Error'))).toBe(true);
    });

    it('should detect failed fetch', () => {
      expect(isNetworkError(new Error('Failed to fetch'))).toBe(true);
    });

    it('should return false for other errors', () => {
      expect(isNetworkError(new Error('Regular error'))).toBe(false);
    });
  });

  describe('getErrorDetails', () => {
    it('should handle APIError', () => {
      const error = new APIError('Test error', 'test', 'Test details');
      const details = getErrorDetails(error);
      expect(details).toEqual({
        message: 'Test error',
        type: 'test',
        details: 'Test details'
      });
    });

    it('should handle network errors', () => {
      const error = new Error('Network Error');
      const details = getErrorDetails(error);
      expect(details).toEqual({
        message: 'Unable to connect to the server',
        type: 'network',
        details: 'Please check your internet connection and try again'
      });
    });

    it('should handle timeout errors', () => {
      const error = new Error('timeout') as Error & { code?: string };
      error.code = 'ECONNABORTED';
      const details = getErrorDetails(error);
      expect(details).toEqual({
        message: 'Request timed out',
        type: 'timeout',
        details: 'The server is taking too long to respond. Please try again'
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Unknown error');
      const details = getErrorDetails(error);
      expect(details).toEqual({
        message: 'Unknown error',
        type: 'unknown',
        details: 'Please try again or contact support if the problem persists'
      });
    });
  });

  describe('withTimeout', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should resolve when promise completes before timeout', async () => {
      const promise = Promise.resolve('success');
      const result = withTimeout(promise, 1000);
      
      await expect(result).resolves.toBe('success');
    });

    it('should reject with timeout error when promise takes too long', async () => {
      const promise = new Promise(resolve => {
        setTimeout(() => resolve('success'), 2000);
      });
      
      const result = withTimeout(promise, 1000);
      
      vi.advanceTimersByTime(1000);
      await expect(result).rejects.toThrow('Request timed out');
    });
  });
}); 