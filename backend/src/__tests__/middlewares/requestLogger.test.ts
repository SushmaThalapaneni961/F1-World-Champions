import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../../middlewares/requestLogger';
import { logger } from '../../utils/logger';

jest.mock('../../utils/logger');

describe('Request Logger Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
    };
    mockRes = {};
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should log request details', () => {
    // Act
    requestLogger(mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`${mockReq.method} ${mockReq.originalUrl}`),
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle requests without IP address', () => {
    // Arrange
    const reqWithoutIp = { method: 'GET', originalUrl: '/test' };

    // Act
    requestLogger(reqWithoutIp as Request, mockRes as Response, mockNext);

    // Assert
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`${reqWithoutIp.method} ${reqWithoutIp.originalUrl}`),
    );
    expect(mockNext).toHaveBeenCalled();
  });
}); 