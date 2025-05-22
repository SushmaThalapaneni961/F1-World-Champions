import { Request, Response } from 'express';
import Season from '../models/season.model';
import { fetchAndStoreSeasons } from '../services/seasonService';

export const getAllSeasons = async (req: Request, res: Response) => {
  try {
    let seasons = await Season.find();
    // Not in DB → Fetch from Ergast API
    if (seasons.length === 0) {
      await fetchAndStoreSeasons();
      seasons = await Season.find();
    }
    console.log(seasons, "sesasons")
    // Found in DB → Return to frontend
     res.status(200).json(seasons);

  } catch (error: any) {
    console.error('getAllSeasons error:', error.message);
    res.status(500).json({ error: error?.message ?? 'Failed to get seasons' });
  }
};