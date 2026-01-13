import type { Shipment, ShipmentProps } from "@/domain/entities";
import type { IShipmentRepository, ListShipmentsOptions } from "@/domain/repositories";

import { Shipment as ShipmentEntity } from "@/domain/entities";

import { ShipmentModel } from "../models/shipment.model";

export class ShipmentRepositoryMongo implements IShipmentRepository {
  private _mapToEntity(doc: any): ShipmentEntity {
    return new ShipmentEntity({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      warehouseId: doc.warehouseId.toString(),
      trackingId: doc.trackingId,
      status: doc.status,
      items: doc.items.map((item: any) => ({
        inventoryItemId: item.inventoryItemId,
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      })),
      destinationAddress: {
        line1: doc.destinationAddress.line1,
        line2: doc.destinationAddress.line2,
        city: doc.destinationAddress.city,
        state: doc.destinationAddress.state,
        postalCode: doc.destinationAddress.postalCode,
        country: doc.destinationAddress.country,
        coordinates: doc.destinationAddress.coordinates
          ? {
              lat: doc.destinationAddress.coordinates.lat,
              lng: doc.destinationAddress.coordinates.lng,
            }
          : undefined,
      },
      customer: {
        name: doc.customer.name,
        email: doc.customer.email,
        phone: doc.customer.phone,
      },
      inventoryReservationId: doc.inventoryReservationId,
      notes: doc.notes,
      estimatedDeliveryDate: doc.estimatedDeliveryDate,
      actualDeliveryDate: doc.actualDeliveryDate,
      deletedAt: doc.deletedAt ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(shipment: Shipment): Promise<Shipment> {
    const props = shipment.propsSnapshot;

    const created = await ShipmentModel.create({
      tenantId: props.tenantId,
      warehouseId: props.warehouseId,
      trackingId: props.trackingId,
      status: props.status,
      items: props.items,
      destinationAddress: props.destinationAddress,
      customer: props.customer,
      inventoryReservationId: props.inventoryReservationId,
      notes: props.notes,
      estimatedDeliveryDate: props.estimatedDeliveryDate,
      actualDeliveryDate: props.actualDeliveryDate,
    });

    return this._mapToEntity(created);
  }

  async findById(id: string, tenantId: string): Promise<Shipment | null> {
    const doc = await ShipmentModel.findOne({ _id: id, tenantId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async findByTrackingId(trackingId: string): Promise<Shipment | null> {
    const doc = await ShipmentModel.findOne({ trackingId });

    if (!doc) {
      return null;
    }

    return this._mapToEntity(doc);
  }

  async list(options: ListShipmentsOptions): Promise<{ shipments: Shipment[]; total: number }> {
    const {
      tenantId,
      page,
      limit,
      search,
      status,
      warehouseId,
      customerId,
      startDate,
      endDate,
      includeDeleted,
    } = options;

    // Build query
    const query: any = { tenantId };

    // Filter out deleted shipments by default
    if (!includeDeleted) {
      query.deletedAt = null;
    }

    // Text search on trackingId, customer name/email
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by warehouse
    if (warehouseId) {
      query.warehouseId = warehouseId;
    }

    // Filter by customer (email match)
    if (customerId) {
      query["customer.email"] = customerId; // Using email as customer identifier
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = startDate;
      }
      if (endDate) {
        query.createdAt.$lte = endDate;
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      ShipmentModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      ShipmentModel.countDocuments(query),
    ]);

    const shipments = docs.map(doc => this._mapToEntity(doc));

    return { shipments, total };
  }

  async update(id: string, updates: Partial<ShipmentProps>): Promise<void> {
    const updateData: any = {};

    if (updates.status !== undefined)
      updateData.status = updates.status;
    if (updates.items !== undefined)
      updateData.items = updates.items;
    if (updates.destinationAddress !== undefined)
      updateData.destinationAddress = updates.destinationAddress;
    if (updates.customer !== undefined)
      updateData.customer = updates.customer;
    if (updates.inventoryReservationId !== undefined)
      updateData.inventoryReservationId = updates.inventoryReservationId;
    if (updates.notes !== undefined)
      updateData.notes = updates.notes;
    if (updates.estimatedDeliveryDate !== undefined)
      updateData.estimatedDeliveryDate = updates.estimatedDeliveryDate;
    if (updates.actualDeliveryDate !== undefined)
      updateData.actualDeliveryDate = updates.actualDeliveryDate;
    if (updates.deletedAt !== undefined)
      updateData.deletedAt = updates.deletedAt;
    if (updates.updatedAt !== undefined)
      updateData.updatedAt = updates.updatedAt;

    await ShipmentModel.updateOne({ _id: id }, { $set: updateData });
  }

  async delete(id: string): Promise<void> {
    await ShipmentModel.updateOne(
      { _id: id },
      {
        $set: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );
  }
}
