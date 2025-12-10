import { ShipmentStatus } from "@ahammedijas/fleet-os-shared";

export const validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
  [ShipmentStatus.CREATED]: [
    ShipmentStatus.PENDING_STOCK,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.PENDING_STOCK]: [
    ShipmentStatus.READY_FOR_ASSIGNMENT,
    ShipmentStatus.FAILED_STOCK,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.READY_FOR_ASSIGNMENT]: [
    ShipmentStatus.ASSIGNED,
    ShipmentStatus.FAILED_ASSIGNMENT,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.ASSIGNED]: [
    ShipmentStatus.PICKED_UP,
    ShipmentStatus.FAILED_PICKUP,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.PICKED_UP]: [
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.RETURNING,
  ],
  [ShipmentStatus.IN_TRANSIT]: [
    ShipmentStatus.DELIVERED,
    ShipmentStatus.FAILED_DELIVERY,
    ShipmentStatus.RETURNING,
  ],
  [ShipmentStatus.RETURNING]: [
    ShipmentStatus.DELIVERED,
    ShipmentStatus.CANCELLED,
  ],
  [ShipmentStatus.DELIVERED]: [],
  [ShipmentStatus.FAILED_STOCK]: [],
  [ShipmentStatus.FAILED_ASSIGNMENT]: [],
  [ShipmentStatus.FAILED_PICKUP]: [],
  [ShipmentStatus.FAILED_DELIVERY]: [],
  [ShipmentStatus.CANCELLED]: [],
};
