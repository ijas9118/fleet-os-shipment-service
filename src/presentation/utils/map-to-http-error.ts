import {
  InvalidStatusTransitionError,
  PermissionDeniedError,
  ShipmentNotFoundError,
} from "@/domain/errors";

import {
  AppError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors";

export function mapToHttpError(err: unknown): AppError {
  if (err instanceof InvalidStatusTransitionError)
    return new BadRequestError(err.message);

  if (err instanceof PermissionDeniedError)
    return new ForbiddenError(err.message);

  if (err instanceof ShipmentNotFoundError)
    return new NotFoundError(err.message);

  if (err instanceof AppError)
    return err;

  // For unexpected errors
  return new AppError("Internal Server Error");
}
