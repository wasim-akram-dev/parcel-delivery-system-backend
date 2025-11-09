"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .any()
        .refine((val) => typeof val === "string", {
        message: "Name must be string",
    })
        .pipe(zod_1.default
        .string()
        .min(2, { message: "Name too short minimum 2 characters long" })
        .max(50, { message: "Name too long" })),
    email: zod_1.default.string().email({ message: "Invalid email address" }),
    role: zod_1.default
        .any()
        .refine((val) => typeof val === "string", {
        message: "Role must be string",
    })
        .pipe(zod_1.default.string()),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must include one uppercase letter" })
        .regex(/\d/, { message: "Password must include at least one number" })
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
        message: "Password must include at least one special character",
    }),
    phone: zod_1.default
        .any()
        .refine((val) => typeof val === "string", {
        message: "Phone number must be string",
    })
        .pipe(zod_1.default.string().regex(/^01[3-9][0-9]{8}$/, {
        message: "Phone number must be a valid Bangladeshi number starting with 01 and 11 digits total",
    }))
        .optional(),
    address: zod_1.default
        .any()
        .refine((val) => typeof val === "string", {
        message: "Address must be string",
    })
        .pipe(zod_1.default.string().max(200, { message: "Address cannot exceed 200 characters" }))
        .optional(),
    isDeleted: zod_1.default
        .any()
        .refine((val) => typeof val === "boolean", {
        message: "isDeleted must be true or false",
    })
        .pipe(zod_1.default.boolean())
        .optional(),
    isActive: zod_1.default
        .any()
        .refine((val) => typeof val === "boolean", {
        message: "isActive must be true or false",
    })
        .pipe(zod_1.default.boolean())
        .optional(),
    isVerified: zod_1.default
        .any()
        .refine((val) => typeof val === "boolean", {
        message: "isVerified must be true or false",
    })
        .pipe(zod_1.default.boolean())
        .optional(),
});
