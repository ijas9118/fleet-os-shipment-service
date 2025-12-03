import type { Application, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { errorHandler, notFoundHandler } from "./presentation/middlewares/error-handler.middleware";
import limiter from "./presentation/middlewares/rate-limit.middleware";
import { routes } from "./presentation/routes";

export default function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use(limiter);

  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(STATUS_CODES.OK).json({ status: "ok" });
  });

  app.use("/api/v1", routes());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
