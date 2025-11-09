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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMe = void 0;
const express_1 = require("express");
const env_1 = require("../../config/env");
const jwt_1 = require("../../utils/jwt");
const router = (0, express_1.Router)();
router.get("/me", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield (req.headers.authorization || req.cookies.accessToken);
        console.log("Token from userMe:", token);
        if (!token)
            return res.json({
                success: false,
                message: "No token found from backend",
            });
        const decoded = (0, jwt_1.VerifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
        return res.json({
            success: true,
            message: "User Profile Retrieved Successfully",
            user: decoded,
        });
    }
    catch (_a) {
        return res.json({ success: false });
    }
}));
exports.userMe = router;
