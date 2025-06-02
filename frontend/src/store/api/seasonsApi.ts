
import { API_ROUTES } from '../../lib/api/api';
import axiosInstance from '../../lib/api/axiosSetup';
import { APIError } from '../../lib/api/errorHandler';
import { getErrorDetails } from '../../utils/errorHandling';
import type ApiResponse from '../models/apiResponse.model';
import type { ISeason } from '../types/season.types';

export const getSeasons = async (): Promise<ISeason[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<ISeason[]>>(API_ROUTES.SEASONS, {
      timeout: 10000 // 10 second timeout for this specific endpoint
    });
    return response?.data?.data;
  } catch (error) {
    const details = getErrorDetails(error instanceof Error ? error : new Error('Unknown error'));
    throw new APIError(details.message, undefined, details.details);
  }
};
