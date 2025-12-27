import type { UserRole } from "@ahammedijas/fleet-os-shared";

export type JWTPayload = {
  sub: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  exp?: number;
};
