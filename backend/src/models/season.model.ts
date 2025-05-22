import mongoose, { model, Model, Schema } from "mongoose";

interface ISeason extends Document {
  season: string; // Use number to match schema
  url: string;
  year: number;
}


const seasonSchema = new Schema<ISeason>({
  season: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  year: { type: Number, required: true, unique: true },
});

const Season: Model<ISeason> = model<ISeason>('Season', seasonSchema);
export default Season;