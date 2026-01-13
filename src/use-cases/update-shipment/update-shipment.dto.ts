import type { Address, CustomerDetails } from "@/domain/entities";

export interface UpdateShipmentDTO {
  shipmentId: string;
  tenantId: string;
  destinationAddress?: Address;
  customer?: CustomerDetails;
  notes?: string;
  estimatedDeliveryDate?: Date;
}
