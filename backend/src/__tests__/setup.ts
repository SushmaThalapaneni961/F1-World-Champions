import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  // Create binary directory if it doesn't exist
  const mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '6.0.12',
      downloadDir: './.cache/mongodb-binaries',
      platform: process.platform,
      arch: process.arch
    },
  });
  await mongoServer.stop();
} 