import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(`[Error]: ${err.stack || err.message || err}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return void sendError(res, message, statusCode);
};
