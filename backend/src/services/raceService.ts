import Race from '../models/race.model';
import { IRace } from '../types/race.types';

export const getRacesBySeasonFromDb = async (season: string): Promise<IRace[]> => {
  return await Race.find({ season }).sort({ round: 1 });
};
