import { NextResponse, NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { OutfitModel } from "@/models/Outfit";
import { OutfitItemModel } from "@/models/OutfitItem";
import { WardrobeItemModel } from "@/models/WardrobeItem";
import mongoose from "mongoose";

type Context = {
  params: Promise<{ id: string }>;  // ✅ fixed generic syntax
};
export async function GET(
  _request: NextRequest,
  { params }: Context
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Outfit not found." }, { status: 404 });
  }

  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(session.user.id);
  const outfitObjectId = new mongoose.Types.ObjectId(id);

  const outfit = await OutfitModel.findOne({
    _id: outfitObjectId,
    userId: userObjectId,
  }).lean<{                         // ✅ explicit generic on lean()
    _id: mongoose.Types.ObjectId;
    name: string;
    occasion?: string;
    createdAt: Date;
    updatedAt: Date;
  }>();

  if (!outfit) {
    return NextResponse.json({ error: "Outfit not found." }, { status: 404 });
  }

  const outfitItems = await OutfitItemModel.find({ outfitId: outfitObjectId }).lean();
  const wardrobeItemIds = outfitItems.map((oi) => (oi as any).wardrobeItemId);
  const wardrobeItems = await WardrobeItemModel.find({
    _id: { $in: wardrobeItemIds },
  }).lean<{                         // ✅ explicit generic on lean()
    _id: mongoose.Types.ObjectId;
    name: string;
    category: string;
    color?: string;
    brand?: string;
    imageUrl: string;
  }[]>();

  return NextResponse.json({
    id: outfit._id.toString(),      // ✅ no more `as any` needed
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
