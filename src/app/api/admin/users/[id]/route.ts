import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  const body = await request.json();
  const nextRole = (body?.role ?? "").toString().toUpperCase();
  const nextStatus = (body?.status ?? "").toString().toUpperCase();

  const data: { role?: "ADMIN" | "USER"; status?: "ACTIVE" | "INACTIVE" } = {};
  if (nextRole === "ADMIN" || nextRole === "USER") {
    data.role = nextRole;
  }
  if (nextStatus === "ACTIVE" || nextStatus === "INACTIVE") {
    data.status = nextStatus;
  }

  if (!data.role && !data.status) {
    return NextResponse.json({ error: "No valid update fields provided." }, { status: 400 });
  }

  await dbConnect();
  const updated = await UserModel.findByIdAndUpdate(
    new mongoose.Types.ObjectId(id),
    { $set: data },
    { new: true, projection: { name: 1, email: 1, role: 1, status: 1, createdAt: 1 } },
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: updated._id.toString(),
    name: updated.name,
    email: updated.email,
    role: updated.role,
    status: updated.status,
    createdAt: updated.createdAt,
  });
}
