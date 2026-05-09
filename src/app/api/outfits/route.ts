import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  LIMITS,
  sanitizeOptionalText,
  sanitizeRequiredText,
  toCleanString,
} from "@/lib/validation";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const outfits = await prisma.outfit.findMany({
    where: { userId: session.user.id },
    include: {
      outfitItems: {
        include: {
          wardrobeItem: {
            select: {
              id: true,
              name: true,
              category: true,
              color: true,
              brand: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(outfits);
}

export async function POST(request: Request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = sanitizeRequiredText(body?.name, LIMITS.name);
  const occasion = sanitizeOptionalText(body?.occasion, LIMITS.occasion);
  const itemIdsRaw = Array.isArray(body?.itemIds) ? body.itemIds : [];
  const itemIds = [
    ...new Set(itemIdsRaw.map((id: unknown) => toCleanString(id)).filter(Boolean)),
  ].slice(0, LIMITS.outfitItems);

  if (!name) {
    return NextResponse.json({ error: "Outfit name is required." }, { status: 400 });
  }

  if (itemIds.length === 0) {
    return NextResponse.json({ error: "Select at least one wardrobe item." }, { status: 400 });
  }

  const ownedItems = await prisma.wardrobeItem.findMany({
    where: {
      id: { in: itemIds },
      userId: session.user.id,
    },
    select: { id: true },
  });

  if (ownedItems.length !== itemIds.length) {
    return NextResponse.json({ error: "Some selected items are invalid." }, { status: 400 });
  }

  const outfit = await prisma.outfit.create({
    data: {
      userId: session.user.id,
      name,
      occasion,
      outfitItems: {
        createMany: {
          data: itemIds.map((wardrobeItemId: string) => ({ wardrobeItemId })),
        },
      },
    },
    include: {
      outfitItems: {
        include: {
          wardrobeItem: {
            select: {
              id: true,
              name: true,
              category: true,
              color: true,
              brand: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(outfit, { status: 201 });
}
