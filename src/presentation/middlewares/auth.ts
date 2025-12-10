import type { UserRole } from "@ahammedijas/fleet-os-shared";
import type { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

export function authMiddleware(requiredRoles?: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["x-user-id"] as string;
    const tenantId = req.headers["x-tenant-id"] as string;
    const role = req.headers["x-role"] as UserRole;
    const email = req.headers["x-user-email"] as string;

    if (requiredRoles && !requiredRoles.includes(role)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        error: "Insufficient permissions",
        required: requiredRoles,
        has: role,
      });
    }

    req.user = {
      id: userId,
      tenantId,
      email,
      role,
    };

    next();
  };
}
