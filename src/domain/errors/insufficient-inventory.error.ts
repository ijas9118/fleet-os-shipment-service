import { DomainError } from "../entities/domain.error";

export class InsufficientInventoryError extends DomainError {
  constructor(itemSku: string, required: number, available: number) {
    super(`Insufficient inventory for item ${itemSku}: required ${required}, available ${available}`);
  }
}
