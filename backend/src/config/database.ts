import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { withRetry } from '../utils/retry';

export const connectDB = async (uri: string) => {
  try {
    logger.info(`Connecting to MongoDB at ${uri}`);

    await withRetry(() => mongoose.connect(uri), 'MongoDB connection');

    logger.info('MongoDB connected');
  } catch (err: any) {
    logger.error(`MongoDB connection failed: ${err.message}`);
    // Exit the process if unable to connect to the database
    process.exit(1);
  }

  // Monitor database connection status
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};
