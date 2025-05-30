import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
  createMockModel,
  generateMockRace
} from '../../utils/testUtils';
import { IRace } from '../../types/race.types';

jest.setTimeout(60000); // Increase timeout for MongoDB operations

describe('Test Utilities', () => {
  describe('Database test helpers', () => {
    beforeAll(async () => {
      await connectTestDb();
    });

    afterAll(async () => {
      await disconnectTestDb();
    });

    beforeEach(async () => {
      await clearTestDb();
    });

    afterEach(async () => {
      await clearTestDb();
    });

    it('should connect to test database', async () => {
      // Assert
      expect(mongoose.connection.readyState).toBe(1);
    });

    it('should clear test database', async () => {
      // Arrange
      const TestModel = createMockModel('Test', new mongoose.Schema({ name: String }));
      await TestModel.create({ name: 'test' });

      // Act
      await clearTestDb();

      // Assert
      const count = await TestModel.countDocuments();
      expect(count).toBe(0);
    });

    it('should verify database disconnection', async () => {
      // Act
      await disconnectTestDb();

      // Assert
      expect(mongoose.connection.readyState).toBe(0);

      // Reconnect for remaining tests
      await connectTestDb();
    });

    it('should handle errors when clearing database', async () => {
      // Arrange
      const originalConsoleError = console.error;
      console.error = jest.fn();
      const mockError = new Error('Test error');
      
      // Mock the collections property to throw an error
      const originalCollections = mongoose.connection.collections;
      Object.defineProperty(mongoose.connection, 'collections', {
        get: () => { throw mockError; },
        configurable: true
      });

      // Act & Assert
      await expect(clearTestDb()).rejects.toThrow('Test error');

      // Cleanup
      console.error = originalConsoleError;
      Object.defineProperty(mongoose.connection, 'collections', {
        value: originalCollections,
        configurable: true
      });
    });
  });

  describe('Mock Data Generators', () => {
    it('should generate mock race data', () => {
      // Act
      const mockRace = generateMockRace();

      // Assert
      expect(mockRace).toHaveProperty('season');
      expect(mockRace).toHaveProperty('round');
      expect(mockRace).toHaveProperty('raceName');
      expect(mockRace).toHaveProperty('date');
      expect(mockRace).toHaveProperty('circuit');
      expect(mockRace).toHaveProperty('winner');
    });

    it('should allow overriding mock race data', () => {
      // Arrange
      const overrides: Partial<IRace> = {
        season: '2024',
        raceName: 'Custom Grand Prix',
        winner: {
          driverId: 'custom_driver',
          givenName: 'Custom',
          familyName: 'Driver',
          fullName: 'Custom Driver',
          nationality: 'Custom Nationality',
          laps: '60',
          time: '1:45:00.000'
        }
      };

      // Act
      const mockRace = generateMockRace(overrides);

      // Assert
      expect(mockRace.season).toBe('2024');
      expect(mockRace.raceName).toBe('Custom Grand Prix');
      expect(mockRace.winner).toEqual(overrides.winner);
    });
  });
}); 