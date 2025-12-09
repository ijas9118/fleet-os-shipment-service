import { Schema } from "mongoose";

export const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
  },
  { _id: false },
);
