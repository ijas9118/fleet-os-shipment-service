import type { ShipmentStatus } from "@ahammedijas/fleet-os-shared";

export interface ShipmentItem {
  inventoryItemId: string;
  quantity: number;
  uom: string;
}

export interface ShipmentProps {
  readonly id?: string;
  readonly tenantId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    referenceCode?: string;
  };
  originWarehouseId: string;
  destinationAddress: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  items: ShipmentItem[];
  status: ShipmentStatus;
  reservationId?: string;
  assignmentId?: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Shipment {
  private props: ShipmentProps;

  constructor(props: ShipmentProps) {
    this.props = {
      priority: "NORMAL",
      ...props,
    };
  }

  get id() { return this.props.id; }
  get tenantId() { return this.props.tenantId; }
  get status() { return this.props.status; }
  get propsSnapshot() { return { ...this.props }; }

  setStatus(status: ShipmentStatus) {
    this.props.status = status;
  }
}
