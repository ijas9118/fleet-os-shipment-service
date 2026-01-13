import type { Shipment } from "../entities";

export interface ListShipmentsOptions {
  tenantId: string;
  page: number;
  limit: number;
  search?: string;
  status?: string;
  warehouseId?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
  includeDeleted?: boolean;
}

export interface IShipmentRepository {
  create: (shipment: Shipment) => Promise<Shipment>;
  findById: (id: string, tenantId: string) => Promise<Shipment | null>;
  findByTrackingId: (trackingId: string) => Promise<Shipment | null>;
  list: (options: ListShipmentsOptions) => Promise<{ shipments: Shipment[]; total: number }>;
  update: (id: string, updates: Partial<Shipment>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
