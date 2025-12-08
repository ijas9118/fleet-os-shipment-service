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
    const mockShipment = {};
    mockRepo.create.mockResolvedValue(mockShipment);

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

    const result = await useCase.execute(input);

    // Assert repo.create was called with enriched shipment data
    expect(mockRepo.create).toHaveBeenCalledWith({
      ...input,
      status: ShipmentStatus.CREATED,
      priority: "NORMAL",
    });

    // Assert returned instance is Shipment entity
    expect(result).toBeInstanceOf(Shipment);

    // Assert mapped fields
    // expect(result.id).toBe("shp_001");
    // expect(result.status).toBe(ShipmentStatus.CREATED);
    // expect(result.priority).toBe("NORMAL");
    // expect(result.customer.name).toBe("John Doe");
    // expect(result.items[0]).toEqual({
    //   inventoryItemId: "inv_001",
    //   quantity: 3,
    //   uom: "PCS",
    // });
  });
});
