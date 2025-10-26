import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .any()
    .refine((val) => typeof val === "string", {
      message: "Name must be string",
    })
    .pipe(
      z
        .string()
        .min(2, { message: "Name too short minimum 2 characters long" })
        .max(50, { message: "Name too long" })
    ),

  email: z.string().email({ message: "Invalid email address" }),

  role: z
    .any()
    .refine((val) => typeof val === "string", {
      message: "Role must be string",
    })
    .pipe(z.string()),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must include one uppercase letter" })
    .regex(/\d/, { message: "Password must include at least one number" })
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
      message: "Password must include at least one special character",
    }),

  phone: z
    .any()
    .refine((val) => typeof val === "string", {
      message: "Phone number must be string",
    })
    .pipe(
      z.string().regex(/^01[3-9][0-9]{8}$/, {
        message:
          "Phone number must be a valid Bangladeshi number starting with 01 and 11 digits total",
      })
    )
    .optional(),

  address: z
    .any()
    .refine((val) => typeof val === "string", {
      message: "Address must be string",
    })
    .pipe(
      z.string().max(200, { message: "Address cannot exceed 200 characters" })
    )
    .optional(),

  isDeleted: z
    .any()
    .refine((val) => typeof val === "boolean", {
      message: "isDeleted must be true or false",
    })
    .pipe(z.boolean())
    .optional(),

  isActive: z
    .any()
    .refine((val) => typeof val === "boolean", {
      message: "isActive must be true or false",
    })
    .pipe(z.boolean())
    .optional(),

  isVerified: z
    .any()
    .refine((val) => typeof val === "boolean", {
      message: "isVerified must be true or false",
    })
    .pipe(z.boolean())
    .optional(),
});
