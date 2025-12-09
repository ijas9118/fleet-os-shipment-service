import type { Shipment } from "@/domain/entities/shipment";
import type { IShipmentRepository } from "@/domain/repositories";
import type { IShipmentCacheRepository } from "@/domain/repositories/shipment.cache.repository.interface";

import type { GetShipmentDTO } from "./get-shipment.dto";

export class GetShipmentUseCase {
  constructor(
    private readonly _shipmentRepo: IShipmentRepository,
    private readonly _cacheRepo: IShipmentCacheRepository,
  ) {}

  async execute(dto: GetShipmentDTO): Promise<Shipment | null> {
    const { id, tenantId } = dto;

    if (this._cacheRepo) {
      const cached = await this._cacheRepo.getById(id, tenantId);
      if (cached) {
        return cached;
      }
    }

    const shipment = await this._shipmentRepo.findById(id, tenantId);
    if (!shipment)
      return null;

    if (this._cacheRepo) {
      await this._cacheRepo.set(shipment);
    }

    return shipment;
  }
}
