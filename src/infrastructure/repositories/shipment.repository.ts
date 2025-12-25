import { ShipmentStatus } from "@ahammedijas/fleet-os-shared";
import mongoose from "mongoose";

import type { Shipment, ShipmentProps } from "@/domain/entities/shipment";
import type { IShipmentRepository } from "@/domain/repositories";
import type { ListShipmentsDTO } from "@/domain/repositories/dto/list-shipment.dto";
import type { ListShipmentsResult } from "@/domain/repositories/dto/list-shipment.result";

import { ShipmentNotFoundError } from "@/domain/errors";

import { ShipmentMapper } from "../mappers/shipment.mapper";
import { ShipmentModel } from "../models/shipment.model";

export class ShipmentRepositoryMongo implements IShipmentRepository {
  async create(data: ShipmentProps): Promise<Shipment> {
    const doc = await ShipmentModel.create(data);

    return ShipmentMapper.toDomain(doc);
  }

  async findById(id: string, tenantId: string): Promise<Shipment | null> {
    const doc = await ShipmentModel.findOne({ _id: id, tenantId });
    if (!doc)
      throw new ShipmentNotFoundError(id);

    return ShipmentMapper.toDomain(doc);
  }

  async list(dto: ListShipmentsDTO): Promise<ListShipmentsResult> {
    const {
      tenantId,
      page = 1,
      limit = 10,
      search,
      sortBy,
      sortOrder,
      includeCancelled = false,
    } = dto;
    const query: any = {
      tenantId: new mongoose.Types.ObjectId(tenantId),
    };

    if (!includeCancelled) {
      query.status = { $ne: ShipmentStatus.CANCELLED };
    }

    if (search) {
      query.$or = [
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy || "createdAt"] = sortOrder === "desc" ? -1 : 1;

    const [shipmentsAgg, totalAgg] = await Promise.all([
      ShipmentModel.aggregate([
        { $match: query },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        { $project: {
          tenantId: 1,
          customer: 1,
          originWarehouseId: 1,
          destinationAddress: 1,
          items: 1,
          status: 1,
          reservationId: 1,
          assignmentId: 1,
          priority: 1,
          createdAt: 1,
          updatedAt: 1,
        } },
        { $sort: { _id: 1 } },
      ]),
      ShipmentModel.countDocuments(query),
    ]);

    const shipments = shipmentsAgg.map(doc => ({
      id: doc._id.toString(),
      tenantId: doc.tenantId.toString(),
      customer: doc.customer,
      originWarehouseId: doc.originWarehouseId.toString(),
      destinationAddress: doc.destinationAddress,
      items: doc.items,
      status: doc.status,
      reservationId: doc.reservationId?.toString(),
      assignmentId: doc.assignmentId?.toString(),
      priority: doc.priority,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    const totalPages = Math.ceil(totalAgg / limit);

    return {
      shipments,
      pagination: {
        page,
        limit,
        total: totalAgg,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async save(shipment: Shipment): Promise<Shipment> {
    const object = {
      tenantId: shipment.tenantId,
      customer: shipment.customer,
      originWarehouseId: shipment.originWarehouseId,
      destinationAddress: shipment.destinationAddress,
      items: shipment.items,
      status: shipment.status,
      reservationId: shipment.reservationId,
      assignmentId: shipment.assignmentId,
      priority: shipment.priority,
      createdAt: shipment.createdAt,
      updatedAt: new Date(),
    };

    const updatedDoc = await ShipmentModel.findOneAndUpdate(
      {
        _id: shipment.id,
        tenantId: shipment.tenantId,
      },
      { $set: object },
      { new: true, upsert: false },
    );

    if (!updatedDoc) {
      throw new ShipmentNotFoundError(shipment.id as string);
    }

    return ShipmentMapper.toDomain(updatedDoc);
  }
}
