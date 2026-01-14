import type { IShipmentRepository } from "@/domain/repositories";
import type { IInventoryServiceClient } from "@/infrastructure/clients";

import { ShipmentNotFoundError } from "@/domain/errors";

import type { DeleteShipmentDTO } from "./delete-shipment.dto";

export class DeleteShipmentUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
    private _inventoryClient: IInventoryServiceClient,
  ) {}

  async execute(dto: DeleteShipmentDTO): Promise<void> {
    // Find shipment and verify tenant ownership
    const shipment = await this._shipmentRepo.findById(dto.shipmentId, dto.tenantId);

    if (!shipment) {
      throw new ShipmentNotFoundError(dto.shipmentId);
    }

    // Release inventory reservation if exists
    if (shipment.inventoryReservationId) {
      await this._inventoryClient.releaseReservation({
        reservationId: shipment.inventoryReservationId,
        tenantId: dto.tenantId,
      });
    }

    // Soft delete the shipment
    await this._shipmentRepo.delete(dto.shipmentId);
  }
}
