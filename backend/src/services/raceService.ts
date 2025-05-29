import Race from '../models/race.model';

export const getRacesBySeasonFromDb = async (season: string) => {
  return await Race.find({ season }).sort({ round: 1 });
};