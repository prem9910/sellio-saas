export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const automations = await prisma.automation.findMany({
    where: { status: "ACTIVE" },
    include: { store: true, user: true },
  });

  const results: Array<{ id: string; name: string; status: string }> = [];

  for (const automation of automations) {
    try {
      await prisma.automation.update({
        where: { id: automation.id },
        data: { runCount: { increment: 1 }, lastRun: new Date() },
      });

      await prisma.automationLog.create({
        data: {
          automationId: automation.id,
          status: "success",
          message: `Automation "${automation.name}" ran successfully at ${new Date().toISOString()}`,
        },
      });

      results.push({ id: automation.id, name: automation.name, status: "success" });
    } catch (err) {
      await prisma.automationLog.create({
        data: {
          automationId: automation.id,
          status: "error",
          message: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
      });

      results.push({ id: automation.id, name: automation.name, status: "error" });
    }
  }

  return NextResponse.json({ ran: results.length, results });
}
