"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Successfully connected to Database!");
        server = app_1.default.listen(env_1.envVars.PORT, () => {
            console.log(`Server is listening on port ${env_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
}))();
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
    console.log("Unhandled Rejection Detected! Server is Shutting Down...", error);
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
