import { model, Schema } from "mongoose";

import type { Shipment } from "@/domain/entities/shipment";

import { ShipmentStatus } from "@/domain/entities/shipment";

const ShipmentSchema = new Schema<Shipment>({
  trackingNumber: { type: String, required: true, unique: true },
  clientId: { type: String, required: true, index: true },
  status: { type: String, enum: Object.values(ShipmentStatus) },

  pickupAddress: { type: String },
  deliveryAddress: { type: String },

  assignedDriverId: { type: String },
  assignedVehicleId: { type: String },

  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    timestamp: { type: Date },
  },

  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    weight: { type: Number },
  }],

  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },

  timestampsLog: {
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
  },

  pricing: {
    baseFee: { type: Number },
    distanceFee: { type: Number },
    total: { type: Number },
  },

  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const ShipmentModel = model("Shipment", ShipmentSchema);
