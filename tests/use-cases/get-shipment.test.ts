import type { GetShipmentDTO } from "@/use-cases/get-shipment/get-shipment.dto";

import { ShipmentNotFoundError } from "@/domain/errors";
import { GetShipmentUseCase } from "@/use-cases/get-shipment/get-shipment.usecase";

import { mockCacheRepository, mockShipment, mockShipmentRepository } from "../mocks/shipment.mock";

describe("getShipmentUseCase", () => {
  let useCase: GetShipmentUseCase;
  let shipmentRepo: typeof mockShipmentRepository;
  let cacheRepo: typeof mockCacheRepository;

  beforeEach(() => {
    shipmentRepo = { ...mockShipmentRepository };
    cacheRepo = { ...mockCacheRepository };
    useCase = new GetShipmentUseCase(shipmentRepo, cacheRepo);
    jest.clearAllMocks();
  });

  const dto: GetShipmentDTO = {
    id: "shipment-123",
    tenantId: "tenant-456",
  };

  it("should return shipment from cache when available", async () => {
    cacheRepo.getById.mockResolvedValue(mockShipment);

    const result = await useCase.execute(dto);

    expect(cacheRepo.getById).toHaveBeenCalledWith(dto.id, dto.tenantId);
    expect(shipmentRepo.findById).not.toHaveBeenCalled();
    expect(result).toEqual(mockShipment);
  });

  it("should fetch from repository when not in cache", async () => {
    cacheRepo.getById.mockResolvedValue(null);
    shipmentRepo.findById.mockResolvedValue(mockShipment);

    const result = await useCase.execute(dto);

    expect(cacheRepo.getById).toHaveBeenCalledWith(dto.id, dto.tenantId);
    expect(shipmentRepo.findById).toHaveBeenCalledWith(dto.id, dto.tenantId);
    expect(cacheRepo.set).toHaveBeenCalledWith(mockShipment);
    expect(result).toEqual(mockShipment);
  });

  it("should throw ShipmentNotFoundError when shipment not found", async () => {
    cacheRepo.getById.mockResolvedValue(null);
    shipmentRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(ShipmentNotFoundError);

    expect(cacheRepo.getById).toHaveBeenCalledWith(dto.id, dto.tenantId);
    expect(shipmentRepo.findById).toHaveBeenCalledWith(dto.id, dto.tenantId);

    // cache should NOT be written to
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
    cacheRepo.getById.mockResolvedValue(null);
    shipmentRepo.findById.mockResolvedValue(mockShipment);

    await useCase.execute(dto);

    expect(cacheRepo.set).toHaveBeenCalledWith(mockShipment);
  });
});
