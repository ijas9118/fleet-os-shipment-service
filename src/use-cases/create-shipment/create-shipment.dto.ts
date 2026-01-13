import type { Address, CustomerDetails, ShipmentItem } from "@/domain/entities";

export interface CreateShipmentDTO {
  tenantId: string;
  warehouseId: string;
  items: ShipmentItem[];
  destinationAddress: Address;
  customer: CustomerDetails;
  notes?: string;
  estimatedDeliveryDate?: Date;
}
