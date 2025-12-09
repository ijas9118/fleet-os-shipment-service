import { ShipmentStatus } from "@ahammedijas/fleet-os-shared";

// tests/mocks/shipment.mock.ts
import type { ShipmentProps } from "@/domain/entities/shipment";
import type { IShipmentCacheRepository, IShipmentRepository } from "@/domain/repositories";
import type { ListShipmentsDTO } from "@/domain/repositories/dto/list-shipment.dto";
import type { ListShipmentsResult } from "@/domain/repositories/dto/list-shipment.result";

import { Shipment } from "@/domain/entities/shipment";

export const mockShipmentProps: ShipmentProps = {
  id: "shipment-123",
  tenantId: "tenant-456",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
  },
  originWarehouseId: "warehouse-1",
  destinationAddress: {
    line1: "123 Main St",
    city: "New York",
    country: "USA",
  },
  items: [{
    inventoryItemId: "item-1",
    quantity: 5,
    uom: "pcs",
  }],
  status: ShipmentStatus.CREATED,
  priority: "NORMAL",
};

export const mockShipment = new Shipment(mockShipmentProps);

export const mockShipmentRepository: jest.Mocked<IShipmentRepository> = {
  findById: jest.fn(),
  create: jest.fn(),
  list: jest.fn(),
  save: jest.fn(),
};

export const mockCacheRepository: jest.Mocked<IShipmentCacheRepository> = {
  getById: jest.fn(),
  set: jest.fn(),
  invalidate: jest.fn(),
};

export const mockListShipmentsResult: ListShipmentsResult = {
  shipments: [mockShipmentProps, mockShipmentProps, mockShipmentProps],
  pagination: {
    page: 1,
    limit: 10,
    total: 3,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

export const mockListShipmentsDTO: ListShipmentsDTO = {
  tenantId: "tenant-456",
  page: 1,
  limit: 10,
};
