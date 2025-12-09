import { ListShipmentsUseCase } from "@/use-cases/list-shipments/list-shipment.usecase";

import { mockListShipmentsResult, mockShipmentRepository } from "../mocks/shipment.mock";

describe("listShipmentsUseCase", () => {
  let useCase: ListShipmentsUseCase;
  let shipmentRepo: typeof mockShipmentRepository;

  beforeEach(() => {
    shipmentRepo = { ...mockShipmentRepository };
    useCase = new ListShipmentsUseCase(shipmentRepo);
    jest.clearAllMocks();
  });

  it("should call repository with correct parameters", async () => {
    shipmentRepo.list.mockResolvedValue(mockListShipmentsResult);
    const dto = {
      tenantId: "tenant-456",
      page: 2,
      limit: 20,
    };

    await useCase.execute(dto);

    expect(shipmentRepo.list).toHaveBeenCalledWith({
      tenantId: "tenant-456",
      page: 2,
      limit: 20,
      search: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      includeCancelled: false,
    });
  });

  it("should handle undefined page and limit", async () => {
    shipmentRepo.list.mockResolvedValue(mockListShipmentsResult);
    const dto = {
      tenantId: "tenant-456",
    };

    await useCase.execute(dto);

    expect(shipmentRepo.list).toHaveBeenCalledWith({
      tenantId: "tenant-456",
      page: 1, // Default
      limit: 10, // Default
      search: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      includeCancelled: false,
    });
  });

  it("should sanitize page and limit values", async () => {
    shipmentRepo.list.mockResolvedValue(mockListShipmentsResult);

    await useCase.execute({ tenantId: "t1", page: -5, limit: 5 });
    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 5 }),
    );

    await useCase.execute({ tenantId: "t1", page: 0, limit: 200 });
    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 100 }),
    );

    await useCase.execute({ tenantId: "t1", page: 1, limit: 1000 });
    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 100 }),
    );

    await useCase.execute({ tenantId: "t1", page: 1, limit: -10 });
    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 1 }),
    );
  });

  it("should trim search string", async () => {
    shipmentRepo.list.mockResolvedValue(mockListShipmentsResult);
    const dto = {
      tenantId: "tenant-456",
      search: "  search term  ",
    };

    await useCase.execute(dto);

    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ search: "search term" }),
    );
  });

  it("should handle includeCancelled flag", async () => {
    shipmentRepo.list.mockResolvedValue(mockListShipmentsResult);

    await useCase.execute({
      tenantId: "t1",
      includeCancelled: true,
    });
    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ includeCancelled: true }),
    );

    await useCase.execute({
      tenantId: "t1",
      includeCancelled: false,
    });
    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ includeCancelled: false }),
    );

    await useCase.execute({
      tenantId: "t1",
      includeCancelled: undefined,
    });
    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({ includeCancelled: false }),
    );
  });

  it("should return repository result", async () => {
    shipmentRepo.list.mockResolvedValue(mockListShipmentsResult);
    const dto = {
      tenantId: "tenant-456",
      page: 1,
      limit: 10,
    };

    const result = await useCase.execute(dto);

    expect(result).toEqual(mockListShipmentsResult);
  });

  it("should pass through sort parameters", async () => {
    shipmentRepo.list.mockResolvedValue(mockListShipmentsResult);
    const dto = {
      tenantId: "t1",
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    await useCase.execute(dto);

    expect(shipmentRepo.list).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    );
  });
});
