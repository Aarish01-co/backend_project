import app from "../server/src/app/app.js";
import connectDB from "../server/src/config/db.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Database connection failed. Please verify environment variables on Vercel.",
      error: error.message
    });
  }
}
