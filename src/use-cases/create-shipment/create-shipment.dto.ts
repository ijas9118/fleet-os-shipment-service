import type { ShipmentItem } from "@/domain/entities/shipment";

export interface CreateShipmentDTO {
  tenantId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    referenceCode?: string;
  };
  originWarehouseId: string;
  destinationAddress: {
    line1: string;
    line2: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  items: ShipmentItem[];
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
}
