import Season from '../models/season.model';
import { ISeason } from '../types/season.types';

export const getAllSeasonsFromDb = async (): Promise<ISeason[]> => {
  return await Season.find().sort({ season: -1 }); // Sort by season in descending order (most recent first)
};
