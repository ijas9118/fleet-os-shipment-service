import type { ShipmentStatus } from "@ahammedijas/fleet-os-shared";

import { InvalidStatusTransitionError } from "../errors";
import { validTransitions } from "./valid-transitions";

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
  get customer() { return this.props.customer; }
  get originWarehouseId() { return this.props.originWarehouseId; }
  get destinationAddress() { return this.props.destinationAddress; }
  get items() { return this.props.items; }
  get status() { return this.props.status; }
  get reservationId() { return this.props.reservationId; }
  get assignmentId() { return this.props.assignmentId; }
  get priority() { return this.props.priority; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  get propsSnapshot() { return { ...this.props }; }

  setStatus(next: ShipmentStatus) {
    const allowed = validTransitions[this.props.status] ?? [];
    if (!allowed.includes(next)) {
      throw new InvalidStatusTransitionError(this.props.status, next);
    }
    this.props.status = next;
    this.props.updatedAt = new Date();
  }
}
