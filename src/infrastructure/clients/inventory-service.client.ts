import type { AxiosInstance } from "axios";

import axios from "axios";

import logger from "@/config/logger";
import { InsufficientInventoryError } from "@/domain/errors";

import type {
  IInventoryServiceClient,
  ReleaseReservationRequest,
  ReserveStockRequest,
  ReserveStockResponse,
} from "./inventory-service.client.interface";

export class InventoryServiceHttpClient implements IInventoryServiceClient {
  private client: AxiosInstance;

  constructor(baseUrl: string, apiKey: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "x-internal-api-key": apiKey,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
  }

  async reserveStock(request: ReserveStockRequest): Promise<ReserveStockResponse> {
    try {
      const response = await this.client.post<{ data: ReserveStockResponse }>(
        "/api/v1/reservations/reserve",
        request,
      );

      logger.info("Successfully reserved stock in inventory service", {
        reservationId: response.data.data.reservationId,
      });

      return response.data.data;
    }
    catch (error: any) {
      // Handle axios errors
      if (error.response) {
        const errorData = error.response.data?.error || error.response.data;

        logger.error("Failed to reserve stock in inventory service", {
          status: error.response.status,
          errorData,
        });

        // Handle insufficient stock error
        if (error.response.status === 400 && errorData.code === "INSUFFICIENT_STOCK") {
          throw new InsufficientInventoryError(
            errorData.sku || "unknown",
            errorData.requested || 0,
            errorData.available || 0,
          );
        }

        // Rethrow with meaningful message
        throw new Error(errorData.message || "Failed to reserve stock in inventory service");
      }

      // Network or other errors
      logger.error("Network error while reserving stock", {
        error: error.message,
      });

      throw new Error(`Failed to reserve stock: ${error.message || "Unknown error"}`);
    }
  }

  async releaseReservation(request: ReleaseReservationRequest): Promise<void> {
    try {
      await this.client.post("/api/v1/reservations/release", request);

      logger.info("Successfully released reservation in inventory service", {
        reservationId: request.reservationId,
      });
    }
    catch (error: any) {
      logger.error("Failed to release reservation in inventory service", {
        error: error.message,
        response: error.response?.data,
        reservationId: request.reservationId,
      });

      throw new Error(
        `Failed to release reservation: ${error.response?.data?.message || error.message || "Unknown error"}`,
      );
    }
  }
}
