import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import AppError from "./AppError";
import { generateToken, VerifyToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
  // jwt payload
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    name: user.name,
    picture: user.picture,
  };

  // accessToken assign
  // const accessToken = jwt.sign(jwtPayload, "secret", { expiresIn: "1d" });
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verificationToken = VerifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await User.findOne({ email: verificationToken.email });
  // console.log("isUserExist", isUserExist);
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email does not Exist");
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already deleted");
  }
  if (isUserExist.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is blocked");
  }

  const userTokens = createUserTokens(isUserExist);
  return userTokens.accessToken;
};
