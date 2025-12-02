import type { Shipment, ShipmentStatus } from "../entities/shipment";

export interface ShipmentRepository {
  create: (shipment: Shipment) => Promise<Shipment>;
  findByTrackingNumber: (id: string) => Promise<Shipment | null>;
  updateStatus: (id: string, status: ShipmentStatus) => Promise<Shipment | null>;
}
