import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || process.env.REFRESH_TOKEN,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

export default config;