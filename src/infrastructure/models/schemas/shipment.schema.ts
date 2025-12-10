import { ShipmentStatus } from "@ahammedijas/fleet-os-shared";
import { Schema } from "mongoose";

import { AddressSchema } from "./address.schema";
import { CustomerSchema } from "./customer.schema";
import { ShipmentItemSchema } from "./shipment-item.schema";

export const ShipmentSchema = new Schema(
  {
    tenantId: { type: Schema.Types.ObjectId, required: true, index: true },

    customer: { type: CustomerSchema, required: true },

    originWarehouseId: { type: Schema.Types.ObjectId, required: true },

    destinationAddress: { type: AddressSchema, required: true },

    items: { type: [ShipmentItemSchema], required: true },

    status: {
      type: String,
      enum: Object.values(ShipmentStatus),
      default: ShipmentStatus.CREATED,
      index: true,
    },

    reservationId: { type: Schema.Types.ObjectId },
    assignmentId: { type: Schema.Types.ObjectId },

    priority: {
      type: String,
      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],
      default: "NORMAL",
    },

    correlationId: { type: String },
  },
  { timestamps: true },
);
