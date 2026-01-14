import type { IShipmentRepository } from "@/domain/repositories";

import { ShipmentNotFoundError } from "@/domain/errors";

import type { AssignToDriverDTO } from "./assign-to-driver.dto";

export class AssignToDriverUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
  ) {}

  async execute(dto: AssignToDriverDTO): Promise<void> {
    // Find shipment and verify tenant ownership
    const shipment = await this._shipmentRepo.findById(dto.shipmentId, dto.tenantId);

    if (!shipment) {
      throw new ShipmentNotFoundError(dto.shipmentId);
    }

    // Assign to driver (entity validates it's in CONFIRMED status)
    shipment.assignToDriver(dto.driverId, dto.driverName);

    // Persist changes
    await this._shipmentRepo.update(dto.shipmentId, shipment.propsSnapshot);
  }
}
