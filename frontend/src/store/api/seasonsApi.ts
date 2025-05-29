import apiClient from "../../lib/api/axiosSetup";
import { handleApiError } from "../../lib/api/errorHandler";
import { ApiResponse } from "../models";
import { ISeason } from "../types";

// export const getSeasons = async () => {
//   try {
//     const response = await apiClient.get('/seasons'); // Use the endpoint relative to the base URL
//     return response.data;
//   } catch (error) {
//     // Handle error if necessary
//     throw error; // Or use your error handler here
//   }
// };

export const getSeasons = async (): Promise<ISeason[]> => {
  try {
    const response = await apiClient.get<ApiResponse<ISeason[]>>(`/seasons`);
    return response?.data?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};