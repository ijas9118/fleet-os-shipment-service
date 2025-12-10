import { DomainError } from "../entities/domain.error";

export class ShipmentNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Shipment with id ${id} not found`);
  }
}
