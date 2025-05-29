import axios from 'axios';
import { StaticDomainApi } from './helperApi';  // Import StaticDomainApi to get the base URL

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: StaticDomainApi.getUrl() || 'http://localhost:5001/api', // Use the URL from StaticDomainApi
});

// Set up request interceptors (Optional, can be removed or extended)
axiosInstance.interceptors.request.use(
  (config) => {
    // Any request-related logic (headers, tokens, etc.)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up response interceptors (Error handling and logic)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorStatusCode = error.status || error.response?.status || null;
    let errorMessage = 'An error occurred';
    
    if (error.response) {
      errorMessage =
        error.response?.data?.errorCode === 'VALIDATION_ERROR'
          ? (error.response?.data?.detailedError || [])
              .map(
                (err: { target: any; message: any }) =>
                  `${err.target}: ${err.message}`
              )
              .join('\n')
          : error.response?.data?.detailedError?.[0]?.message ||
            error.response?.data?.message ||
            'An error occurred';

      console.error('Error occurred:', errorMessage);
    } else if (error.request) {
      errorMessage = 'No response received';
      console.error('Error occurred: No response received');
    } else {
      errorMessage = error.message;
      console.error('Error occurred:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
