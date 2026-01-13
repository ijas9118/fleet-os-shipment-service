import type { IShipmentRepository } from "@/domain/repositories";

import type { ListShipmentsDTO, PaginatedShipmentsResponse } from "./list-shipments.dto";

export class ListShipmentsUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
  ) {}

  async execute(dto: ListShipmentsDTO): Promise<PaginatedShipmentsResponse> {
    const { shipments, total } = await this._shipmentRepo.list({
      tenantId: dto.tenantId,
      page: dto.page,
      limit: dto.limit,
      search: dto.search,
      status: dto.status,
      warehouseId: dto.warehouseId,
      customerId: dto.customerId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      includeDeleted: dto.includeDeleted,
    });

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: shipments.map(shipment => ({
        id: shipment.id!,
        tenantId: shipment.tenantId,
        warehouseId: shipment.warehouseId,
        trackingId: shipment.trackingId,
        status: shipment.status,
        itemCount: shipment.items.length,
        customerName: shipment.customer.name,
        customerEmail: shipment.customer.email,
        destinationCity: shipment.destinationAddress.city,
        destinationCountry: shipment.destinationAddress.country,
        inventoryReservationId: shipment.inventoryReservationId,
        estimatedDeliveryDate: shipment.estimatedDeliveryDate,
        actualDeliveryDate: shipment.actualDeliveryDate,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      })),
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages,
      },
    };
  }
}
