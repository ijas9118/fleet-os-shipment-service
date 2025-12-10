import { ShipmentStatus } from "@ahammedijas/fleet-os-shared";

import type { ShipmentItem } from "@/domain/entities/shipment";
import type { CreateShipmentDTO } from "@/use-cases/create-shipment";

import { Shipment } from "@/domain/entities/shipment";
import { CreateShipmentUseCase } from "@/use-cases/create-shipment";

describe("createShipmentUseCase", () => {
  let useCase: CreateShipmentUseCase;
  let mockRepo: jest.Mocked<any>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
    };

    useCase = new CreateShipmentUseCase(mockRepo);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should have an execute method", () => {
    expect(useCase.execute).toBeDefined();
    expect(typeof useCase.execute).toBe("function");
  });

  it("execute method should return a promise", () => {
    mockRepo.create.mockResolvedValue({});
    const result = useCase.execute({} as CreateShipmentDTO);
    expect(result).toBeInstanceOf(Promise);
  });

  it("should create a shipment and return a Shipment entity", async () => {
    const input: CreateShipmentDTO = {
      tenantId: "tenant_001",
      customer: {
        name: "John Doe",
        email: "john@example.com",
      },
      originWarehouseId: "wh_001",
      destinationAddress: {
        line1: "742 Evergreen Terrace",
        line2: "",
        city: "Springfield",
        country: "USA",
      },
      items: [
        { inventoryItemId: "inv_001", quantity: 3, uom: "PCS" } as ShipmentItem,
      ],
    };

    // Create a fake Shipment entity to be returned by the repo
    const fakeCreatedShipment = new Shipment({
      ...input,
      id: "shp_001",
      status: ShipmentStatus.PENDING_STOCK,
      priority: "NORMAL",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockRepo.create.mockResolvedValue(fakeCreatedShipment);

    const result = await useCase.execute(input);

    // Assert repo.create was called correctly
    expect(mockRepo.create).toHaveBeenCalledWith({
      ...input,
      status: ShipmentStatus.PENDING_STOCK,
      priority: "NORMAL",
    });

    expect(result).toBeInstanceOf(Shipment);
  });
});
