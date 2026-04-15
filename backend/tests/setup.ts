import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { jest, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test timeout to 30 seconds
jest.setTimeout(30000);

// MongoDB Memory Server instance
let mongoServer: MongoMemoryServer;

// Extend the NodeJS namespace to include the global test variables
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __MONGO_URI__: string;
      __MONGO_DB_NAME__: string;
    }
  }
}

// Create a type for the global object to avoid TypeScript errors
interface TestGlobal extends NodeJS.Global {
  __MONGO_URI__: string;
  __MONGO_DB_NAME__: string;
}

declare const global: TestGlobal;

// Connect to the in-memory database before tests run
beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Set the MongoDB URI for global access if needed
    global.__MONGO_URI__ = mongoUri;
    global.__MONGO_DB_NAME__ = 'testdb';
    
    await mongoose.connect(mongoUri, {
      dbName: global.__MONGO_DB_NAME__,
    });
  } catch (error) {
    console.error('Error setting up in-memory MongoDB:', error);
    throw error;
  }
});

// Clear all test data after each test
beforeEach(async () => {
  try {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error('Error cleaning up test data:', error);
    throw error;
  }
});

// Disconnect and close the database and server after all tests are done
afterAll(async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  }
});

// Export the test setup for use in other test files
export {};
