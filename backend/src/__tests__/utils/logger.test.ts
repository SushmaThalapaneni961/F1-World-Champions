import { logger } from '../../utils/logger';

describe('Logger', () => {
  const originalConsole = { ...console };
  const mockMessage = 'Test message';
  const mockError = new Error('Test error');

  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.info = originalConsole.info;
  });

  it('should log info messages', () => {
    // Act
    logger.info(mockMessage);

    // Assert
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining(mockMessage));
  });

  it('should log error messages', () => {
    // Act
    logger.error(mockError.message);

    // Assert
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(mockError.message));
  });

  it('should log warning messages', () => {
    // Act
    logger.warn(mockMessage);

    // Assert
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining(mockMessage));
  });

  it('should handle non-Error objects in error log', () => {
    // Arrange
    const errorMessage = 'Custom error object';

    // Act
    logger.error(errorMessage);

    // Assert
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
  });

  it('should handle undefined messages', () => {
    // Act
    logger.info('undefined');
    logger.error('undefined');
    logger.warn('undefined');

    // Assert
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('undefined'));
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('undefined'));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('undefined'));
  });
}); 