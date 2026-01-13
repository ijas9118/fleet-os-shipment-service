import { UserRole } from "@ahammedijas/fleet-os-shared";
import { Router } from "express";

import { CreateShipmentDTOSchema } from "@/use-cases/create-shipment";
import { UpdateShipmentDTOSchema } from "@/use-cases/update-shipment";

import type { ShipmentController } from "../controllers/shipment.controller";

import { requireAuth, requireRole, validate } from "../middlewares";

export function buildShipmentRoutes(controller: ShipmentController): Router {
  const router = Router();

  // All routes require authentication
  router.use(requireAuth);

  // List shipments
  router.get(
    "/",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,
      UserRole.DRIVER,
    ]),
    controller.listShipments,
  );

  // Create shipment
  router.post(
    "/",
    requireRole([UserRole.TENANT_ADMIN, UserRole.OPERATIONS_MANAGER]),
    validate(CreateShipmentDTOSchema),
    controller.createShipment,
  );

  // Get single shipment
  router.get(
    "/:id",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,
      UserRole.DRIVER,
    ]),
    controller.getShipment,
  );

  // Update shipment
  router.put(
    "/:id",
    requireRole([UserRole.TENANT_ADMIN]),
    validate(UpdateShipmentDTOSchema),
    controller.updateShipment,
  );

  // Confirm shipment (PENDING -> CONFIRMED)
  router.post(
    "/:id/confirm",
    requireRole([UserRole.TENANT_ADMIN]),
    controller.confirmShipment,
  );

  // Delete shipment (soft delete)
  router.delete(
    "/:id",
    requireRole([UserRole.TENANT_ADMIN, UserRole.OPERATIONS_MANAGER]),
    controller.deleteShipment,
  );

  return router;
}
