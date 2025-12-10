import type { Shipment, ShipmentProps } from "../entities/shipment";
import type { ListShipmentsDTO } from "./dto/list-shipment.dto";
import type { ListShipmentsResult } from "./dto/list-shipment.result";

export interface IShipmentRepository {
  create: (data: ShipmentProps) => Promise<Shipment>;
  findById: (id: string, tenantId: string) => Promise<Shipment | null>;
  list: (dto: ListShipmentsDTO) => Promise<ListShipmentsResult>;
  save: (shipment: Shipment) => Promise<Shipment>;
}
