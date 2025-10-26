import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "SENDER" | "RECEIVER";
  isBlocked: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "SENDER", "RECEIVER"],
      default: "SENDER",
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
