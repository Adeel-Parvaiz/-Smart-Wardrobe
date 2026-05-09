import mongoose, { Schema, model, models } from "mongoose";

const OutfitSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    occasion: { type: String },
  },
  { timestamps: true }
);

export const OutfitModel = models.Outfit || model("Outfit", OutfitSchema);
