import { Router } from "express";

import type { ShipmentController } from "../controllers/shipment.controller";

import { requireAuth } from "../middlewares/auth";

export function buildShipmentRouter(controller: ShipmentController): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/", controller.createShipment);

  router.get("/:id", controller.getShipmentById);

  router.get("/", controller.listShipments);

  router.patch(
    "/:id/status",
    controller.updateShipmentStatus,
  );

  return router;
}
