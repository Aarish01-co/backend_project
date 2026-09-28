import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI:
    process.env.MONGO_URI ||
    "mongodb+srv://aarishalikhan099_db_user:Aarish2005a@cluster0.bs119gv.mongodb.net/ecommerce_db",
  accessTokenSecret:
    process.env.ACCESS_TOKEN_SECRET ||
    process.env.ACCESS_TOKEN ||
    "66e5854d3099b637dc5cfea6925ddc8d6fc6eb735affd602a47f9f479c329b81",
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET ||
    process.env.REFRESH_TOKEN ||
    "1ccf0ae04d41d8b5f52e5c9134239b88adbd63cbc2ca947145f8c2bdfee414ef",
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173"
};

export default config;