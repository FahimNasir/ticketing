import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

jest.mock("../nats-wrapper");
process.env.STRIPE_KEY =
  "sk_test_51KU7B2FAw7KhUXe817m2DrbfnfKinRxNm2yCFAK65IMYNy3HItW4mL9TiMBWK8oSEPuQXwayROaZXz1LiuqZ891f00qulWwQlB";
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
