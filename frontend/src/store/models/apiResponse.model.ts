export interface ApiResponse<T> {
    status: string; // e.g., 'success', 'error'
    statusCode: number;
    data: T;
    message?: string;
  }
  
// Default export for better module resolution
export type { ApiResponse as default };