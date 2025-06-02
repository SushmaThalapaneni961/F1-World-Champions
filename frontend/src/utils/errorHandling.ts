import { AxiosError } from 'axios';

export interface IErrorDetails {
  message: string;
  type: string;
  details: string;
}

export class APIError extends Error {
  type: string;
  details: string;

  constructor(message: string, type = 'api', details = '') {
    super(message);
    this.type = type;
    this.details = details;
  }
}

export const isNetworkError = (error: Error): boolean => {
  if (error instanceof APIError) {
    return false;
  }

  const axiosError = error as AxiosError;
  return !!(
    !window.navigator.onLine ||
    error.message.includes('Network Error') ||
    axiosError.message === 'Failed to fetch' ||
    axiosError.code === 'ERR_NETWORK'
  );
};

export const getErrorDetails = (error: Error): IErrorDetails => {
  if (error instanceof APIError) {
    return {
      message: error.message,
      type: error.type,
      details: error.details,
    };
  }

  const axiosError = error as AxiosError;
  if (axiosError.code === 'ECONNABORTED') {
    return {
      message: 'Request timed out',
      type: 'timeout',
      details: 'The server is taking too long to respond. Please try again',
    };
  }

  if (isNetworkError(error)) {
    return {
      message: 'Unable to connect to the server',
      type: 'network',
      details: 'Please check your internet connection and try again',
    };
  }

  return {
    message: 'Unknown error',
    type: 'unknown',
    details: 'Please try again or contact support if the problem persists',
  };
};

export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
};
