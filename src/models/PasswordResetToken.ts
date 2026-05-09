import mongoose, { Schema, model, models } from "mongoose";

const PasswordResetTokenSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export const PasswordResetTokenModel = models.PasswordResetToken || model("PasswordResetToken", PasswordResetTokenSchema);
