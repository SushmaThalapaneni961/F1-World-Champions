import { Response } from 'express';

export const sendSuccess = (res: Response, data: any, message = 'Success', statusCode = 200) => {
  return void res.status(statusCode).json({
    status: 'success',
    statusCode,
    message,
    data,
  });
};

export const sendError = (res: Response, message = 'Something went wrong', statusCode = 500) => {
  return void res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
