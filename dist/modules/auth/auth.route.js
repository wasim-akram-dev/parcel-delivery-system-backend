"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/login", (req, res, next) => {
    auth_controller_1.AuthControllers.credentialsLogin(req, res, next);
});
router.post("/refresh-token", (req, res, next) => {
    auth_controller_1.AuthControllers.getNewAccessToken(req, res, next);
});
router.post("/logout", auth_controller_1.AuthControllers.logout);
exports.AuthRoutes = router;
