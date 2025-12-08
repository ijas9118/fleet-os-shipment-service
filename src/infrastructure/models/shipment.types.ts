import type { ShipmentStatus } from "@ahammedijas/fleet-os-shared";
import type { Document, Types } from "mongoose";

export interface ShipmentItem {
  inventoryItemId: Types.ObjectId;
  quantity: number;
  uom: string;
}

export interface Customer {
  name: string;
  email: string;
  phone?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface ShipmentDocument extends Document {
  tenantId: Types.ObjectId;
  customer: Customer;
  originWarehouseId: Types.ObjectId;
  destinationAddress: Address;
  items: ShipmentItem[];
  status: ShipmentStatus;
  reservationId?: Types.ObjectId;
  assignmentId?: Types.ObjectId;
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  correlationId?: string;
  createdAt: Date;
  updatedAt: Date;
}
