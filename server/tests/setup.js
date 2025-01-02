const path = require('path');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../.env.test') });

let mongod;

beforeAll(async () => {
  // Create an instance of MongoMemoryServer
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // Clear all collections before each test
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // Clean up after tests
  await mongoose.connection.close();
  await mongod.stop();
});
