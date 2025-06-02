import { Response } from 'express';
import { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { IRace } from '../../types/race.types';

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
          port: 27018,
          dbName: 'testdb',
        },
        binary: {
          version: '4.4.0',
        },
      });
    }
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error('Failed to connect to test database:', err);
    throw err;
  }
};

export const disconnectTestDb = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop({ doCleanup: true, force: true });
      mongoServer = null;
    }
  } catch (err) {
    console.error('Failed to disconnect from test database:', err);
    throw err;
  }
};

export const clearTestDb = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectTestDb();
    }
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (err) {
    console.error('Failed to clear test database:', err);
    throw err;
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
