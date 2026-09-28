import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "../config/config.js";
import authRouter from "../routes/auth.routes.js";
import productRouter from "../routes/product.routes.js";

const app = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

export default app;