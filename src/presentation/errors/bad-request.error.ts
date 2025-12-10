import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import { AppError } from "./app.error";

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.BAD_REQUEST, "BAD_REQUEST");
  }
}
