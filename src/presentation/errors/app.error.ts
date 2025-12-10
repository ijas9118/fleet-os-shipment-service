import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = STATUS_CODES.INTERNAL_SERVER_ERROR,
    public code?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
