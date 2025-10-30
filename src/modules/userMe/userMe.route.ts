import { Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { VerifyToken } from "../../utils/jwt";

const router = Router();

router.get("/me", (req, res) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization;
    // console.log(token);
    if (!token) return res.json({ success: false });

    const decoded = VerifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;
    return res.json({ success: true, user: decoded });
  } catch {
    return res.json({ success: false });
  }
});

export const userMe = router;
