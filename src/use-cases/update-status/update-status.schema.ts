import { z } from "zod";

import { ShipmentStatus } from "@/domain/enums";

export const UpdateStatusDTOSchema = z.object({
  newStatus: z.enum(Object.values(ShipmentStatus), {
    message: "Invalid shipment status",
  }),
  notes: z.string().optional(),
});

export type UpdateStatusSchemaType = z.infer<typeof UpdateStatusDTOSchema>;
