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

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  await dbConnect();
  const userObjectId = new mongoose.Types.ObjectId(session.user.id);
  const itemObjectId = new mongoose.Types.ObjectId(id);
  
  const existing = await WardrobeItemModel.findOne({ _id: itemObjectId, userId: userObjectId }).lean();

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

  const item = await WardrobeItemModel.findOneAndUpdate(
    { _id: itemObjectId, userId: userObjectId },
    { $set: { name, category, color, brand, imageUrl, notes } },
    { new: true }
  ).lean();

  if (!item) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: item._id.toString(),
    name: item.name,
    category: item.category,
    color: item.color ?? undefined,
    brand: item.brand ?? undefined,
    imageUrl: item.imageUrl,
    notes: item.notes ?? undefined,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  await dbConnect();
  const userObjectId = new mongoose.Types.ObjectId(session.user.id);
  const itemObjectId = new mongoose.Types.ObjectId(id);

  const existing = await WardrobeItemModel.findOne({ _id: itemObjectId, userId: userObjectId }).lean();

  if (!existing) {
    return NextResponse.json({ error: "Item not found." }, { status: 404 });
  }

  await WardrobeItemModel.deleteOne({ _id: itemObjectId, userId: userObjectId });
  return NextResponse.json({ success: true });
}


