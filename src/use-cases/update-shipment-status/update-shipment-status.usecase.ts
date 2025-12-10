import type { ShipmentStatus, UserRole } from "@ahammedijas/fleet-os-shared";

import type { IShipmentRepository } from "@/domain/repositories";
import type { ICacheRepository } from "@/infrastructure/cache/cache.repository";

import { PermissionDeniedError, ShipmentNotFoundError } from "@/domain/errors";

import type { UpdateShipmentStatusDTO } from "./update-shipment-status.dto";

import { rolePermissions } from "./role-permissions";

export class UpdateShipmentStatusUseCase {
  constructor(
    private readonly _repo: IShipmentRepository,
    private readonly _cache?: ICacheRepository,
  ) {}

  private makeKey(id: string, tenantId: string) {
    return `shipment:${tenantId}:${id}`;
  }

  private canUpdateStatus(role: UserRole, newStatus: ShipmentStatus): boolean {
    const allowedStatuses = rolePermissions[role];
    if (!allowedStatuses)
      return false;

    return allowedStatuses.includes(newStatus);
  }

  async execute(dto: UpdateShipmentStatusDTO) {
    const { shipmentId, tenantId, newStatus, userRole } = dto;

    if (!this.canUpdateStatus(userRole, newStatus)) {
      throw new PermissionDeniedError(userRole, newStatus);
    }

    const shipment = await this._repo.findById(shipmentId, tenantId);
    if (!shipment) {
      throw new ShipmentNotFoundError(shipmentId);
    }

    shipment.setStatus(newStatus);

    // Optionally: append to timeline inside entity here
    // shipment.addTimelineEntry(newStatus, userId);

    await this._repo.save(shipment);

    if (this._cache) {
      await this._cache.delete(this.makeKey(shipmentId, tenantId));
    }

    return shipment;
  }
}
