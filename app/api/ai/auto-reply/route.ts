export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { storeId, customerMessage } = await req.json();

  const store = await prisma.store.findFirst({ where: { id: storeId, userId } });
  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a helpful customer support agent for ${store.name}, an Indian ${store.platform} store. Reply professionally, warmly, and briefly in English. Always offer to help further.`,
      },
      {
        role: "user",
        content: customerMessage,
      },
    ],
    max_tokens: 300,
  });

  const reply = completion.choices[0]?.message?.content ?? "";

  return NextResponse.json({ reply });
}
