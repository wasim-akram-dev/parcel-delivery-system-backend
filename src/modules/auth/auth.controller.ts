/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

// const isProduction = process.env.NODE_ENV === "production";
// console.log("isProduction", isProduction);

const credentialsLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginInfo = await AuthServices.credentialsLogin(req.body);
    // send refresh token to the response cookies while login
    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: true, // use true in production (with HTTPS)
      sameSite: "none",
      // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      // sameSite: isProduction ? "none" : "lax", // important when frontend & backend are on different domains
    });

    // send refresh token to the response cookies while login
    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // sameSite: isProduction ? "none" : "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Login Successfully",
      data: loginInfo,
    });
  } catch (error) {
    next(error);
    // then this error will show from the global error handler using next()
  }
};

// get new accessToken API.
const getNewAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // take refreshtoken in cookies from the request that was inserted in cookies while login
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token found in cookies"
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    // send refresh token to the response cookies while login
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      // sameSite: isProduction ? "none" : "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Login Successfully",
      data: tokenInfo,
    });
  } catch (error) {
    next(error);
  }
};

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged Out Successfully",
      data: null,
    });
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
};
