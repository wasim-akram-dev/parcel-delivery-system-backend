/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Successfully connected to Database!");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listening on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startServer();
})();

//3. HANDLE : Signal Termination (SIGTERM) [If cloud server service provider send signal for stop the server]
process.on("SIGTERM", () => {
  console.log("SIGTERM Signal Received! Server is Shutting Down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// CHECKING WAY : Signal Termination (SIGTERM)
//

//4. HANDLE : Signal Initialize (SIGINT) [If we are manually want to stop the server with gracefully]
process.on("SIGINT", () => {
  console.log("SIGINT Signal Received! Server is Shutting Down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// CHECKING WAY : Signal INT (SIGINT)
//

//1. HANDLE : Unhandled Rejection Error
process.on("unhandledRejection", (error) => {
  console.log(
    "Unhandled Rejection Detected! Server is Shutting Down...",
    error
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// CHECKING WAY : Unhandled Rejection Error
// Promise.reject(new Error("I forgot to catch this promise"));

//2. HANDLE : Uncaught Exception Error
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected! Server is Shutting Down...", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// CHECKING WAY : Uncaught Exception Error
// throw new Error("I forgot to handle this local development code error");
