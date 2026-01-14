import type { ShipmentStatus } from "@/domain/enums";

export interface UpdateStatusDTO {
  shipmentId: string;
  tenantId: string;
  userId: string;
  newStatus: ShipmentStatus;
  notes?: string;
}
