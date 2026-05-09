import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isValidEmail,
  LIMITS,
  sanitizePassword,
  sanitizeRequiredText,
  toCleanString,
} from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = sanitizeRequiredText(body?.name, LIMITS.name);
    const email = toCleanString(body?.email).toLowerCase();
    const password = sanitizePassword(body?.password, LIMITS.password);

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "USER",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to register user." }, { status: 500 });
  }
}
