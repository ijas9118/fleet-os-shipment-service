import type { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import logger from "@/config/logger";
import env from "@/config/validate-env";
import { AppError } from "@/domain/errors/app-error";

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Resource not found: ${req.method} ${req.originalUrl}`,
      path: req.originalUrl,
      method: req.method,
    },
  });
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  // Handle AppError instances
  if (err instanceof AppError) {
    logger.warn(`Business error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
      path: req.originalUrl,
    });

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || "BUSINESS_ERROR",
        message: err.message,
        path: req.originalUrl,
        method: req.method,
      },
    });
  }

  // Handle other errors
  const statusCode = (err as any).statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
  const isProd = env.NODE_ENV === "production";

  logger.error(`Unhandled error: ${err.message}`, {
    stack: err.stack,
    path: req.originalUrl,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: isProd ? "Something went wrong!!" : err.message,
      path: req.originalUrl,
      method: req.method,
    },
  });
}
