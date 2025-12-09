import type { IShipmentCacheRepository, IShipmentRepository } from "@/domain/repositories";

import type { ListShipmentsDTO } from "../../domain/repositories/dto/list-shipment.dto";
import type { ListShipmentsResult } from "../../domain/repositories/dto/list-shipment.result";

export class ListShipmentsUseCase {
  constructor(
    private _repo: IShipmentRepository,
    private _cacheRepo: IShipmentCacheRepository,
  ) {}

  async execute(dto: ListShipmentsDTO): Promise<ListShipmentsResult> {
    const page = Math.max(1, dto.page ?? 1);
    const limit = Math.min(Math.max(1, dto.limit ?? 10), 100);

    return this._repo.list({
      tenantId: dto.tenantId,
      page,
      limit,
      search: dto.search?.trim(),
      sortBy: dto.sortBy,
      sortOrder: dto.sortOrder,
      includeCancelled: !!dto.includeCancelled,
    });
  }
}
