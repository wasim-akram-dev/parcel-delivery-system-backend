import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../utils/AppError";
import { VerifyToken } from "../utils/jwt";

// verify token n roles
export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      console.log("accesstoken", accessToken);
      if (!accessToken) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "no token recieved, login first!"
        );
      }
      const verificationToken = VerifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;
      console.log("verificationToken", verificationToken);
      console.log("authRoles", authRoles);
      // check if the user is BLOCKED OR INACTIVE NOW
      const decoded = jwt.decode(accessToken, { complete: true }) as JwtPayload;
      if (decoded.payload.isActive === "BLOCKED") {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Failed, this user is ${decoded.payload.isActive} now`
        );
      }

      // console.log('verificationToken', verificationToken);
      // console.log('authRoles', authRoles);
      //   if (verificationToken.role !== Role.ADMIN) {

      if (!authRoles.includes(verificationToken.role)) {
        throw new AppError(403, "You're not authorized to view this route");
      }

      // forward to controller
      next();
    } catch (error) {
      next(error);
    }
  };
