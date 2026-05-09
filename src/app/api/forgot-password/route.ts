import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { PasswordResetTokenModel } from "@/models/PasswordResetToken";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

const RESET_TOKEN_TTL_MINUTES = 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  const genericMessage =
    "If an account with that email exists, a password reset link has been generated.";

  try {
    const body = await request.json();
    const email = (body?.email ?? "").toString().trim().toLowerCase();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ success: true, message: genericMessage });
    }

    await dbConnect();
    const user = await UserModel.findOne({ email }).select({ _id: 1 }).lean();
    if (!user) {
      return NextResponse.json({ success: true, message: genericMessage });
    }

    await PasswordResetTokenModel.deleteMany({
      userId: new mongoose.Types.ObjectId((user as any)._id),
      $or: [{ usedAt: null }, { expiresAt: { $lt: new Date() } }],
    });

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await PasswordResetTokenModel.create({
      userId:new mongoose.Types.ObjectId((user as any)._id),
      tokenHash,
      expiresAt,
      usedAt: null,
    });

    const resetPath = `/reset-password?token=${encodeURIComponent(token)}`;

    if (process.env.NODE_ENV !== "production") {
      console.info(`Password reset URL for ${email}: ${resetPath}`);
      return NextResponse.json({
        success: true,
        message: genericMessage,
        resetPath,
      });
    }

    return NextResponse.json({ success: true, message: genericMessage });
  } catch {
    return NextResponse.json({ success: true, message: genericMessage });
  }
}
