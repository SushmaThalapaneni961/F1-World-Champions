import { Response } from 'express';
import { Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { IRace } from '../../types/race.types';

// Mock response object for controller tests
export const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Database test helpers
export const connectTestDb = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  return mongoServer;
};

export const closeTestDb = async (mongoServer: MongoMemoryServer) => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

export const clearTestDb = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
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
export const generateMockRace = (overrides = {}): IRace => ({
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
    nationality: 'Test Nation',
    laps: '58',
    time: '1:30:00.000',
  },
  ...overrides,
});
