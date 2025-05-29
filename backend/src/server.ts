import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/f1' || '';

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});