import { Response } from 'express';
import { sendSuccess, sendError } from '../../utils/response';
import { mockResponse } from './testUtils';

describe('Response Utilities', () => {
  let res: Response;

  beforeEach(() => {
    res = mockResponse();
  });

  describe('sendSuccess', () => {
    it('should send success response with default values', () => {
      const data = { test: 'data' };

      sendSuccess(res, data);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        message: 'Success',
        data,
      });
    });

    it('should send success response with custom message and status code', () => {
      const data = { test: 'data' };
      const message = 'Custom success';
      const statusCode = 201;

      sendSuccess(res, data, message, statusCode);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode,
        message,
        data,
      });
    });

    it('should handle null data', () => {
      sendSuccess(res, null);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode: 200,
        message: 'Success',
        data: null,
      });
    });
  });

  describe('sendError', () => {
    it('should send error response with default values', () => {
      sendError(res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 500,
        message: 'Something went wrong',
      });
    });

    it('should send error response with custom message and status code', () => {
      const message = 'Custom error';
      const statusCode = 400;

      sendError(res, message, statusCode);

      expect(res.status).toHaveBeenCalledWith(statusCode);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode,
        message,
      });
    });

    it('should handle empty message', () => {
      sendError(res, '');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode: 500,
        message: '',
      });
    });
  });
});
