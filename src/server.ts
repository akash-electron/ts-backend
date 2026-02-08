import app from "./app";
import { env } from "./config/env";

const port = env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${port}`);
});

// Handle unhandled rejections
process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: any) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
