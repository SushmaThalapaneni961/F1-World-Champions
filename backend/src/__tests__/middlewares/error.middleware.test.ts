import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../../middlewares/errorHandler';
import { mockResponse } from '../utils/testUtils';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = mockResponse();
    mockNext = jest.fn();
  });

  it('should handle standard Error objects', () => {
    // Arrange
    const error = new Error('Test error');

    // Act
    errorHandler(error, mockReq as Request, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Test error'
    });
  });

  it('should handle errors with custom status codes', () => {
    // Arrange
    const error = new Error('Not Found');
    (error as any).statusCode = 404;

    // Act
    errorHandler(error, mockReq as Request, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 404,
      message: 'Not Found'
    });
  });

  it('should handle errors with custom status', () => {
    // Arrange
    const error = new Error('Bad Request');
    (error as any).statusCode = 400;

    // Act
    errorHandler(error, mockReq as Request, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 400,
      message: 'Bad Request'
    });
  });

  it('should handle non-Error objects', () => {
    // Arrange
    const error = { message: 'Custom error object' };

    // Act
    errorHandler(error as Error, mockReq as Request, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Custom error object'
    });
  });

  it('should provide default message for errors without message', () => {
    // Arrange
    const error = {};

    // Act
    errorHandler(error as Error, mockReq as Request, mockRes, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error'
    });
  });
}); 