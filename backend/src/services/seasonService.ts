import Season from "../models/season.model";

export const getAllSeasonsFromDb = async () => {
  return await Season.find().sort({ season: -1 });
};