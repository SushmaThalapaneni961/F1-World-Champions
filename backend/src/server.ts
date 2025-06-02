import app from './app';
import { connectDB } from './config/database';
import dotenv from 'dotenv';
import { logger } from './utils/logger';

dotenv.config();

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/f1' || '';

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
});
