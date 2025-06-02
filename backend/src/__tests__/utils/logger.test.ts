import { logger } from '../../utils/logger';

describe('Logger', () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsole.log;
    jest.clearAllMocks();
  });

  it('should log info messages', () => {
    // Arrange
    const mockMessage = 'Test message';

    // Act
    logger.info(mockMessage);

    // Assert
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining(mockMessage));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[INFO]'));
  });

  it('should log error messages', () => {
    // Arrange
    const mockError = 'Test error';

    // Act
    logger.error(mockError);

    // Assert
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining(mockError));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
  });

  it('should log warning messages', () => {
    // Arrange
    const mockWarning = 'Test warning';

    // Act
    logger.warn(mockWarning);

    // Assert
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining(mockWarning));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[WARN]'));
  });

  it('should handle Error objects in error log', () => {
    // Arrange
    const mockError = new Error('Test error');

    // Act
    logger.error(mockError);

    // Assert
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test error'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
  });

  it('should handle undefined messages', () => {
    // Arrange & Act
    logger.info(undefined as any);

    // Assert
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('undefined'));
  });
});
