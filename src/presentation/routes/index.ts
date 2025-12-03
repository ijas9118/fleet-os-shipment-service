import { Router } from "express";

import { createShipmentRoutes } from "./shipment.routes";

export function routes() {
  const routes = Router();

  routes.use("/shipments", createShipmentRoutes());

  return routes;
}
