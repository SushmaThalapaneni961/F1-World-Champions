export class APIError extends Error {
    status?: number;
    data?: any;
  
    constructor(message: string, status?: number, data?: any) {
      super(message);
      this.name = 'APIError';
      this.status = status;
      this.data = data;
    }
  }
  
  export const handleApiError = (error: unknown): APIError => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      const message =
        axiosError.response?.data?.message || axiosError.message || 'Unknown error';
      return new APIError(message, axiosError.response?.status, axiosError.response?.data);
    }
  
    if (error instanceof Error) {
      return new APIError(error.message);
    }
  
    return new APIError('Unexpected error');
  };
  