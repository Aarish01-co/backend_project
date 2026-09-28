import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Database connected to MongoDB Atlas successfully");
  } catch (error) {
    console.warn("MongoDB Atlas connection failed. Starting in-memory database fallback...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log("Database connected to local in-memory MongoDB fallback");
    } catch (fallbackError) {
      console.error("Database connection failure:", fallbackError.message);
    }
  }
};

export default connectDB;
