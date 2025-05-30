import apiClient from '../../lib/api/axiosSetup';
import { handleApiError } from '../../lib/api/errorHandler';
import type { ApiResponse } from '../models';
import type { IRaceWinner } from '../types';

export const getRacesBySeason = async (season: string): Promise<IRaceWinner[]> => {
  try {
    const response = await apiClient.get<ApiResponse<IRaceWinner[]>>(`/seasons/${season}/races`);
    return response?.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
