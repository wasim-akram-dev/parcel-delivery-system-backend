"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secret, expiresIn) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: expiresIn,
    });
    // console.log('accessToken', accessToken);
    return accessToken;
};
exports.generateToken = generateToken;
const VerifyToken = (token, secret) => {
    const verifyToken = jsonwebtoken_1.default.verify(token, secret);
    // console.log('verifyToken', verifyToken);
    return verifyToken;
};
exports.VerifyToken = VerifyToken;
