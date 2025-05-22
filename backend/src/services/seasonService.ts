import axios from 'axios';
import Season from '../models/season.model';

export const fetchAndStoreSeasons = async () => {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 20;
    const offset = startYear - 1950;
    const limit = currentYear - startYear + 1;

    const response = await axios.get(
      `https://api.jolpi.ca/ergast/f1/seasons/?limit=${limit}&offset=${offset}`
    );

    const seasons = response?.data?.MRData?.SeasonTable?.Seasons ?? [];

    const cleanedSeasons = seasons.map((s: any) => ({
      season: s.season.toString(),
      url: s.url,
      year: parseInt(s.season),
    }));

    try {
      console.log(cleanedSeasons, "cleanedSeasons");
      await Season.deleteMany({});
      const result = await Season.insertMany(cleanedSeasons, { ordered: false });
      console.log(`Inserted ${result.length} seasons into DB.`);
    } catch (err) {
      console.error('Error inserting into DB:', err);
      throw err;
    }
  } catch (error: any) {
    console.error('Error in fetchAndStoreSeasons:', error.message);
    throw error;
  }
};
