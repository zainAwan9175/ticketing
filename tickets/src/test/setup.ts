import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = process.env.JWT_KEY ?? 'test_jwt_key';

  // Create in-memory MongoDB server
  mongo = await MongoMemoryServer.create();

  // Get connection URI
  const mongoUri = mongo.getUri();

  // Connect mongoose to fake database
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  // Get all collections from database
  const collections = await mongoose.connection.db!.collections();

  // Delete all documents from every collection
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Close mongoose connection
  await mongoose.disconnect();

  // Stop in-memory MongoDB server
  await mongo.stop();
}, 20000);