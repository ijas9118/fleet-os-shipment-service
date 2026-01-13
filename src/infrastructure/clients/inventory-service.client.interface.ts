export interface ReserveStockRequest {
  tenantId: string;
  warehouseId: string;
  items: Array<{
    inventoryItemId: string;
    sku: string;
    quantity: number;
  }>;
  shipmentId?: string;
  expiryHours?: number; // Optional: defaults to 24 hours
}

export interface ReserveStockResponse {
  reservationId: string;
  success: boolean;
  expiresAt: Date;
}

export interface ReleaseReservationRequest {
  reservationId: string;
  tenantId: string;
}

/**
 * Interface for communicating with the Inventory Service
 * This will be implemented to make HTTP calls to the inventory service API
 */
export interface IInventoryServiceClient {
  /**
   * Reserve stock for a shipment
   * @throws InsufficientInventoryError if stock is not available
   */
  reserveStock: (request: ReserveStockRequest) => Promise<ReserveStockResponse>;

  /**
   * Release a previously created reservation
   */
  releaseReservation: (request: ReleaseReservationRequest) => Promise<void>;
}
