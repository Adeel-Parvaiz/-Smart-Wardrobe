import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isValidImageUrl,
  LIMITS,
  sanitizeOptionalText,
  sanitizeRequiredText,
} from "@/lib/validation";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.wardrobeItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = sanitizeRequiredText(body?.name, LIMITS.name);
  const category = sanitizeRequiredText(body?.category, LIMITS.category);
  const color = sanitizeOptionalText(body?.color, LIMITS.color);
  const brand = sanitizeOptionalText(body?.brand, LIMITS.brand);
  const imageUrl = sanitizeRequiredText(body?.imageUrl, LIMITS.imageUrl);
  const notes = sanitizeOptionalText(body?.notes, LIMITS.notes);

  if (!name || !category || !imageUrl) {
    return NextResponse.json(
      { error: "Name, category, and image URL are required." },
      { status: 400 },
    );
  }

  if (!isValidImageUrl(imageUrl)) {
    return NextResponse.json(
      { error: "Please provide a valid image URL (http(s):// or /path)." },
      { status: 400 },
    );
  }

  const item = await prisma.wardrobeItem.create({
    data: {
      userId: session.user.id,
      name,
      category,
      color,
      brand,
      imageUrl,
      notes,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
