import { ShipmentController } from "@/presentation/controllers/shipment.controller";
import { CreateShipmentUseCase } from "@/use-cases/create-shipment";

import { MongoShipmentRepository } from "../repositories/shipment.repository";
import { UuidIdGenerator } from "../services/uuid-id-generator";

export class ShipmentFactory {
  static createController(): ShipmentController {
    const repository = new MongoShipmentRepository();
    const idGenerator = new UuidIdGenerator();

    const createShipmentUseCase = new CreateShipmentUseCase(
      repository,
      idGenerator,
    );

    return new ShipmentController(createShipmentUseCase);
  }
}
