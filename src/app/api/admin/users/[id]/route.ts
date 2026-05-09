import { AccountStatus, Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const body = await request.json();
  const nextRole = (body?.role ?? "").toString().toUpperCase();
  const nextStatus = (body?.status ?? "").toString().toUpperCase();

  const data: { role?: Role; status?: AccountStatus } = {};
  if (nextRole === "ADMIN" || nextRole === "USER") {
    data.role = nextRole;
  }
  if (nextStatus === "ACTIVE" || nextStatus === "INACTIVE") {
    data.status = nextStatus;
  }

  if (!data.role && !data.status) {
    return NextResponse.json({ error: "No valid update fields provided." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}
