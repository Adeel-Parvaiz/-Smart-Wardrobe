import mongoose, { Schema, model, models } from "mongoose";

const WardrobeItemSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    color: { type: String },
    brand: { type: String },
    imageUrl: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const WardrobeItemModel = models.WardrobeItem || model("WardrobeItem", WardrobeItemSchema);
