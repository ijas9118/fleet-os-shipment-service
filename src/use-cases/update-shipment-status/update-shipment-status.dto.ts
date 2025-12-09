import type { ShipmentStatus, UserRole } from "@ahammedijas/fleet-os-shared";

export interface UpdateShipmentStatusDTO {
  shipmentId: string;
  tenantId: string;
  newStatus: ShipmentStatus;
  userId: string;
  userRole: UserRole;
}
