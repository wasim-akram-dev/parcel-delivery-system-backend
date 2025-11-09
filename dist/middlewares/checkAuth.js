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
exports.checkAuth = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const AppError_1 = __importDefault(require("../utils/AppError"));
const jwt_1 = require("../utils/jwt");
// verify token n roles
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = req.headers.authorization || req.cookies.accessToken;
        console.log("accesstoken", accessToken);
        if (!accessToken) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "no token recieved, login first!");
        }
        const verificationToken = (0, jwt_1.VerifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
        // console.log("verificationToken", verificationToken);
        // console.log("authRoles", authRoles);
        // check if the user is BLOCKED OR INACTIVE NOW
        const decoded = jsonwebtoken_1.default.decode(accessToken, { complete: true });
        if (decoded.payload.isActive === "BLOCKED") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Failed, this user is ${decoded.payload.isActive} now`);
        }
        // console.log('verificationToken', verificationToken);
        // console.log('authRoles', authRoles);
        //   if (verificationToken.role !== Role.ADMIN) {
        if (!authRoles.includes(verificationToken.role)) {
            throw new AppError_1.default(403, "You're not authorized to view this route");
        }
        // forward to controller
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.checkAuth = checkAuth;
