import { ShipmentStatus } from "@ahammedijas/fleet-os-shared";

import type { Shipment } from "@/domain/entities/shipment";
import type { IShipmentRepository } from "@/domain/repositories";

import { Shipment as ShipmentEntity } from "@/domain/entities/shipment";

import type { CreateShipmentDTO } from "./create-shipment.dto";

export class CreateShipmentUseCase {
  constructor(
    private _repo: IShipmentRepository,
  ) {}

  async execute(dto: CreateShipmentDTO): Promise<Shipment> {
    const shipment = new ShipmentEntity({
      tenantId: dto.tenantId,
      customer: dto.customer,
      originWarehouseId: dto.originWarehouseId,
      destinationAddress: dto.destinationAddress,
      items: dto.items,
      status: ShipmentStatus.PENDING_STOCK,
      priority: dto.priority ?? "NORMAL",
    });

    const created = await this._repo.create(shipment.propsSnapshot);
    return created;
  }
}
