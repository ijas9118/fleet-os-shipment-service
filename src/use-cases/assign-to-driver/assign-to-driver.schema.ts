import { z } from "zod";

export const AssignToDriverDTOSchema = z.object({
  driverId: z.string().min(1, "Driver ID is required"),
  driverName: z.string().min(1, "Driver name is required"),
});

export type AssignToDriverSchemaType = z.infer<typeof AssignToDriverDTOSchema>;
