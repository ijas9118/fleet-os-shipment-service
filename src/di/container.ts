import env from "@/config/validate-env";
import { InventoryServiceHttpClient } from "@/infrastructure/clients";
import { ShipmentRepositoryMongo } from "@/infrastructure/repositories/shipment.repository";
import { ShipmentController } from "@/presentation/controllers/shipment.controller";
import { AssignToDriverUseCase } from "@/use-cases/assign-to-driver";
import { ConfirmShipmentUseCase } from "@/use-cases/confirm-shipment";
import { CreateShipmentUseCase } from "@/use-cases/create-shipment";
import { DeleteShipmentUseCase } from "@/use-cases/delete-shipment";
import { GetShipmentUseCase } from "@/use-cases/get-shipment";
import { ListShipmentsUseCase } from "@/use-cases/list-shipments";
import { UpdateShipmentUseCase } from "@/use-cases/update-shipment";
import { UpdateStatusUseCase } from "@/use-cases/update-status";

export function buildContainer() {
  // Get configuration from environment
  const inventoryServiceUrl = env.INVENTORY_SERVICE_URL || "http://localhost:3001";
  const inventoryServiceApiKey = env.INVENTORY_SERVICE_API_KEY || "";

  // --- Infrastructure ---
  const shipmentRepo = new ShipmentRepositoryMongo();
  const inventoryClient = new InventoryServiceHttpClient(inventoryServiceUrl, inventoryServiceApiKey);

  // --- Use Cases ---
  const createShipmentUC = new CreateShipmentUseCase(shipmentRepo, inventoryClient);
  const listShipmentsUC = new ListShipmentsUseCase(shipmentRepo);
  const getShipmentUC = new GetShipmentUseCase(shipmentRepo);
  const updateShipmentUC = new UpdateShipmentUseCase(shipmentRepo);
  const confirmShipmentUC = new ConfirmShipmentUseCase(shipmentRepo);
  const deleteShipmentUC = new DeleteShipmentUseCase(shipmentRepo, inventoryClient);
  const updateStatusUC = new UpdateStatusUseCase(shipmentRepo, inventoryClient);
  const assignToDriverUC = new AssignToDriverUseCase(shipmentRepo);

  // --- Controllers ---
  const shipmentController = new ShipmentController(
    createShipmentUC,
    listShipmentsUC,
    getShipmentUC,
    updateShipmentUC,
    confirmShipmentUC,
    deleteShipmentUC,
    updateStatusUC,
    assignToDriverUC,
  );

  return {
    controllers: {
      shipmentController,
    },
  };
}
