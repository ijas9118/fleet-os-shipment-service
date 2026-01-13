import type { ListShipmentsOptions } from "@/domain/repositories";

export interface ListShipmentsDTO {
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

export interface ShipmentListItemDTO {
  id: string;
  tenantId: string;
  warehouseId: string;
  trackingId: string;
  status: string;
  itemCount: number;
  customerName: string;
  customerEmail: string;
  destinationCity: string;
  destinationCountry: string;
  inventoryReservationId?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedShipmentsResponse {
  data: ShipmentListItemDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Re-export the options type
export type { ListShipmentsOptions };
