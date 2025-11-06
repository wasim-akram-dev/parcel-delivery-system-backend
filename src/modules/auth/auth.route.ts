import { NextFunction, Router } from "express";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/login", (req, res, next: NextFunction) => {
  AuthControllers.credentialsLogin(req, res, next);
});

router.post("/refresh-token", (req, res, next: NextFunction) => {
  AuthControllers.getNewAccessToken(req, res, next);
});

router.post("/logout", AuthControllers.logout);

export const AuthRoutes = router;
