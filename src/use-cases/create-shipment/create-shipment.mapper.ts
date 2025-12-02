import type { Shipment } from "@/domain/entities/shipment";

export class CreateShipmentMapper {
  static toEntity(data: any): Shipment {
    return {
      trackingNumber: data.trackingNumber,
      clientId: data.clientId,
      status: data.status,
      pickupAddress: data.pickupAddress,
      deliveryAddress: data.deliveryAddress,

      assignedDriverId: data.assignedDriverId,
      assignedVehicleId: data.assignedVehicleId,

      currentLocation: data.currentLocation,

      items: data.items,

      estimatedDelivery: data.estimatedDelivery,
      actualDelivery: data.actualDelivery,

      timestampsLog: data.timestampsLog,
      pricing: data.pricing,

      isActive: data.isActive,
    };
  }
}
