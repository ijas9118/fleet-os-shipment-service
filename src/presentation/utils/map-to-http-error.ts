import {
  InsufficientInventoryError,
  ValidationError,
} from "@/domain/errors";

import {
  AppError,
  BadRequestError,
} from "../errors";

export function mapToHttpError(err: unknown): AppError {
  if (err instanceof ValidationError)
    return new BadRequestError(err.message);

  if (err instanceof InsufficientInventoryError) {
    const error = new BadRequestError(err.message);
    // Attach metadata for better error responses
    (error as any).code = "INSUFFICIENT_INVENTORY";
    (error as any).details = {
      sku: (err as any).itemSku,
      required: (err as any).required,
      available: (err as any).available,
    };
    return error;
  }

  // if (err instanceof InvalidStatusTransitionError)
  //   return new BadRequestError(err.message);

  // if (err instanceof PermissionDeniedError)
  //   return new ForbiddenError(err.message);

  // if (err instanceof ShipmentNotFoundError)
  //   return new NotFoundError(err.message);

  if (err instanceof AppError)
    return err;

  // For unexpected errors
  return new AppError("Internal Server Error");
}
