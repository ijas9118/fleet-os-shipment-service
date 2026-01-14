import { z } from "zod";

// Address schema (optional for update)
const AddressSchema = z.object({
  line1: z.string().min(1, "Address line1 is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }).optional(),
}).optional();

// Customer schema (optional for update)
const CustomerDetailsSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
}).optional();

export const UpdateShipmentDTOSchema = z.object({
  destinationAddress: AddressSchema,
  customer: CustomerDetailsSchema,
  notes: z.string().optional(),
  estimatedDeliveryDate: z.string().datetime().optional(),
});

export type UpdateShipmentSchemaType = z.infer<typeof UpdateShipmentDTOSchema>;
