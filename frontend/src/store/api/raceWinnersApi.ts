import { API_ROUTES } from '../../lib/api/api';
import axiosInstance from '../../lib/api/axiosSetup';
import { APIError } from '../../lib/api/errorHandler';
import { getErrorDetails } from '../../utils/errorHandling';
import type ApiResponse from '../models/apiResponse.model';
import type { IRaceWinner } from '../types/raceWinners.types';

export const getRaceWinners = async (season: string): Promise<IRaceWinner[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<IRaceWinner[]>>(API_ROUTES.RACE_WINNERS(season), {
      timeout: 10000 // 10 second timeout for this specific endpoint
    });
    return response.data.data || [];  // Return empty array if data is undefined
  } catch (error) {
    const details = getErrorDetails(error instanceof Error ? error : new Error('Unknown error'));
    throw new APIError(details.message, undefined, details.details);
  }
};
