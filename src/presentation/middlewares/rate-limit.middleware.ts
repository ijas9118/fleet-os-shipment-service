import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (_req, res) => {
    res.status(STATUS_CODES.TOO_MANY_REQUESTS).json({
      message: "Too many requests. Please try again later.",
      timestamp: new Date().toISOString(),
    });
  },
});

export { limiter };
