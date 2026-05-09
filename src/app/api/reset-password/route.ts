import { createHash } from "crypto";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { PasswordResetTokenModel } from "@/models/PasswordResetToken";
import { UserModel } from "@/models/User";
import { LIMITS, sanitizePassword, toCleanString } from "@/lib/validation";
import mongoose from "mongoose";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = toCleanString(body?.token);
    const password = sanitizePassword(body?.password, LIMITS.password);

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const tokenHash = hashToken(token);

    await dbConnect();
    const resetToken = await PasswordResetTokenModel.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!resetToken) {
      return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
    }

    const passwordHash = await hash(password, 12);

    const userObjectId = new mongoose.Types.ObjectId(resetToken.userId);
    const tokenObjectId = new mongoose.Types.ObjectId(resetToken._id);

    await Promise.all([
      UserModel.updateOne({ _id: userObjectId }, { $set: { passwordHash } }),
      PasswordResetTokenModel.updateOne({ _id: tokenObjectId }, { $set: { usedAt: new Date() } }),
      PasswordResetTokenModel.deleteMany({
        userId: userObjectId,
        usedAt: null,
        _id: { $ne: tokenObjectId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}