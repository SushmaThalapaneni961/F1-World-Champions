import { Response } from 'express';
import { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { IRace } from '../../types/race.types';
import Race from '../../models/race.model';

let mongoServer: MongoMemoryServer | null = null;

// Mock response object for controller tests
export const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Database test helpers
export const connectTestDb = async () => {
  try {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create({
        instance: {
          port: 27019,
          dbName: 'f1_test'
        },
        binary: {
          version: '6.0.12'
        }
      });
    }
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
};

export const disconnectTestDb = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
  } catch (error) {
    console.error('Failed to disconnect test database:', error);
    throw error;
  }
};

export const clearTestDb = async () => {
  if (!mongoose.connection.db) {
    throw new Error('No database connection');
  }
  try {
    await Promise.all([
      Race.deleteMany({}),
      // Add other model cleanups here if needed
    ]);
  } catch (error) {
    console.error('Failed to clear test database:', error);
    throw error;
  }
};

// Mock model factory
export const createMockModel = <T>(mockData: Partial<T>[] = []): Model<T> => {
  const mockModel = {
    find: jest.fn().mockResolvedValue(mockData),
    findOne: jest.fn().mockResolvedValue(mockData[0] || null),
    findById: jest.fn().mockResolvedValue(mockData[0] || null),
    create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
  };
  return mockModel as unknown as Model<T>;
};

// Common test data generators
export const generateMockRace = (overrides: Partial<IRace> = {}): IRace => {
  return {
    season: '2023',
    round: '1',
    raceName: 'Test Grand Prix',
    date: '2023-03-05',
    circuit: {
      name: 'Test Circuit',
      locality: 'Test City',
      country: 'Test Country',
    },
    winner: {
      driverId: 'test_driver',
      givenName: 'Test',
      familyName: 'Driver',
      fullName: 'Test Driver',
      nationality: 'Test Nationality',
      laps: '50',
      time: '1:30:00.000',
    },
    ...overrides,
  };
};

export const generateMockRaceData = (overrides = {}) => ({
  season: '2023',
  round: '1',
  raceName: 'Test Grand Prix',
  date: '2023-03-05',
  circuit: {
    name: 'Test Circuit',
    locality: 'Test City',
    country: 'Test Country',
  },
  winner: {
    driverId: 'test_driver',
    fullName: 'Test Driver',
    nationality: 'Test Nation',
    laps: '50',
    time: '1:30:00.000',
  },
  ...overrides,
});
