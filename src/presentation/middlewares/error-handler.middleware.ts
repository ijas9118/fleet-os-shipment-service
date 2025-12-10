import type { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import logger from "@/config/logger";
import env from "@/config/validate-env";

import { mapToHttpError } from "../utils/map-to-http-error";

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
  const httpErr = mapToHttpError(err);
  const isProd = env.NODE_ENV === "production";

  logger.error(`Error on ${req.method} ${req.originalUrl}: ${httpErr.message}`, {
    stack: httpErr.stack,
    originalError: err,
  });

  res.status(httpErr.statusCode).json({
    success: false,
    error: {
      code: httpErr.code ?? "INTERNAL_ERROR",
      message: isProd && httpErr.statusCode === STATUS_CODES.INTERNAL_SERVER_ERROR
        ? "Something went wrong!!"
        : httpErr.message,
      path: req.originalUrl,
      method: req.method,
    },
  });
}
