import { model } from "mongoose";

import type { ShipmentDocument } from "./shipment.types";

import { ShipmentSchema } from "./schemas/shipment.schema";

export const ShipmentModel = model<ShipmentDocument>(
  "Shipment",
  ShipmentSchema,
);
