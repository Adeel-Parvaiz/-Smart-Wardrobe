import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { OutfitModel } from "@/models/Outfit";
import { OutfitItemModel } from "@/models/OutfitItem";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
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

  const existing = await OutfitModel.findOne({ _id: outfitObjectId, userId: userObjectId }).lean();

  if (!existing) {
    return NextResponse.json({ error: "Outfit not found." }, { status: 404 });
  }

  await OutfitModel.deleteOne({ _id: outfitObjectId, userId: userObjectId });
  await OutfitItemModel.deleteMany({ outfitId: outfitObjectId });

  return NextResponse.json({ success: true });
}


