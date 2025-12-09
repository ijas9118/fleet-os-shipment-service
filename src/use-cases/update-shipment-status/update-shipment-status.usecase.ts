import type { ShipmentStatus, UserRole } from "@ahammedijas/fleet-os-shared";

import type { IShipmentRepository } from "@/domain/repositories";

import type { UpdateShipmentStatusDTO } from "./update-shipment-status.dto";

import { rolePermissions } from "./role-permissions";

export class UpdateShipmentStatusUseCase {
  constructor(private _repo: IShipmentRepository) {}

  private canUpdateStatus(role: UserRole, newStatus: ShipmentStatus): boolean {
    const allowedStatuses = rolePermissions[role];
    if (!allowedStatuses)
      return false;

    return allowedStatuses.includes(newStatus);
  }

  async execute(dto: UpdateShipmentStatusDTO) {
    const { shipmentId, tenantId, newStatus, userRole } = dto;

    if (!this.canUpdateStatus(userRole, newStatus)) {
      throw new Error("Forbidden: role not allowed to set this status");
    }

    const shipment = await this._repo.findById(shipmentId, tenantId);
    if (!shipment) {
      throw new Error("Shipment not found");
    }

    // Let entity validate transition
    shipment.setStatus(newStatus);

    // Optionally: append to timeline inside entity here
    // shipment.addTimelineEntry(newStatus, userId);

    await this._repo.save(shipment);

    return shipment;
  }
}
