import { ShipmentCacheRedis } from "@/infrastructure/repositories/shipment.cache.repository";
import { ShipmentRepositoryMongo } from "@/infrastructure/repositories/shipment.repository";
import { ShipmentController } from "@/presentation/controllers/shipment.controller";
import { CreateShipmentUseCase } from "@/use-cases/create-shipment";
import { GetShipmentUseCase } from "@/use-cases/get-shipment/get-shipment.usecase";
import { ListShipmentsUseCase } from "@/use-cases/list-shipments/list-shipment.usecase";
import { UpdateShipmentStatusUseCase } from "@/use-cases/update-shipment-status";

export function buildContainer() {
  // --- Repositories ---
  const shipmentRepo = new ShipmentRepositoryMongo();
  const cacheRepo = new ShipmentCacheRedis();

  // --- Use Cases ---
  const createShipmentUC = new CreateShipmentUseCase(shipmentRepo);
  const listShipmentsUC = new ListShipmentsUseCase(shipmentRepo);
  const updateStatusUC = new UpdateShipmentStatusUseCase(shipmentRepo);
  const getShipmentUC = new GetShipmentUseCase(shipmentRepo, cacheRepo);

  // --- Controllers ---
  const shipmentController = new ShipmentController(
    createShipmentUC,
    getShipmentUC,
    listShipmentsUC,
    updateStatusUC,
  );

  return {
    shipmentController,
  };
}
