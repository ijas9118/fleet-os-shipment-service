import type { IShipmentRepository } from "@/domain/repositories";
import type { IInventoryServiceClient } from "@/infrastructure/clients/inventory-service.client.interface";

import logger from "@/config/logger";
import { ShipmentNotFoundError } from "@/domain/errors";

import type { UpdateStatusDTO } from "./update-status.dto";

export class UpdateStatusUseCase {
  constructor(
    private _shipmentRepo: IShipmentRepository,
    private _inventoryClient: IInventoryServiceClient,
  ) {}

  async execute(dto: UpdateStatusDTO): Promise<void> {
    // Find shipment and verify tenant ownership
    const shipment = await this._shipmentRepo.findById(dto.shipmentId, dto.tenantId);

    if (!shipment) {
      throw new ShipmentNotFoundError(dto.shipmentId);
    }

    const oldStatus = shipment.status;

    // Update status using the entity method
    shipment.updateStatus(dto.newStatus);

    // Update notes if provided
    if (dto.notes) {
      shipment.updateNotes(dto.notes);
    }

    // Handle inventory updates based on status change
    await this._handleInventoryUpdate(shipment, oldStatus, dto);

    // Persist changes
    await this._shipmentRepo.update(dto.shipmentId, shipment.propsSnapshot);
  }

  private async _handleInventoryUpdate(
    shipment: any,
    oldStatus: string,
    dto: UpdateStatusDTO,
  ): Promise<void> {
    const newStatus = dto.newStatus;

    try {
      // PICKED: Confirm reservation and deduct actual stock
      if (newStatus === "PICKED" && shipment.inventoryReservationId) {
        await this._inventoryClient.confirmReservation({
          reservationId: shipment.inventoryReservationId,
          tenantId: dto.tenantId,
        });

        logger.info("Confirmed reservation for picked shipment", {
          shipmentId: dto.shipmentId,
          reservationId: shipment.inventoryReservationId,
        });
      }

      // RETURNED: Add stock back to warehouse
      if (newStatus === "RETURNED") {
        await this._inventoryClient.addStock({
          tenantId: dto.tenantId,
          warehouseId: shipment.warehouseId,
          items: shipment.items.map((item: any) => ({
            inventoryItemId: item.inventoryItemId,
            sku: item.sku,
            quantity: item.quantity,
          })),
          notes: `Returned from shipment ${shipment.trackingId}`,
        });

        logger.info("Added stock back for returned shipment", {
          shipmentId: dto.shipmentId,
          trackingId: shipment.trackingId,
        });
      }

      // CANCELLED: Release or add stock based on previous status
      if (newStatus === "CANCELLED") {
        // If shipment was PICKED or IN_TRANSIT, items are physical - add back
        if (oldStatus === "PICKED" || oldStatus === "IN_TRANSIT") {
          await this._inventoryClient.addStock({
            tenantId: dto.tenantId,
            warehouseId: shipment.warehouseId,
            items: shipment.items.map((item: any) => ({
              inventoryItemId: item.inventoryItemId,
              sku: item.sku,
              quantity: item.quantity,
            })),
            notes: `Cancelled shipment ${shipment.trackingId} - restoring stock`,
          });

          logger.info("Added stock back for cancelled shipment (was picked)", {
            shipmentId: dto.shipmentId,
            oldStatus,
          });
        }
        // If shipment was not picked yet, just release reservation
        else if (shipment.inventoryReservationId) {
          await this._inventoryClient.releaseReservation({
            reservationId: shipment.inventoryReservationId,
            tenantId: dto.tenantId,
          });

          logger.info("Released reservation for cancelled shipment", {
            shipmentId: dto.shipmentId,
            oldStatus,
          });
        }
      }
    }
    catch (error: any) {
      logger.error("Failed to update inventory during status change", {
        shipmentId: dto.shipmentId,
        oldStatus,
        newStatus,
        error: error.message,
      });

      // Re-throw to fail the status update
      throw new Error(`Failed to update inventory: ${error.message}`);
    }
  }
}
