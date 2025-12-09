import { Router } from "express";

import type { ShipmentController } from "../controllers/shipment.controller";

import { authMiddleware } from "../middlewares/auth";

export function buildShipmentRouter(controller: ShipmentController): Router {
  const router = Router();

  router.post("/", controller.createShipment);

  router.get("/:id", authMiddleware(), controller.getShipmentById);

  router.get("/", authMiddleware(), controller.listShipments);

  return router;
}
