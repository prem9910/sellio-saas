export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  platform: z.enum(["shopify", "woocommerce", "other"]),
  url: z.string().url(),
  apiKey: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const stores = await prisma.store.findMany({
    where: { userId },
    include: { _count: { select: { automations: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(stores);
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

  const store = await prisma.store.create({
    data: { ...parsed.data, userId },
  });

  return NextResponse.json(store, { status: 201 });
}
