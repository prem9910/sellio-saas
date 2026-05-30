export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storeId, customerMessage } = await req.json();
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.id } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: `You are a helpful customer support agent for ${store.name}, an Indian ${store.platform} store. Reply professionally, warmly, and briefly in English.` },
      { role: "user", content: customerMessage },
    ],
    max_tokens: 300,
  });

  return NextResponse.json({ reply: completion.choices[0]?.message?.content ?? "" });
}
