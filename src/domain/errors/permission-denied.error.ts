import type { ShipmentStatus } from "../enums";

import { DomainError } from "../entities/domain.error";

export class PermissionDeniedError extends DomainError {
  constructor(role: string, status: ShipmentStatus) {
    super(`Role ${role} cannot set status ${status}`);
  }
}
