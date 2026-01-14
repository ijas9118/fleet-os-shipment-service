import type { IShipmentRepository } from "@/domain/repositories";

import { ShipmentNotFoundError } from "@/domain/errors";

import type { UpdateShipmentDTO } from "./update-shipment.dto";

export class UpdateShipmentUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
  ) {}

  async execute(dto: UpdateShipmentDTO): Promise<void> {
    // Find shipment and verify tenant ownership
    const shipment = await this._shipmentRepo.findById(dto.shipmentId, dto.tenantId);

    if (!shipment) {
      throw new ShipmentNotFoundError(dto.shipmentId);
    }

    // Update shipment details using entity methods
    if (dto.destinationAddress) {
      shipment.updateDestinationAddress(dto.destinationAddress);
    }

    if (dto.customer) {
      shipment.updateCustomerDetails(dto.customer);
    }

    if (dto.notes !== undefined) {
      shipment.updateNotes(dto.notes);
    }

    if (dto.estimatedDeliveryDate) {
      shipment.updateEstimatedDeliveryDate(dto.estimatedDeliveryDate);
    }

    // Persist changes
    await this._shipmentRepo.update(dto.shipmentId, shipment.propsSnapshot);
  }
}
