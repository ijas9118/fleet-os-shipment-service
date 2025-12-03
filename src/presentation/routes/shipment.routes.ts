import { Router } from "express";

import { ShipmentFactory } from "@/infrastructure/factories/shipment.factory";

export function createShipmentRoutes(): Router {
  const router = Router();
  const controller = ShipmentFactory.createController();

  router.post("/", controller.createShipment);

  return router;
}
