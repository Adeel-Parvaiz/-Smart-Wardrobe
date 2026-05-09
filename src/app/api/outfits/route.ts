import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { OutfitModel } from "@/models/Outfit";
import { OutfitItemModel } from "@/models/OutfitItem";
import { WardrobeItemModel } from "@/models/WardrobeItem";
import {
  LIMITS,
  sanitizeOptionalText,
  sanitizeRequiredText,
  toCleanString,
} from "@/lib/validation";
import mongoose from "mongoose";

type LeanOutfit = {
  _id: mongoose.Types.ObjectId;
  name: string;
  occasion?: string;
  createdAt: Date;
  updatedAt: Date;
};

type LeanOutfitItem = {
  _id: mongoose.Types.ObjectId;
  outfitId: mongoose.Types.ObjectId;
  wardrobeItemId: mongoose.Types.ObjectId;
};

type LeanWardrobeItem = {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  color?: string;
  brand?: string;
  imageUrl?: string;
};

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(session.user.id);

  const outfits = await OutfitModel.find({ userId: userObjectId })
    .sort({ createdAt: -1 })
    .lean<LeanOutfit[]>();

  const outfitIds = outfits.map((o) => o._id);

  const outfitItems = await OutfitItemModel.find({ outfitId: { $in: outfitIds } })
    .lean<LeanOutfitItem[]>();

  const wardrobeItemIds = outfitItems.map((oi) => oi.wardrobeItemId);

  const wardrobeItems = await WardrobeItemModel.find({ _id: { $in: wardrobeItemIds } })
    .lean<LeanWardrobeItem[]>();

  const wardrobeItemMap = new Map(wardrobeItems.map((wi) => [wi._id.toString(), wi]));

  return NextResponse.json(
    outfits.map((o) => {
      const currentOutfitItems = outfitItems.filter(
        (oi) => oi.outfitId.toString() === o._id.toString()
      );
      const linkedWardrobeItems = currentOutfitItems
        .map((oi) => {
          const wi = wardrobeItemMap.get(oi.wardrobeItemId.toString());
          return wi
            ? {
                id: wi._id.toString(),
                name: wi.name,
                category: wi.category,
                color: wi.color ?? undefined,
                brand: wi.brand ?? undefined,
              }
            : null;
        })
        .filter(Boolean);

      return {
        id: o._id.toString(),
        name: o.name,
        occasion: o.occasion ?? undefined,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        wardrobeItems: linkedWardrobeItems,
      };
    })
  );
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

  // ✅ typed as string[] explicitly to avoid unknown[]
  const itemIds: string[] = [
    ...new Set(itemIdsRaw.map((id: unknown) => toCleanString(id)).filter(Boolean)),
  ].slice(0, LIMITS.outfitItems) as string[];

  if (!name) {
    return NextResponse.json({ error: "Outfit name is required." }, { status: 400 });
  }
  if (itemIds.length === 0) {
    return NextResponse.json({ error: "Select at least one wardrobe item." }, { status: 400 });
  }

  await dbConnect();

  const userObjectId = new mongoose.Types.ObjectId(session.user.id);

  const ownedItems = await WardrobeItemModel.find({
    _id: { $in: itemIds.map((id) => new mongoose.Types.ObjectId(id)) }, // ✅ now string, no cast needed
    userId: userObjectId,
  }).lean<LeanWardrobeItem[]>();

  if (ownedItems.length !== itemIds.length) {
    return NextResponse.json({ error: "Some selected items are invalid." }, { status: 400 });
  }

  const outfit = await OutfitModel.create({ userId: userObjectId, name, occasion });

  await OutfitItemModel.insertMany(
    itemIds.map((wardrobeItemId) => ({
      outfitId: outfit._id,
      wardrobeItemId: new mongoose.Types.ObjectId(wardrobeItemId),
    }))
  );

  return NextResponse.json(
    {
      id: outfit._id.toString(),
      name: outfit.name,
      occasion: outfit.occasion ?? undefined,
      createdAt: outfit.createdAt,
      updatedAt: outfit.updatedAt,
      wardrobeItems: ownedItems.map((wi) => ({
        id: wi._id.toString(),
        name: wi.name,
        category: wi.category,
        color: wi.color ?? undefined,
        brand: wi.brand ?? undefined,
      })),
    },
    { status: 201 }
  );
}
