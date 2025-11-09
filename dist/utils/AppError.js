"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// utils/AppError.ts
class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        // Only because we are extending a built-in class
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
