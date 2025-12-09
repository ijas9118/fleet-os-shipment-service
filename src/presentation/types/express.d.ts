// src/types/express.d.ts (create this file)
import type { UserRole } from "../domain/entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        tenantId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}
