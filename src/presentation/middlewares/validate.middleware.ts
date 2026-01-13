import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";
import { ZodError } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    }
    catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        return res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "Invalid request data",
      });
    }
  };
}
