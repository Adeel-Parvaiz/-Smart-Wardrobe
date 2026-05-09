import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { WardrobeItemModel } from "@/models/WardrobeItem";
import {
  isValidImageUrl,
  LIMITS,
  sanitizeOptionalText,
  sanitizeRequiredText,
} from "@/lib/validation";
import mongoose from "mongoose";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const items = await WardrobeItemModel.find({
    userId: new mongoose.Types.ObjectId(session.user.id),
  })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(
    items.map((i) => ({
      id: i._id.toString(),
      name: i.name,
      category: i.category,
      color: i.color ?? undefined,
      brand: i.brand ?? undefined,
      imageUrl: i.imageUrl,
      notes: i.notes ?? undefined,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    })),
  );
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

  await dbConnect();
  const item = await WardrobeItemModel.create({
    userId: new mongoose.Types.ObjectId(session.user.id),
    name,
    category,
    color,
    brand,
    imageUrl,
    notes,
  });

  return NextResponse.json(
    {
      id: item._id.toString(),
      name: item.name,
      category: item.category,
      color: item.color ?? undefined,
      brand: item.brand ?? undefined,
      imageUrl: item.imageUrl,
      notes: item.notes ?? undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    },
    { status: 201 },
  );
}


