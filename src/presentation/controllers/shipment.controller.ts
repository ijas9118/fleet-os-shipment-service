import type { Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import type { CreateShipmentInput, CreateShipmentUseCase } from "@/use-cases/create-shipment";

import { asyncHandler } from "../utils/async-handler";

export class ShipmentController {
  constructor(
    private _createShipmentUseCase: CreateShipmentUseCase,
  ) {}

  createShipment = asyncHandler(async (req: Request, res: Response) => {
    const input: CreateShipmentInput = {
      clientId: req.body.clientId,
      pickupAddress: req.body.pickupAddress,
      deliveryAddress: req.body.deliveryAddress,
      items: req.body.items,
    };

    const shipment = await this._createShipmentUseCase.execute(input);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      data: shipment,
    });
  });
}
