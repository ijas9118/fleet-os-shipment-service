import { v4 as uuidv4 } from "uuid";

import type { IShipmentRepository } from "@/domain/repositories";
import type { IInventoryServiceClient } from "@/infrastructure/clients";

import { Shipment } from "@/domain/entities";
import { ShipmentStatus } from "@/domain/enums";

import type { CreateShipmentDTO } from "./create-shipment.dto";

export class CreateShipmentUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
    private _inventoryClient: IInventoryServiceClient,
  ) {}

  async execute(dto: CreateShipmentDTO): Promise<Shipment> {
    // Generate unique tracking ID
    const trackingId = this._generateTrackingId();

    // Reserve stock in inventory service
    const reservation = await this._inventoryClient.reserveStock({
      tenantId: dto.tenantId,
      warehouseId: dto.warehouseId,
      items: dto.items.map(item => ({
        inventoryItemId: item.inventoryItemId,
        sku: item.sku,
        quantity: item.quantity,
      })),
      expiryHours: 24, // 24 hour reservation expiry
    });

    // Create new shipment entity with reservation ID
    const shipment = new Shipment({
      tenantId: dto.tenantId,
      warehouseId: dto.warehouseId,
      trackingId,
      status: ShipmentStatus.PENDING,
      items: dto.items,
      destinationAddress: dto.destinationAddress,
      customer: dto.customer,
      inventoryReservationId: reservation.reservationId,
      notes: dto.notes,
      estimatedDeliveryDate: dto.estimatedDeliveryDate,
    });

    // Persist to database
    const result = await this._shipmentRepo.create(shipment);

    return result;
  }

  private _generateTrackingId(): string {
    // Generate tracking ID in format: SHP-XXXXXX (using UUID first 6 chars)
    const uuid = uuidv4().replace(/-/g, "").substring(0, 6).toUpperCase();
    return `SHP-${uuid}`;
  }
}
