import type { CreateShipmentInput } from "@/use-cases/create-shipment";

import { ShipmentStatus } from "@/domain/entities/shipment";
import { CreateShipmentUseCase } from "@/use-cases/create-shipment";

describe("createShipmentUseCase", () => {
  let useCase: CreateShipmentUseCase;
  let mockRepo: jest.Mocked<any>;
  let mockIdGenerator: jest.Mocked<any>;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
    };
    mockIdGenerator = {
      generate: jest.fn(() => "12345678-1234-1234-1234-123456789012"),
    };

    useCase = new CreateShipmentUseCase(mockRepo, mockIdGenerator);
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
    const result = useCase.execute({} as CreateShipmentInput);
    expect(result).toBeInstanceOf(Promise);
  });

  it("should generate tracking number using id generator", async () => {
    mockRepo.create.mockResolvedValue({});

    const input: CreateShipmentInput = {
      clientId: "client-123",
      pickupAddress: "123 Main St",
      deliveryAddress: "456 Oak St",
      items: [],
    };

    await useCase.execute(input);

    expect(mockIdGenerator.generate).toHaveBeenCalled();
    const createdData = mockRepo.create.mock.calls[0][0];
    expect(createdData.trackingNumber).toBe("SHIP-12345678");
  });

  it("should create a shipment and return a Shipment entity", async () => {
    const mockShipment = {};
    mockRepo.create.mockResolvedValue(mockShipment);

    const items = [
      { name: "Box", quantity: 1, weight: 10 },
      { name: "Envelope", quantity: 2, weight: 0.5 },
    ];

    const input: CreateShipmentInput = {
      clientId: "client-123",
      pickupAddress: "123 Main St",
      deliveryAddress: "456 Oak Ave",
      items,
    };

    await useCase.execute(input);

    const createdData = mockRepo.create.mock.calls[0][0];
    expect(createdData.clientId).toBe("client-123");
    expect(createdData.pickupAddress).toBe("123 Main St");
    expect(createdData.deliveryAddress).toBe("456 Oak Ave");
    expect(createdData.status).toBe(ShipmentStatus.PENDING);
    expect(createdData.items).toEqual(items);
    expect(createdData.isActive).toBe(true);
  });
});
