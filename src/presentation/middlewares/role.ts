import type { UserRole } from "@ahammedijas/fleet-os-shared";
import type { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        message: "Forbidden: You do not have permission to access this resource",
      });
    }

    next();
  };
}
