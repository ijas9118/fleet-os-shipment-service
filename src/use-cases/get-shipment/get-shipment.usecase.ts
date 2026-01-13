import type { Shipment } from "@/domain/entities";
import type { IShipmentRepository } from "@/domain/repositories";

import { ShipmentNotFoundError } from "@/domain/errors";

import type { GetShipmentDTO } from "./get-shipment.dto";

export class GetShipmentUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
  ) {}

  async execute(dto: GetShipmentDTO): Promise<Shipment> {
    const shipment = await this._shipmentRepo.findById(dto.shipmentId, dto.tenantId);

    if (!shipment) {
      throw new ShipmentNotFoundError(dto.shipmentId);
    }

    return shipment;
  }
}
