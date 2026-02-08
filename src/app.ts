import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { morganStream } from "./config/logger";
import { globalErrorHandler } from "./middlewares/errorMiddleware";
import { AppError } from "./utils/AppError";

const app = express();

// Security HTTP headers
app.use(helmet());

// HTTP request logging via Morgan -> Winston
const morganFormat = process.env.NODE_ENV === "development" ? "dev" : "combined";
app.use(morgan(morganFormat, { stream: morganStream }));

// Body parser
app.use(express.json({ limit: "10kb" }));

// CORS
app.use(cors());

// Routes
// app.use('/api/v1/users', userRouter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Handle undefined routes
app.all("/{*splat}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
