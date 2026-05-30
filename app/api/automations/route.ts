export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "ABANDONED_CART",
    "LOW_STOCK_ALERT",
    "WEEKLY_REPORT",
    "AUTO_REPLY",
    "ORDER_FOLLOWUP",
    "REVIEW_REQUEST",
  ]),
  storeId: z.string(),
  trigger: z.record(z.string(), z.unknown()),
  action: z.record(z.string(), z.unknown()),
  status: z.enum(["ACTIVE", "PAUSED", "DRAFT"]).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const automations = await prisma.automation.findMany({
    where: { userId },
    include: { store: true, logs: { take: 5, orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(automations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const automation = await prisma.automation.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      storeId: parsed.data.storeId,
      userId,
      status: parsed.data.status ?? "ACTIVE",
      trigger: parsed.data.trigger as object,
      action: parsed.data.action as object,
    },
  });

  return NextResponse.json(automation, { status: 201 });
}
