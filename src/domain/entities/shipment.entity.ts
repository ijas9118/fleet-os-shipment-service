import { ShipmentStatus } from "../enums";
import { ValidationError } from "../errors";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone?: string;
}

export interface ShipmentItem {
  inventoryItemId: string;
  sku: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface ShipmentProps {
  id?: string;
  tenantId: string;
  warehouseId: string;
  trackingId: string;
  status: ShipmentStatus;
  items: ShipmentItem[];
  destinationAddress: Address;
  customer: CustomerDetails;
  inventoryReservationId?: string; // Reference to inventory service reservation
  driverId?: string; // Reference to assigned driver
  driverName?: string; // Driver's name for quick access
  notes?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Shipment {
  private readonly _props: ShipmentProps;

  constructor(props: ShipmentProps) {
    this._validateProps(props);
    this._props = { ...props };
  }

  private _validateProps(props: ShipmentProps): void {
    if (!props.tenantId || props.tenantId.trim() === "") {
      throw new ValidationError("Tenant ID is required");
    }

    if (!props.warehouseId || props.warehouseId.trim() === "") {
      throw new ValidationError("Warehouse ID is required");
    }

    if (!props.trackingId || props.trackingId.trim() === "") {
      throw new ValidationError("Tracking ID is required");
    }

    if (!props.items || props.items.length === 0) {
      throw new ValidationError("At least one item is required for shipment");
    }

    // Validate items
    this._validateItems(props.items);

    // Validate destination address
    this._validateAddress(props.destinationAddress);

    // Validate customer details
    this._validateCustomer(props.customer);
  }

  private _validateItems(items: ShipmentItem[]): void {
    for (const item of items) {
      if (!item.inventoryItemId || item.inventoryItemId.trim() === "") {
        throw new ValidationError("Inventory item ID is required for each item");
      }

      if (!item.sku || item.sku.trim() === "") {
        throw new ValidationError("SKU is required for each item");
      }

      if (!item.name || item.name.trim() === "") {
        throw new ValidationError("Item name is required for each item");
      }

      if (!item.unit || item.unit.trim() === "") {
        throw new ValidationError("Unit is required for each item");
      }

      if (item.quantity <= 0) {
        throw new ValidationError(`Quantity must be greater than zero for item ${item.sku}`);
      }
    }
  }

  private _validateAddress(address: Address): void {
    if (!address) {
      throw new ValidationError("Destination address is required");
    }

    if (!address.line1 || address.line1.trim() === "") {
      throw new ValidationError("Address line1 is required");
    }

    if (!address.city || address.city.trim() === "") {
      throw new ValidationError("Address city is required");
    }

    if (!address.country || address.country.trim() === "") {
      throw new ValidationError("Address country is required");
    }

    // Validate coordinates if provided
    if (address.coordinates) {
      const { lat, lng } = address.coordinates;
      if (lat < -90 || lat > 90) {
        throw new ValidationError("Invalid latitude: must be between -90 and 90");
      }
      if (lng < -180 || lng > 180) {
        throw new ValidationError("Invalid longitude: must be between -180 and 180");
      }
    }
  }

  private _validateCustomer(customer: CustomerDetails): void {
    if (!customer) {
      throw new ValidationError("Customer details are required");
    }

    if (!customer.name || customer.name.trim() === "") {
      throw new ValidationError("Customer name is required");
    }

    if (!customer.email || customer.email.trim() === "") {
      throw new ValidationError("Customer email is required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      throw new ValidationError("Invalid customer email format");
    }
  }

  // Getters
  get id(): string | undefined {
    return this._props.id;
  }

  get tenantId(): string {
    return this._props.tenantId;
  }

  get warehouseId(): string {
    return this._props.warehouseId;
  }

  get trackingId(): string {
    return this._props.trackingId;
  }

  get status(): ShipmentStatus {
    return this._props.status;
  }

  get items(): ShipmentItem[] {
    return [...this._props.items];
  }

  get destinationAddress(): Address {
    return { ...this._props.destinationAddress };
  }

  get customer(): CustomerDetails {
    return { ...this._props.customer };
  }

  get inventoryReservationId(): string | undefined {
    return this._props.inventoryReservationId;
  }

  get driverId(): string | undefined {
    return this._props.driverId;
  }

  get driverName(): string | undefined {
    return this._props.driverName;
  }

  get notes(): string | undefined {
    return this._props.notes;
  }

  get estimatedDeliveryDate(): Date | undefined {
    return this._props.estimatedDeliveryDate;
  }

  get actualDeliveryDate(): Date | undefined {
    return this._props.actualDeliveryDate;
  }

  get createdAt(): Date | undefined {
    return this._props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this._props.deletedAt;
  }

  get propsSnapshot(): ShipmentProps {
    return {
      ...this._props,
      items: [...this._props.items],
      destinationAddress: { ...this._props.destinationAddress },
      customer: { ...this._props.customer },
    };
  }

  // Business methods
  confirm(): void {
    if (this._props.status !== "PENDING") {
      throw new ValidationError("Only pending shipments can be confirmed");
    }
    this._props.status = "CONFIRMED" as ShipmentStatus;
    this._props.updatedAt = new Date();
  }

  markAsPicked(): void {
    if (this._props.status !== "CONFIRMED") {
      throw new ValidationError("Only confirmed shipments can be marked as picked");
    }
    this._props.status = "PICKED" as ShipmentStatus;
    this._props.updatedAt = new Date();
  }

  markAsInTransit(): void {
    if (this._props.status !== "PICKED") {
      throw new ValidationError("Only picked shipments can be marked as in transit");
    }
    this._props.status = "IN_TRANSIT" as ShipmentStatus;
    this._props.updatedAt = new Date();
  }

  deliver(deliveryDate?: Date): void {
    if (this._props.status !== "IN_TRANSIT") {
      throw new ValidationError("Only in-transit shipments can be delivered");
    }
    this._props.status = "DELIVERED" as ShipmentStatus;
    this._props.actualDeliveryDate = deliveryDate || new Date();
    this._props.updatedAt = new Date();
    // Note: Inventory service should be called to release reservation
  }

  cancel(): void {
    if (this._props.status === "DELIVERED" || this._props.status === "CANCELLED") {
      throw new ValidationError("Cannot cancel a delivered or already cancelled shipment");
    }
    this._props.status = "CANCELLED" as ShipmentStatus;
    this._props.updatedAt = new Date();
    // Note: Inventory service should be called to release reservation
  }

  markAsReturned(): void {
    if (this._props.status !== "DELIVERED") {
      throw new ValidationError("Only delivered shipments can be marked as returned");
    }
    this._props.status = "RETURNED" as ShipmentStatus;
    this._props.updatedAt = new Date();
  }

  archive(): void {
    this._props.deletedAt = new Date();
    this._props.updatedAt = new Date();
  }

  updateDestinationAddress(address: Address): void {
    if (this._props.status !== "PENDING" && this._props.status !== "CONFIRMED") {
      throw new ValidationError("Cannot update destination address after shipment is picked");
    }
    this._validateAddress(address);
    this._props.destinationAddress = { ...address };
    this._props.updatedAt = new Date();
  }

  updateCustomerDetails(customer: CustomerDetails): void {
    this._validateCustomer(customer);
    this._props.customer = { ...customer };
    this._props.updatedAt = new Date();
  }

  updateNotes(notes: string): void {
    this._props.notes = notes;
    this._props.updatedAt = new Date();
  }

  updateEstimatedDeliveryDate(date: Date): void {
    this._props.estimatedDeliveryDate = date;
    this._props.updatedAt = new Date();
  }

  updateStatus(newStatus: ShipmentStatus): void {
    // Define allowed transitions for drivers
    const allowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
      [ShipmentStatus.PENDING]: [ShipmentStatus.CONFIRMED, ShipmentStatus.CANCELLED],
      [ShipmentStatus.CONFIRMED]: [ShipmentStatus.PICKED, ShipmentStatus.CANCELLED],
      [ShipmentStatus.PICKED]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.CANCELLED],
      [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.DELIVERED, ShipmentStatus.RETURNED],
      [ShipmentStatus.DELIVERED]: [ShipmentStatus.RETURNED],
      [ShipmentStatus.CANCELLED]: [],
      [ShipmentStatus.RETURNED]: [],
    };

    const currentStatus = this._props.status;
    const allowed = allowedTransitions[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Invalid status transition: cannot change from ${currentStatus} to ${newStatus}`,
      );
    }

    this._props.status = newStatus;
    this._props.updatedAt = new Date();

    // Auto-set delivery date when marked as delivered
    if (newStatus === ShipmentStatus.DELIVERED && !this._props.actualDeliveryDate) {
      this._props.actualDeliveryDate = new Date();
    }
  }

  assignToDriver(driverId: string, driverName: string): void {
    if (this._props.status !== ShipmentStatus.CONFIRMED) {
      throw new ValidationError("Only confirmed shipments can be assigned to drivers");
    }

    if (!driverId || driverId.trim() === "") {
      throw new ValidationError("Driver ID is required");
    }

    if (!driverName || driverName.trim() === "") {
      throw new ValidationError("Driver name is required");
    }

    this._props.driverId = driverId;
    this._props.driverName = driverName;
    this._props.updatedAt = new Date();
  }
}
