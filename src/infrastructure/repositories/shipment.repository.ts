import type { Shipment } from "@/domain/entities/shipment";
import type { ShipmentRepository } from "@/domain/repositories/shipment.repository";

import { ShipmentModel } from "../models/shipment.model";

export class MongoShipmentRepository implements ShipmentRepository {
  async create(shipmentData: any): Promise<Shipment> {
    return await ShipmentModel.create(shipmentData);
  }
}
