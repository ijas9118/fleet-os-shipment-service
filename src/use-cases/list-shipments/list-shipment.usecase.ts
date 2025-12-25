import type { IShipmentRepository } from "@/domain/repositories";

import type { ListShipmentsDTO } from "../../domain/repositories/dto/list-shipment.dto";
import type { ListShipmentsResult } from "../../domain/repositories/dto/list-shipment.result";

export class ListShipmentsUseCase {
  constructor(private readonly _repo: IShipmentRepository) {}

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
      // startDate: dto.endDate,
      // endDate: dto.endDate,
      includeCancelled: !!dto.includeCancelled,
    });
  }
}
