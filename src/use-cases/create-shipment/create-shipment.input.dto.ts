import type { ShipmentItem } from "@/domain/entities/shipment";

export interface CreateShipmentInput {
  clientId: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: ShipmentItem[];
}
