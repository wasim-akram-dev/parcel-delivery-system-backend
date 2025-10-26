import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodError } from "zod";

export const validationRequest =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ✅ Parse and validate body safely
      const validatedBody = await zodSchema.parseAsync(req.body);
      req.body = validatedBody;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // ✅ Forward formatted Zod error to global handler
        return next(error);
      }

      // ✅ Forward any other unexpected errors
      next(error);
    }
  };
