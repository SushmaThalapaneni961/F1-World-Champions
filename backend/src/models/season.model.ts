import mongoose, { Schema, Model } from 'mongoose';
import { ISeason } from '../types/season.types';

const SeasonSchema = new Schema<ISeason>({
  season: { type: String, required: true, unique: true },
  champion: {
    givenName: String,
    familyName: String,
    fullName: String,
    nationality: String,
  },
});

const Season =
  (mongoose.models.Season as Model<ISeason>) || mongoose.model<ISeason>('Season', SeasonSchema);
export default Season;
