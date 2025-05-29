
import { RETRY_CONFIG } from '../constants/external';
import { logger } from './logger';

export const withRetry = async <T>(
  fn: () => Promise<T>,
  context: string,
  maxAttempts = RETRY_CONFIG.MAX_ATTEMPTS,
  delayMs = RETRY_CONFIG.DELAY_MS
): Promise<T> => {
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      logger.warn(`[Retry] Attempt ${attempt} failed in ${context}: ${err.message}`);
      if (attempt >= maxAttempts) {
        logger.error(`[Retry] Max attempts reached for ${context}`);
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(`Failed in ${context} after ${maxAttempts} attempts`);
};
