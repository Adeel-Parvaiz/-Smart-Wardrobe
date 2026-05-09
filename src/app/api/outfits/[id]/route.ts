import { NextResponse, NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { OutfitModel } from "@/models/Outfit";
import { OutfitItemModel } from "@/models/OutfitItem";
import { WardrobeItemModel } from "@/models/WardrobeItem";
import mongoose from "mongoose";

type Context = {
  params: Promise<{ id: string }>;
};

// ── GET: fetch single outfit with its wardrobe items ──────────
export async function GET(
  _request: NextRequest,
  { params }: Context
) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Outfit not found." },
      { status: 404 }
    );
  }

  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(session.user.id);
  const outfitObjectId = new mongoose.Types.ObjectId(id);

  const outfit = await OutfitModel.findOne({
    _id: outfitObjectId,
    userId: userObjectId,
  }).lean();

  if (!outfit) {
    return NextResponse.json(
      { error: "Outfit not found." },
      { status: 404 }
    );
  }

  const outfitItems = await OutfitItemModel.find({
    outfitId: outfitObjectId,
  }).lean();

  const wardrobeItemIds = outfitItems.map(
    (oi) => oi.wardrobeItemId
  );

  const wardrobeItems = await WardrobeItemModel.find({
    _id: { $in: wardrobeItemIds },
  }).lean();

  return NextResponse.json({
    id: (outfit as any)._id.toString(),
    name: outfit.name,
    occasion: outfit.occasion ?? undefined,
    createdAt: outfit.createdAt,
    updatedAt: outfit.updatedAt,
    wardrobeItems: wardrobeItems.map((wi) => ({
      id: wi._id.toString(),
      name: wi.name,
      category: wi.category,
      color: wi.color ?? undefined,
      brand: wi.brand ?? undefined,
      imageUrl: wi.imageUrl,
    })),
  });
}

// ── DELETE: remove outfit and its items ───────────────────────
export async function DELETE(
  _request: NextRequest,
  { params }: Context
) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { error: "Outfit not found." },
      { status: 404 }
    );
  }

  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(session.user.id);
  const outfitObjectId = new mongoose.Types.ObjectId(id);

  const existing = await OutfitModel.findOne({
    _id: outfitObjectId,
    userId: userObjectId,
  }).lean();

  if (!existing) {
    return NextResponse.json(
      { error: "Outfit not found." },
      { status: 404 }
    );
  }

  await OutfitModel.deleteOne({
    _id: outfitObjectId,
    userId: userObjectId,
  });

  await OutfitItemModel.deleteMany({
    outfitId: outfitObjectId,
  });

  return NextResponse.json({ success: true });
}
