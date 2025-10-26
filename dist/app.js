"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const notFound_1 = require("./middlewares/notFound");
// import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
// import { router } from "./app/routes";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// app.use("/api/v1", router);
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery System Backend!",
    });
});
// app.use(globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
