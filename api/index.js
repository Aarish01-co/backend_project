import app from "../server/src/app/app.js";
import connectDB from "../server/src/config/db.js";

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
