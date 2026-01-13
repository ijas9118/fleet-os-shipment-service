import type { ShipmentStatus } from "../enums";

import { DomainError } from "../entities/domain.error";

export class InvalidStatusTransitionError extends DomainError {
  constructor(current: ShipmentStatus, next: ShipmentStatus) {
    super(`Invalid status transition: ${current} → ${next}`);
  }
}
