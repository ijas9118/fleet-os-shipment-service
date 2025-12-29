import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { CreateShipmentUseCase } from "@/use-cases/create-shipment";
import type { GetShipmentUseCase } from "@/use-cases/get-shipment/get-shipment.usecase";
import type { ListShipmentsUseCase } from "@/use-cases/list-shipments/list-shipment.usecase";
import type { UpdateShipmentStatusUseCase } from "@/use-cases/update-shipment-status";

import { MESSAGES } from "@/config/messages.constant";

import { asyncHandler } from "../utils/async-handler";

export class ShipmentController {
  constructor(
    private _createShipmentUseCase: CreateShipmentUseCase,
    private _getShipmentUseCase: GetShipmentUseCase,
    private _listShipmentsUseCase: ListShipmentsUseCase,
    private _updateShipmentStatusUseCase: UpdateShipmentStatusUseCase,
  ) {}

  createShipment = asyncHandler(async (req: Request, res: Response) => {
    const dto = { ...req.body };
    const shipment = await this._createShipmentUseCase.execute(dto);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: shipment.propsSnapshot,
    });
  });

  getShipmentById = asyncHandler(async (req: Request, res: Response) => {
    const tenantId = req.user?.tenantId as string;
    const id = req.params.id as string;
    const shipment = await this._getShipmentUseCase.execute({ id, tenantId });

    if (!shipment)
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: MESSAGES.SHIPMENT.NOT_FOUND });

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: shipment,
    });
  });

  listShipments = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._listShipmentsUseCase.execute({
      tenantId: req.user?.tenantId as string,
      ...req.query,
    });

    res.status(STATUS_CODES.OK).json(result);
  });

  updateShipmentStatus = asyncHandler(async (req: Request, res: Response) => {
    const { user } = req;
    const { id } = req.params;

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.ERROR.UNAUTHORIZED });
    }

    const shipment = await this._updateShipmentStatusUseCase.execute({
      shipmentId: id,
      tenantId: user.tenantId,
      newStatus: req.body.status,
      userId: user.id,
      userRole: user.role,
    });
    res.status(STATUS_CODES.OK).json({ message: MESSAGES.SHIPMENT.STATUS_UPDATED, data: shipment });
  });
}
