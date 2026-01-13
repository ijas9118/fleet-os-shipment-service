import type { Shipment } from "@/domain/entities";
import type { IShipmentRepository, ListShipmentsOptions } from "@/domain/repositories";

// TODO: Implement in Phase 3
export class ShipmentRepositoryMongo implements IShipmentRepository {
  async create(shipment: Shipment): Promise<Shipment> {
    throw new Error("Not implemented");
  }

  async findById(id: string, tenantId: string): Promise<Shipment | null> {
    throw new Error("Not implemented");
  }

  async findByTrackingId(trackingId: string): Promise<Shipment | null> {
    throw new Error("Not implemented");
  }

  async list(options: ListShipmentsOptions): Promise<{ shipments: Shipment[]; total: number }> {
    throw new Error("Not implemented");
  }

  async update(id: string, updates: Partial<Shipment>): Promise<void> {
    throw new Error("Not implemented");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Not implemented");
  }
}
