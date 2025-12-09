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

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.BAD_REQUEST, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.NOT_FOUND, "NOT_FOUND");
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.BAD_REQUEST, "BAD_REQUEST");
  }
}
