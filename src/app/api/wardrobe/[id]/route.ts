import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isValidImageUrl,
  LIMITS,
  sanitizeOptionalText,
  sanitizeRequiredText,
} from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.wardrobeItem.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
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

  const item = await prisma.wardrobeItem.update({
    where: { id },
    data: { name, category, color, brand, imageUrl, notes },
  });

  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.wardrobeItem.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  await prisma.wardrobeItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
