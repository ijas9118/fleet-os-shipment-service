import type { GetShipmentDTO } from "@/use-cases/get-shipment/get-shipment.dto";

import { Shipment as ShipmentEntity } from "@/domain/entities/shipment";
import { ShipmentNotFoundError } from "@/domain/errors";
import { GetShipmentUseCase } from "@/use-cases/get-shipment/get-shipment.usecase";

import {
  mockCacheRepository,
  mockShipment,
  mockShipmentRepository,
} from "../mocks/shipment.mock";

describe("getShipmentUseCase", () => {
  let useCase: GetShipmentUseCase;
  let shipmentRepo: typeof mockShipmentRepository;
  let cacheRepo: typeof mockCacheRepository;

  const dto: GetShipmentDTO = {
    id: "shipment-123",
    tenantId: "tenant-456",
  };

  const key = `shipment:${dto.tenantId}:${dto.id}`;
  const TTL_SECONDS = 60;

  beforeEach(() => {
    shipmentRepo = { ...mockShipmentRepository };
    cacheRepo = { ...mockCacheRepository };
    useCase = new GetShipmentUseCase(shipmentRepo, cacheRepo);
    jest.clearAllMocks();
  });

  it("should return shipment from cache when available", async () => {
    cacheRepo.get.mockResolvedValue(mockShipment.propsSnapshot);

    const result = await useCase.execute(dto);

    expect(cacheRepo.get).toHaveBeenCalledWith(key);
    expect(shipmentRepo.findById).not.toHaveBeenCalled();

    // Should wrap cached JSON in ShipmentEntity
    expect(result).toBeInstanceOf(ShipmentEntity);
    expect(result!.propsSnapshot).toEqual(mockShipment.propsSnapshot);
  });

  it("should fetch from repository when not in cache", async () => {
    cacheRepo.get.mockResolvedValue(null);
    shipmentRepo.findById.mockResolvedValue(mockShipment);

    const result = await useCase.execute(dto);

    expect(cacheRepo.get).toHaveBeenCalledWith(key);
    expect(shipmentRepo.findById).toHaveBeenCalledWith(dto.id, dto.tenantId);
    expect(cacheRepo.set).toHaveBeenCalledWith(
      key,
      mockShipment.propsSnapshot,
      TTL_SECONDS,
    );
    expect(result).toEqual(mockShipment);
  });

  it("should throw ShipmentNotFoundError when shipment not found", async () => {
    cacheRepo.get.mockResolvedValue(null);
    shipmentRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(ShipmentNotFoundError);

    expect(cacheRepo.get).toHaveBeenCalledWith(key);
    expect(shipmentRepo.findById).toHaveBeenCalledWith(dto.id, dto.tenantId);

    // Should NOT write to cache
    expect(cacheRepo.set).not.toHaveBeenCalled();
  });

  it("should skip cache when cache repository is not provided", async () => {
    const useCaseWithoutCache = new GetShipmentUseCase(shipmentRepo);

    shipmentRepo.findById.mockResolvedValue(mockShipment);

    const result = await useCaseWithoutCache.execute(dto);

    expect(shipmentRepo.findById).toHaveBeenCalledWith(dto.id, dto.tenantId);
    expect(result).toEqual(mockShipment);
  });

  it("should set shipment in cache after fetching from repository", async () => {
    cacheRepo.get.mockResolvedValue(null);
    shipmentRepo.findById.mockResolvedValue(mockShipment);

    await useCase.execute(dto);

    expect(cacheRepo.set).toHaveBeenCalledWith(
      key,
      mockShipment.propsSnapshot,
      TTL_SECONDS,
    );
  });
});
