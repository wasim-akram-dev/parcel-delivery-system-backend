import { Request, Response, Router } from "express";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { VerifyToken } from "../../utils/jwt";

const router = Router();

router.get("/me", async (req: Request, res: Response) => {
  try {
    const token = await (req.headers.authorization || req.cookies.accessToken);
    console.log("Token from userMe:", token);

    if (!token)
      return res.json({
        success: false,
        message: "No token found from backend",
      });

    const decoded = VerifyToken(token, envVars.JWT_ACCESS_SECRET) as JwtPayload;
    return res.json({
      success: true,
      message: "User Profile Retrieved Successfully",
      user: decoded,
    });
  } catch {
    return res.json({ success: false });
  }
});

export const userMe = router;
