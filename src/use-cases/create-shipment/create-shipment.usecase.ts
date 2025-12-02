import type { Shipment } from "@/domain/entities/shipment";
import type { IdGenerator } from "@/domain/interfaces/id-generator.interface";
import type { ShipmentRepository } from "@/domain/repositories/shipment.repository";

import { ShipmentStatus } from "@/domain/entities/shipment";

import type { CreateShipmentInput } from "./create-shipment.input.dto";

import { CreateShipmentMapper } from "./create-shipment.mapper";

export class CreateShipmentUseCase {
  constructor(
    private _repo: ShipmentRepository,
    private _idGenerator: IdGenerator,
  ) {}

  async execute(input: CreateShipmentInput): Promise<Shipment> {
    const trackingNumber = `SHIP-${this._idGenerator.generate().slice(0, 8)}`;

    const shipmentData = {
      trackingNumber,
      clientId: input.clientId,
      status: ShipmentStatus.PENDING,
      pickupAddress: input.pickupAddress,
      deliveryAddress: input.deliveryAddress,
      items: input.items,
      isActive: true,
    };
    const result = await this._repo.create(shipmentData);

    return CreateShipmentMapper.toEntity(result);
  }
}
