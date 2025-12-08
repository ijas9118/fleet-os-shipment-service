import type { Application, NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import logger from "./config/logger";
import { ShipmentCacheRedis } from "./infrastructure/repositories/shipment.cache.repository";
import { ShipmentRepositoryMongo } from "./infrastructure/repositories/shipment.repository";
import { ShipmentController } from "./presentation/controllers/shipment.controller";
import { errorHandler, limiter, notFoundHandler } from "./presentation/middlewares";
import { buildShipmentRouter } from "./presentation/routes/shipment.routes";
import { CreateShipmentUseCase } from "./use-cases/create-shipment";
import { GetShipmentUseCase } from "./use-cases/get-shipment/get-shipment.usecase";
import { ListShipmentsUseCase } from "./use-cases/list-shipments/list-shipment.usecase";

export default function createApp(): Application {
  const shipmentRepo = new ShipmentRepositoryMongo();
  const cacheRepo = new ShipmentCacheRedis();
  const createUC = new CreateShipmentUseCase(shipmentRepo);
  const listUC = new ListShipmentsUseCase(shipmentRepo, cacheRepo);
  const getShipmentUC = new GetShipmentUseCase(shipmentRepo, cacheRepo);
  const controller = new ShipmentController(createUC, getShipmentUC, listUC);

  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use(limiter);

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  app.get("/healthz", (_req: Request, res: Response) => {
    res.status(STATUS_CODES.OK).json({ status: "ok" });
  });

  app.use("/shipments", buildShipmentRouter(controller));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
