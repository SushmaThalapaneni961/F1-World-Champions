import { createClient } from 'redis';
import { logger } from '../utils/logger';
import { withRetry } from '../utils/retry';

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || '6379';

const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

redisClient.on('error', (err: any) => {
  logger.error(`Redis Client Error: ${err.message}`);
});

const connectRedis = async () => {
  await withRetry(() => redisClient.connect(), 'Redis connection');
  logger.info('Redis connected successfully');
};
connectRedis();

export default redisClient;
