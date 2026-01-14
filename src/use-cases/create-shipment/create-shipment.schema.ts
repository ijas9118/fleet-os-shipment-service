import { z } from "zod";

// Address schema
const AddressSchema = z.object({
  line1: z.string().min(1, "Address line1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  coordinates: z.object({
    lat: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    lng: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  }).optional(),
});

// Customer schema
const CustomerDetailsSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
});

// Shipment item schema
const ShipmentItemSchema = z.object({
  inventoryItemId: z.string().min(1, "Inventory item ID is required"),
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
});

// Main create shipment schema
export const CreateShipmentDTOSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  items: z.array(ShipmentItemSchema).min(1, "At least one item is required"),
  destinationAddress: AddressSchema,
  customer: CustomerDetailsSchema,
  notes: z.string().optional(),
  estimatedDeliveryDate: z.string().datetime().optional(),
});

export type CreateShipmentSchemaType = z.infer<typeof CreateShipmentDTOSchema>;
