import type { ShipmentProps } from "@/domain/entities/shipment";

export interface ListShipmentsResult {
  shipments: ShipmentProps[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
