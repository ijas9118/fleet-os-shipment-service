import type { Shipment } from "@/domain/entities/shipment";
import type { IShipmentRepository } from "@/domain/repositories";
import type { ICacheRepository } from "@/infrastructure/cache/cache.repository";

import { Shipment as ShipmentEntity } from "@/domain/entities/shipment";
import { ShipmentNotFoundError } from "@/domain/errors";

import type { GetShipmentDTO } from "./get-shipment.dto";

const TTL_SECONDS = 60;
export class GetShipmentUseCase {
  constructor(
    private readonly _shipmentRepo: IShipmentRepository,
    private readonly _cache?: ICacheRepository,
  ) {}

  private makeKey(id: string, tenantId: string) {
    return `shipment:${tenantId}:${id}`;
  }

  async execute(dto: GetShipmentDTO): Promise<Shipment | null> {
    const { id, tenantId } = dto;
    const key = this.makeKey(id, tenantId);

    if (this._cache) {
      const cached = await this._cache.get<Shipment>(key);
      if (cached) {
        return new ShipmentEntity(cached);
      }
    }

    const shipment = await this._shipmentRepo.findById(id, tenantId);
    if (!shipment)
      throw new ShipmentNotFoundError(id);

    if (this._cache) {
      await this._cache.set(key, shipment.propsSnapshot, TTL_SECONDS);
    }

    return shipment;
  }
}
