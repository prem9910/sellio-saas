export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const automation = await prisma.automation.findFirst({
    where: { id: params.id, userId },
    include: {
      store: true,
      logs: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!automation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(automation);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const automation = await prisma.automation.updateMany({
    where: { id: params.id, userId },
    data: body,
  });

  return NextResponse.json(automation);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  await prisma.automation.deleteMany({ where: { id: params.id, userId } });

  return NextResponse.json({ success: true });
}
