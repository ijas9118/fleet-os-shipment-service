import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import { AppError } from "./app.error";

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.FORBIDDEN, "FORBIDDEN");
  }
}
