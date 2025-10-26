import { Router } from "express";
import { login, register } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);

export const AuthRoutes = router;
