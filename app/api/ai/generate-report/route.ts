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
  const { storeId } = await req.json();

  const [store, automations] = await Promise.all([
    prisma.store.findFirst({ where: { id: storeId, userId } }),
    prisma.automation.findMany({
      where: { storeId, userId },
      include: { logs: { take: 10, orderBy: { createdAt: "desc" } } },
    }),
  ]);

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const stats = {
    totalAutomations: automations.length,
    activeAutomations: automations.filter((a) => a.status === "ACTIVE").length,
    totalRuns: automations.reduce((sum, a) => sum + a.runCount, 0),
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an e-commerce analytics expert. Generate a concise, actionable weekly performance report in markdown format for an Indian store owner.",
      },
      {
        role: "user",
        content: `Generate a weekly report for store: ${store.name} (${store.platform})
Stats: ${JSON.stringify(stats)}
Automations: ${automations.map((a) => `${a.name} (${a.type}) - ${a.runCount} runs`).join(", ")}
Include: performance summary, automation insights, 3 actionable recommendations.`,
      },
    ],
    max_tokens: 1000,
  });

  const report = completion.choices[0]?.message?.content ?? "";

  return NextResponse.json({ report });
}
