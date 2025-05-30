import apiClient from "../../lib/api/axiosSetup";
import { handleApiError } from "../../lib/api/errorHandler";
import type ApiResponse from "../models/apiResponse.model";
import type { ISeason } from "../types/season.types";

export const getSeasons = async (): Promise<ISeason[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ISeason[]>>(`/seasons`);
    return response?.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};