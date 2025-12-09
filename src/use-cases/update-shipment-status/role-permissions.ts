import { ShipmentStatus, UserRole } from "@ahammedijas/fleet-os-shared";

export const rolePermissions: Record<UserRole, ShipmentStatus[]> = {
  [UserRole.PLATFORM_ADMIN]: [
    ...Object.values(ShipmentStatus),
  ],
  [UserRole.TENANT_ADMIN]: [
    ShipmentStatus.PENDING_STOCK,
    ShipmentStatus.READY_FOR_ASSIGNMENT,
    ShipmentStatus.ASSIGNED,
    ShipmentStatus.PICKED_UP,
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.RETURNING,
    ShipmentStatus.DELIVERED,
    ShipmentStatus.CANCELLED,
  ],
  [UserRole.OPERATIONS_MANAGER]: [
    ShipmentStatus.READY_FOR_ASSIGNMENT,
    ShipmentStatus.ASSIGNED,
    ShipmentStatus.PICKED_UP,
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.RETURNING,
    ShipmentStatus.DELIVERED,
  ],
  [UserRole.WAREHOUSE_MANAGER]: [
    ShipmentStatus.PENDING_STOCK,
    ShipmentStatus.READY_FOR_ASSIGNMENT,
    ShipmentStatus.FAILED_STOCK,
  ],
  [UserRole.DRIVER]: [
    ShipmentStatus.PICKED_UP,
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.DELIVERED,
    ShipmentStatus.FAILED_DELIVERY,
    ShipmentStatus.RETURNING,
  ],
};
