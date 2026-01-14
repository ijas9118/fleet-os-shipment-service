import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { AssignToDriverUseCase } from "@/use-cases/assign-to-driver";
import type { ConfirmShipmentUseCase } from "@/use-cases/confirm-shipment";
import type { CreateShipmentUseCase } from "@/use-cases/create-shipment";
import type { DeleteShipmentUseCase } from "@/use-cases/delete-shipment";
import type { GetShipmentUseCase } from "@/use-cases/get-shipment";
import type { ListShipmentsUseCase } from "@/use-cases/list-shipments";
import type { UpdateShipmentUseCase } from "@/use-cases/update-shipment";
import type { UpdateStatusUseCase } from "@/use-cases/update-status";

import { asyncHandler } from "../utils/async-handler";
import { RequestHelper } from "../utils/request.helper";
import { ResponseHelper } from "../utils/response.helper";

export class ShipmentController {
  constructor(
    private _createShipmentUC: CreateShipmentUseCase,
    private _listShipmentsUC: ListShipmentsUseCase,
    private _getShipmentUC: GetShipmentUseCase,
    private _updateShipmentUC: UpdateShipmentUseCase,
    private _confirmShipmentUC: ConfirmShipmentUseCase,
    private _deleteShipmentUC: DeleteShipmentUseCase,
    private _updateStatusUC: UpdateStatusUseCase,
    private _assignToDriverUC: AssignToDriverUseCase,
  ) {}

  createShipment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const dto = {
      ...req.body,
      tenantId,
    };

    const shipment = await this._createShipmentUC.execute(dto);

    ResponseHelper.created(res, "Shipment created successfully", {
      id: shipment.id,
      trackingId: shipment.trackingId,
      status: shipment.status,
      warehouseId: shipment.warehouseId,
      itemCount: shipment.items.length,
      customer: shipment.customer,
      destinationAddress: shipment.destinationAddress,
      inventoryReservationId: shipment.inventoryReservationId,
      estimatedDeliveryDate: shipment.estimatedDeliveryDate,
      createdAt: shipment.createdAt,
    });
  });

  listShipments = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId as string;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const { page, limit, search, status } = RequestHelper.parsePaginationParams(req.query);
    const warehouseId = req.query.warehouseId as string | undefined;
    const customerId = req.query.customerId as string | undefined;
    const includeDeleted = req.query.includeDeleted === "true";

    // Parse date range if provided
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    // If user is a driver, automatically filter by their ID
    const driverId = userRole === "DRIVER" ? userId : undefined;

    const result = await this._listShipmentsUC.execute({
      tenantId,
      page,
      limit,
      search,
      status,
      warehouseId,
      customerId,
      driverId,
      startDate,
      endDate,
      includeDeleted,
    });

    ResponseHelper.success(res, "Shipments retrieved successfully", result);
  });

  getShipment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const shipment = await this._getShipmentUC.execute({
      shipmentId: id as string,
      tenantId,
    });

    ResponseHelper.success(res, "Shipment retrieved successfully", {
      id: shipment.id,
      trackingId: shipment.trackingId,
      status: shipment.status,
      warehouseId: shipment.warehouseId,
      items: shipment.items,
      customer: shipment.customer,
      destinationAddress: shipment.destinationAddress,
      inventoryReservationId: shipment.inventoryReservationId,
      notes: shipment.notes,
      estimatedDeliveryDate: shipment.estimatedDeliveryDate,
      actualDeliveryDate: shipment.actualDeliveryDate,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    });
  });

  updateShipment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    const dto = {
      shipmentId: id as string,
      tenantId,
      ...req.body,
    };

    await this._updateShipmentUC.execute(dto);

    ResponseHelper.success(res, "Shipment updated successfully");
  });

  confirmShipment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._confirmShipmentUC.execute({
      shipmentId: id as string,
      tenantId,
    });

    ResponseHelper.success(res, "Shipment confirmed successfully");
  });

  deleteShipment = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._deleteShipmentUC.execute({
      shipmentId: id as string,
      tenantId,
    });

    ResponseHelper.success(res, "Shipment deleted successfully");
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const userId = req.user?.id;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    if (!userId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    await this._updateStatusUC.execute({
      shipmentId: id as string,
      tenantId,
      userId,
      newStatus: req.body.newStatus,
      notes: req.body.notes,
    });

    ResponseHelper.success(res, "Shipment status updated successfully");
  });

  assignToDriver = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Tenant ID not found in request",
      });
    }

    await this._assignToDriverUC.execute({
      shipmentId: id as string,
      tenantId,
      driverId: req.body.driverId,
      driverName: req.body.driverName,
    });

    ResponseHelper.success(res, "Shipment assigned to driver successfully");
  });
}
