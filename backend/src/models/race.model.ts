import mongoose, { Schema, Document } from 'mongoose';
import { IRace } from '../types/race.types';

interface IRaceDoc extends IRace, Document {}

const RaceSchema: Schema = new Schema({
  season: { type: String, required: true },
  round: { type: String, required: true },
  raceName: { type: String, required: true },
  date: { type: String, required: true },
  circuit: {
    name: String,
    locality: String,
    country: String,
  },
  winner: {
    driverId: { type: String, required: true },
    givenName: String,
    familyName: String,
    fullName: String,
    nationality: String,
    laps: String,
    time: String,
  },
});

export default mongoose.models.Race || mongoose.model<IRaceDoc>('Race', RaceSchema);
