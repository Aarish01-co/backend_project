import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(config.mongoURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Database connected to MongoDB Atlas successfully");
  } catch (error) {
    if (process.env.VERCEL || config.nodeEnv === "production") {
      console.error("MongoDB Atlas connection error on production:", error.message);
      throw error;
    }

    console.warn("MongoDB Atlas connection failed. Starting local in-memory database fallback...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log("Database connected to local in-memory MongoDB fallback");
    } catch (fallbackError) {
      console.error("Database connection failure:", fallbackError.message);
      throw fallbackError;
    }
  }
};

export default connectDB;
