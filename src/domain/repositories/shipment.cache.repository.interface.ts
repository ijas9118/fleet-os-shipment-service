import type { Shipment } from "../entities/shipment";

export interface IShipmentCacheRepository {
  getById: (id: string, tenantId: string) => Promise<Shipment | null>;
  set: (shipment: Shipment) => Promise<void>;
  invalidate: (id: string, tenantId: string) => Promise<void>;
}
