import { InsufficientInventoryError } from "@/domain/errors";

import type {
  IInventoryServiceClient,
  ReleaseReservationRequest,
  ReserveStockRequest,
  ReserveStockResponse,
} from "./inventory-service.client.interface";

export class InventoryServiceHttpClient implements IInventoryServiceClient {
  private readonly _baseUrl: string;
  private readonly _timeout: number = 5000;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  async reserveStock(request: ReserveStockRequest): Promise<ReserveStockResponse> {
    try {
      const response = await fetch(`${this._baseUrl}/api/reservations/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this._timeout),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle insufficient stock error
        if (response.status === 400 && errorData.code === "INSUFFICIENT_STOCK") {
          throw new InsufficientInventoryError(
            errorData.sku || "unknown",
            errorData.required || 0,
            errorData.available || 0,
          );
        }

        throw new Error(`Inventory service error: ${response.status} - ${errorData.message || "Unknown error"}`);
      }

      const data = await response.json();

      return {
        reservationId: data.reservationId,
        success: data.success,
        expiresAt: new Date(data.expiresAt),
      };
    }
    catch (error) {
      if (error instanceof InsufficientInventoryError) {
        throw error;
      }

      // Handle timeout
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new Error("Inventory service request timeout");
      }

      // Handle network errors
      throw new Error(`Failed to reserve stock: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async releaseReservation(request: ReleaseReservationRequest): Promise<void> {
    try {
      const response = await fetch(`${this._baseUrl}/api/reservations/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this._timeout),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to release reservation: ${response.status} - ${errorData.message || "Unknown error"}`);
      }
    }
    catch (error) {
      // Handle timeout
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new Error("Inventory service request timeout");
      }

      // Handle network errors
      throw new Error(`Failed to release reservation: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
