export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { storeId } = await req.json();

  const [store, automations] = await Promise.all([
    prisma.store.findFirst({ where: { id: storeId, userId: user.id } }),
    prisma.automation.findMany({
      where: { storeId, userId: user.id },
      include: { logs: { take: 10, orderBy: { createdAt: "desc" } } },
    }),
  ]);

  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const stats = {
    totalAutomations: automations.length,
    activeAutomations: automations.filter((a) => a.status === "ACTIVE").length,
    totalRuns: automations.reduce((sum, a) => sum + a.runCount, 0),
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are an e-commerce analytics expert. Generate a concise, actionable weekly performance report in markdown format for an Indian store owner." },
      { role: "user", content: `Generate a weekly report for store: ${store.name} (${store.platform})\nStats: ${JSON.stringify(stats)}\nAutomations: ${automations.map((a) => `${a.name} (${a.type}) - ${a.runCount} runs`).join(", ")}\nInclude: performance summary, automation insights, 3 actionable recommendations.` },
    ],
    max_tokens: 1000,
  });

  return NextResponse.json({ report: completion.choices[0]?.message?.content ?? "" });
}
