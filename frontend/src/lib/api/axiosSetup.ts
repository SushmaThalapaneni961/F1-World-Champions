import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { StaticDomainApi } from './helperApi'; // Import StaticDomainApi to get the base URL
import { isNetworkError, getErrorDetails, withTimeout } from '../../utils/errorHandling';
import { APIError } from './errorHandler';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: StaticDomainApi.getUrl() || 'http://localhost:5001/api', // Use the URL from StaticDomainApi
});

// Default timeout duration (30 seconds)
const DEFAULT_TIMEOUT = 30000;

// Set up request interceptors (Optional, can be removed or extended)
axiosInstance.interceptors.request.use(
  (config) => {
    // Any request-related logic (headers, tokens, etc.)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Set up response interceptors with enhanced error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for network errors first
    if (isNetworkError(error)) {
      const details = getErrorDetails(error);
      return Promise.reject(new APIError(details.message, undefined, details));
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      const details = getErrorDetails(error);
      return Promise.reject(new APIError(details.message, undefined, details));
    }

    // Handle other errors
    const errorDetails = getErrorDetails(error);
    const errorMessage = errorDetails.message || 'An error occurred';

    if (error.response) {
      console.error('API Error:', errorMessage);
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
    }

    return Promise.reject(new APIError(errorMessage, error.response?.status, errorDetails));
  },
);

// Wrap axios methods with timeout
const originalGet = axiosInstance.get;
axiosInstance.get = function get<T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<R> {
  return withTimeout(
    originalGet.call(this, url, config),
    config?.timeout || DEFAULT_TIMEOUT,
  ) as Promise<R>;
};

const originalPost = axiosInstance.post;
axiosInstance.post = function post<T = any, R = AxiosResponse<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<R> {
  return withTimeout(
    originalPost.call(this, url, data, config),
    config?.timeout || DEFAULT_TIMEOUT,
  ) as Promise<R>;
};

const originalPut = axiosInstance.put;
axiosInstance.put = function put<T = any, R = AxiosResponse<T>>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<R> {
  return withTimeout(
    originalPut.call(this, url, data, config),
    config?.timeout || DEFAULT_TIMEOUT,
  ) as Promise<R>;
};

const originalDelete = axiosInstance.delete;
axiosInstance.delete = function del<T = any, R = AxiosResponse<T>>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<R> {
  return withTimeout(
    originalDelete.call(this, url, config),
    config?.timeout || DEFAULT_TIMEOUT,
  ) as Promise<R>;
};

export default axiosInstance;
