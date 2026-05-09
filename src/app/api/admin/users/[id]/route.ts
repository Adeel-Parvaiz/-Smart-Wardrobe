import { NextResponse, NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import { UserModel } from "@/models/User";
import mongoose from "mongoose";

type Context = {
  params: Promise<{ id: string }>;
};

// ── PATCH: change role or status ──────────────────────────────
export async function PATCH(request: NextRequest, context: Context) {
  const session = await getAuthSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

  const body = await request.json();
  const nextRole   = (body?.role   ?? "").toString().toUpperCase();
  const nextStatus = (body?.status ?? "").toString().toUpperCase();

  const data: Record<string, string> = {};
  if (nextRole   === "ADMIN"    || nextRole   === "USER")     data.role   = nextRole;
  if (nextStatus === "ACTIVE"   || nextStatus === "INACTIVE") data.status = nextStatus;

  if (!Object.keys(data).length)
    return NextResponse.json({ error: "No valid fields provided." }, { status: 400 });

  await dbConnect();
  const updated = await UserModel.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, projection: { name: 1, email: 1, role: 1, status: 1, createdAt: 1 } }
  );

  if (!updated)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    id:        updated._id.toString(),
    name:      updated.name,
    email:     updated.email,
    role:      updated.role,
    status:    updated.status,
    createdAt: updated.createdAt,
  });
}

// ── DELETE: remove user account ───────────────────────────────
export async function DELETE(request: NextRequest, context: Context) {
  const session = await getAuthSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id))
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });

  // Prevent admin from deleting their own account
  if (id === session.user.id)
    return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });

  await dbConnect();
  const deleted = await UserModel.findByIdAndDelete(id);

  if (!deleted)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
