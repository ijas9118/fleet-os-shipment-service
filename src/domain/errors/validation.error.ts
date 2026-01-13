import { DomainError } from "../entities/domain.error";

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
