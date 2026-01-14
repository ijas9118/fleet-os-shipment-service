import { model, Schema } from "mongoose";

import { ShipmentStatus } from "@/domain/enums";

// Address subdocument schema
const AddressSchema = new Schema({
  line1: {
    type: String,
    required: true,
  },
  line2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: {
      type: Number,
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
}, { _id: false });

// Customer subdocument schema
const CustomerDetailsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
}, { _id: false });

// Shipment item subdocument schema
const ShipmentItemSchema = new Schema({
  inventoryItemId: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit: {
    type: String,
    required: true,
  },
}, { _id: false });

// Main shipment schema
const ShipmentSchema = new Schema({
  tenantId: {
    type: String,
    required: true,
    index: true,
  },
  warehouseId: {
    type: String,
    required: true,
    index: true,
  },
  trackingId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: Object.values(ShipmentStatus),
    default: ShipmentStatus.PENDING,
    index: true,
  },
  items: {
    type: [ShipmentItemSchema],
    required: true,
    validate: {
      validator: (items: any[]) => items && items.length > 0,
      message: "At least one item is required",
    },
  },
  destinationAddress: {
    type: AddressSchema,
    required: true,
  },
  customer: {
    type: CustomerDetailsSchema,
    required: true,
  },
  inventoryReservationId: {
    type: String,
    index: true,
  },
  driverId: {
    type: String,
    index: true,
  },
  driverName: {
    type: String,
  },
  notes: {
    type: String,
  },
  estimatedDeliveryDate: {
    type: Date,
  },
  actualDeliveryDate: {
    type: Date,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Compound unique index: trackingId must be unique
ShipmentSchema.index({ trackingId: 1 }, { unique: true });

// Index for tenant + status queries (common filter)
ShipmentSchema.index({ tenantId: 1, status: 1 });

// Index for tenant + warehouse queries
ShipmentSchema.index({ tenantId: 1, warehouseId: 1 });

// Index for tenant + created date (for date range filtering)
ShipmentSchema.index({ tenantId: 1, createdAt: -1 });

// Index for tenant + customer email (for customer lookup)
ShipmentSchema.index({ "tenantId": 1, "customer.email": 1 });

// Text index for search functionality (trackingId, customer name/email)
ShipmentSchema.index({
  "trackingId": "text",
  "customer.name": "text",
  "customer.email": "text",
});

export const ShipmentModel = model("Shipment", ShipmentSchema);
