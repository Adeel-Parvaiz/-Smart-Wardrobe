import mongoose, { Schema, model, models } from "mongoose";

const OutfitItemSchema = new Schema(
  {
    outfitId: { type: Schema.Types.ObjectId, ref: "Outfit", required: true },
    wardrobeItemId: { type: Schema.Types.ObjectId, ref: "WardrobeItem", required: true },
  },
  { timestamps: true }
);

// Ensure uniqueness of wardrobe items within an outfit
OutfitItemSchema.index({ outfitId: 1, wardrobeItemId: 1 }, { unique: true });

export const OutfitItemModel = models.OutfitItem || model("OutfitItem", OutfitItemSchema);
