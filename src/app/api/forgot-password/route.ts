import { randomBytes, createHash } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: true, message: genericMessage });
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
        OR: [{ usedAt: null }, { expiresAt: { lt: new Date() } }],
      },
    });

    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
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