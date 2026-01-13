import type { IShipmentRepository } from "@/domain/repositories";

import { ShipmentNotFoundError } from "@/domain/errors";

import type { ConfirmShipmentDTO } from "./confirm-shipment.dto";

export class ConfirmShipmentUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
  ) {}

  async execute(dto: ConfirmShipmentDTO): Promise<void> {
    // Find shipment and verify tenant ownership
    const shipment = await this._shipmentRepo.findById(dto.shipmentId, dto.tenantId);

    if (!shipment) {
      throw new ShipmentNotFoundError(dto.shipmentId);
    }

    // Confirm the shipment (entity validates it's in PENDING status)
    shipment.confirm();

    // Persist changes
    await this._shipmentRepo.update(dto.shipmentId, shipment.propsSnapshot);
  }
}
