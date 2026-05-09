import { NextResponse, NextRequest } from "next/server";
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

// Single type used by both handlers
type Context = { params: Promise<{ id: string }> };

// ── Helper: resolve and validate the item ID ─────────────────
async function resolveItem(id: string, userId: string) {
  if (!mongoose.isValidObjectId(id)) return null;
  await dbConnect();
  return WardrobeItemModel.findOne({
    _id:    new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(userId),
  }).lean();
}

// ── PUT: update a wardrobe item ───────────────────────────────
export async function PUT(request: NextRequest, { params }: Context) {
  const session = await getAuthSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await resolveItem(id, session.user.id);
  if (!existing)
    return NextResponse.json({ error: "Item not found." }, { status: 404 });

  const body = await request.json();

  const name     = sanitizeRequiredText(body?.name,     LIMITS.name);
  const category = sanitizeRequiredText(body?.category, LIMITS.category);
  const imageUrl = sanitizeRequiredText(body?.imageUrl, LIMITS.imageUrl);
  const color    = sanitizeOptionalText(body?.color,    LIMITS.color);
  const brand    = sanitizeOptionalText(body?.brand,    LIMITS.brand);
  const notes    = sanitizeOptionalText(body?.notes,    LIMITS.notes);

  // Server-side validation — required fields
  if (!name || !category || !imageUrl)
    return NextResponse.json(
      { error: "Name, category, and image URL are required." },
      { status: 400 }
    );

  // Server-side validation — URL format
  if (!isValidImageUrl(imageUrl))
    return NextResponse.json(
      { error: "Please provide a valid image URL (https:// or /path)." },
      { status: 400 }
    );

  const updated = await WardrobeItemModel.findOneAndUpdate(
    {
      _id:    new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user.id),
    },
    { $set: { name, category, color, brand, imageUrl, notes } },
    { new: true }
  ).lean();

  if (!updated)
    return NextResponse.json({ error: "Item not found." }, { status: 404 });

  return NextResponse.json({
    id:        updated._id.toString(),
    name:      updated.name,
    category:  updated.category,
    color:     updated.color     ?? undefined,
    brand:     updated.brand     ?? undefined,
    imageUrl:  updated.imageUrl,
    notes:     updated.notes     ?? undefined,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  });
}

// ── DELETE: remove a wardrobe item ────────────────────────────
export async function DELETE(_request: NextRequest, { params }: Context) {
  const session = await getAuthSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const existing = await resolveItem(id, session.user.id);
  if (!existing)
    return NextResponse.json({ error: "Item not found." }, { status: 404 });

  await WardrobeItemModel.deleteOne({
    _id:    new mongoose.Types.ObjectId(id),
    userId: new mongoose.Types.ObjectId(session.user.id),
  });

  return NextResponse.json({ success: true });
}
