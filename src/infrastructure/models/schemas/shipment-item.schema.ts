import { Schema } from "mongoose";

export const ShipmentItemSchema = new Schema({
  inventoryItemId: { type: Schema.Types.ObjectId, required: true },
  quantity: { type: Number, required: true, min: 0 },
  uom: { type: String, required: true },
});
