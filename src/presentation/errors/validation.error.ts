import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import { AppError } from "./app.error";

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.BAD_REQUEST, "VALIDATION_ERROR");
  }
}
