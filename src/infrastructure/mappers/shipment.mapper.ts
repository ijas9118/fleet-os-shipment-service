import type { Shipment } from "@/domain/entities/shipment";

import { Shipment as ShipmentEntity } from "@/domain/entities/shipment";

import type { ShipmentDocument } from "../models/shipment.types";

export class ShipmentMapper {
  static toDomain(doc: ShipmentDocument): Shipment {
    return new ShipmentEntity({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      customer: doc.customer,
      originWarehouseId: doc.originWarehouseId.toString(),
      destinationAddress: doc.destinationAddress,
      items: doc.items.map(item => ({
        inventoryItemId: item.inventoryItemId.toString(),
        quantity: item.quantity,
        uom: item.uom,
      })),
      status: doc.status,
      reservationId: doc.reservationId?.toString(),
      assignmentId: doc.assignmentId?.toString(),
      priority: doc.priority,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
