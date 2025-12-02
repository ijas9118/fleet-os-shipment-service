export enum ShipmentStatus {
  PENDING = "PENDING",
  ASSIGNED = "ASSIGNED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface ShipmentItem {
  name: string;
  quantity: number;
  weight: number;
}

export interface ShipmentLocation {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface Shipment {
  trackingNumber: string;
  clientId: string;
  status: ShipmentStatus;
  pickupAddress: string;
  deliveryAddress: string;

  assignedDriverId?: string;
  assignedVehicleId?: string;

  currentLocation?: ShipmentLocation;

  items: ShipmentItem[];

  estimatedDelivery?: Date;
  actualDelivery?: Date;

  timestampsLog?: {
    pickedUpAt?: Date;
    inTransitAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
  };

  pricing?: {
    baseFee: number;
    distanceFee: number;
    total: number;
  };

  isActive?: boolean;
}
