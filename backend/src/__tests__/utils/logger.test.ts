import { logger } from '../../utils/logger';

describe('Logger', () => {
  let mockConsoleLog: jest.SpyInstance;

  beforeEach(() => {
    // Create a spy on console.log
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the original console.log and clear all mocks
    mockConsoleLog.mockRestore();
    jest.clearAllMocks();
  });

  it('should log info messages', () => {
    // Arrange
    const mockMessage = 'Test message';

    // Act
    logger.info(mockMessage);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\]: Test message/)
    );
  });

  it('should log error messages', () => {
    // Arrange
    const mockError = 'Test error';

    // Act
    logger.error(mockError);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\]: Test error/)
    );
  });

  it('should log warning messages', () => {
    // Arrange
    const mockWarning = 'Test warning';

    // Act
    logger.warn(mockWarning);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[WARN\]: Test warning/)
    );
  });

  it('should handle Error objects in error log', () => {
    // Arrange
    const mockError = new Error('Test error');

    // Act
    logger.error(mockError);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[ERROR\]: Test error/)
    );
  });

  it('should handle undefined messages', () => {
    // Arrange & Act
    logger.info(undefined);

    // Assert
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[INFO\]: undefined/)
    );
  });
});
