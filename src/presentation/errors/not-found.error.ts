import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import { AppError } from "./app.error";

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.NOT_FOUND, "NOT_FOUND");
  }
}
