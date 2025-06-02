import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { StaticDomainApi } from '../../../lib/api/helperApi';
import { isNetworkError, getErrorDetails } from '../../../utils/errorHandling';

// Mock errorHandling utilities
vi.mock('../../../utils/errorHandling', () => ({
  isNetworkError: vi.fn(),
  getErrorDetails: vi.fn(),
  withTimeout: vi.fn((promise) => promise),
}));

// Setup mocks before any imports that might use them
vi.mock('axios');
vi.mock('../../../lib/api/helperApi');

// Create mock instance with proper typing for interceptors
const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();
const mockDelete = vi.fn();
const mockRequestUse = vi.fn();
const mockResponseUse = vi.fn();

const mockAxiosInstance = {
  interceptors: {
    request: { use: mockRequestUse },
    response: { use: mockResponseUse },
  },
  get: mockGet,
  post: mockPost,
  put: mockPut,
  delete: mockDelete,
} as unknown as AxiosInstance;

describe('Axios Setup', () => {
  let axiosInstance: AxiosInstance;
  let requestErrorCallback: any;
  let responseErrorCallback: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Re-configure mocks for each test
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance);
    vi.mocked(StaticDomainApi.getUrl).mockReturnValue('http://test-api.com');
    vi.mocked(isNetworkError).mockReturnValue(false);
    vi.mocked(getErrorDetails).mockReturnValue({
      message: 'Test error',
      type: 'test',
      details: 'Test details',
    });

    // Set up interceptor capture
    mockRequestUse.mockImplementation((_onFulfilled, onRejected) => {
      // Store both callbacks for testing
      requestErrorCallback = onRejected;
      return mockAxiosInstance;
    });

    mockResponseUse.mockImplementation((_onFulfilled, onRejected) => {
      // Store both callbacks for testing
      responseErrorCallback = onRejected;
      return mockAxiosInstance;
    });

    // Set up default HTTP method behavior
    mockGet.mockResolvedValue({ data: {} });
    mockPost.mockResolvedValue({ data: {} });
    mockPut.mockResolvedValue({ data: {} });
    mockDelete.mockResolvedValue({ data: {} });

    // Import the module under test
    const module = await import('../../../lib/api/axiosSetup');
    axiosInstance = module.default;
  });

  it('creates axios instance with correct base URL from StaticDomainApi', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://test-api.com',
    });
  });

  it('falls back to default base URL when StaticDomainApi returns empty string', async () => {
    // Reset all mocks and modules
    vi.clearAllMocks();
    vi.resetModules();

    // Setup mocks for this test
    vi.mocked(StaticDomainApi.getUrl).mockReturnValue('');
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance);

    // Re-import to trigger new instance creation
    await import('../../../lib/api/axiosSetup');

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:5001/api',
    });
  });

  describe('Request Interceptor', () => {
    it('passes through config in request interceptor', async () => {
      await axiosInstance.get('/test');
      expect(mockGet).toHaveBeenCalled();
    });

    it('rejects with error in request error handler', async () => {
      const mockError = new Error('Request failed');

      // Simulate request error
      mockGet.mockImplementationOnce(() => {
        if (requestErrorCallback) {
          return requestErrorCallback(mockError);
        }
        return Promise.reject(mockError);
      });

      await expect(axiosInstance.get('/test')).rejects.toThrow('Request failed');
    });
  });

  describe('Response Interceptor', () => {
    it('passes through response in response interceptor', async () => {
      const mockResponse = {
        data: { message: 'Success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      } as AxiosResponse;

      mockGet.mockResolvedValueOnce(mockResponse);
      const result = await axiosInstance.get('/test');
      expect(result).toEqual(mockResponse);
    });

    it('handles network errors in response error handler', async () => {
      const mockError = new Error('Network Error');
      vi.mocked(isNetworkError).mockReturnValue(true);
      vi.mocked(getErrorDetails).mockReturnValue({
        message: 'Network Error',
        type: 'network',
        details: 'Connection failed',
      });

      // Simulate response error through the interceptor
      mockGet.mockImplementationOnce(() => {
        if (responseErrorCallback) {
          return responseErrorCallback(mockError);
        }
        return Promise.reject(mockError);
      });

      let thrownError: unknown;
      try {
        await axiosInstance.get('/test');
        expect.fail('Expected error to be thrown');
      } catch (error) {
        thrownError = error;
      }

      expect((thrownError as { name: string }).name).toBe('APIError');
      expect((thrownError as { message: string }).message).toBe('Network Error');
      expect((thrownError as { data: unknown }).data).toEqual({
        message: 'Network Error',
        type: 'network',
        details: 'Connection failed',
      });

      expect(isNetworkError).toHaveBeenCalledWith(mockError);
      expect(getErrorDetails).toHaveBeenCalledWith(mockError);
    });

    it('handles timeout errors in response error handler', async () => {
      const mockError = new Error('timeout') as Error & { code?: string };
      mockError.code = 'ECONNABORTED';
      vi.mocked(getErrorDetails).mockReturnValue({
        message: 'Request timed out',
        type: 'timeout',
        details: 'The server is taking too long to respond',
      });

      // Simulate response error through the interceptor
      mockGet.mockImplementationOnce(() => {
        if (responseErrorCallback) {
          return responseErrorCallback(mockError);
        }
        return Promise.reject(mockError);
      });

      let thrownError: unknown;
      try {
        await axiosInstance.get('/test');
        expect.fail('Expected error to be thrown');
      } catch (error) {
        thrownError = error;
      }

      expect((thrownError as { name: string }).name).toBe('APIError');
      expect((thrownError as { message: string }).message).toBe('Request timed out');
      expect((thrownError as { data: unknown }).data).toEqual({
        message: 'Request timed out',
        type: 'timeout',
        details: 'The server is taking too long to respond',
      });

      expect(getErrorDetails).toHaveBeenCalledWith(mockError);
    });
  });

  describe('HTTP Methods with Timeout', () => {
    const mockResponse = { data: { message: 'Success' } };
    const url = '/test';
    const config = { timeout: 5000 };

    beforeEach(() => {
      mockGet.mockResolvedValue(mockResponse);
      mockPost.mockResolvedValue(mockResponse);
      mockPut.mockResolvedValue(mockResponse);
      mockDelete.mockResolvedValue(mockResponse);
    });

    it('applies timeout to GET requests', async () => {
      await axiosInstance.get(url, config);
      expect(mockGet).toHaveBeenCalledWith(url, config);
    });

    it('applies timeout to POST requests', async () => {
      const data = { key: 'value' };
      await axiosInstance.post(url, data, config);
      expect(mockPost).toHaveBeenCalledWith(url, data, config);
    });

    it('applies timeout to PUT requests', async () => {
      const data = { key: 'value' };
      await axiosInstance.put(url, data, config);
      expect(mockPut).toHaveBeenCalledWith(url, data, config);
    });

    it('applies timeout to DELETE requests', async () => {
      await axiosInstance.delete(url, config);
      expect(mockDelete).toHaveBeenCalledWith(url, config);
    });
  });
});
