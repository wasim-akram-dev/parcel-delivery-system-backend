import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envVars } from "../../config/env";
import { User } from "../user/user.model";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, envVars.BCRYPT_SALT_ROUND);
    const user = await User.create({ name, email, password: hashed, role });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      envVars.JWT_ACCESS_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
}
