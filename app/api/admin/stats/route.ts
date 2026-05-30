export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireAdmin();

  const [users, stores, automations, payments] = await Promise.all([
    prisma.user.findMany({
      include: {
        _count: { select: { stores: true, automations: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.store.count(),
    prisma.automation.count(),
    prisma.payment.findMany({
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: "paid" },
  });

  const usersByPlan = {
    FREE: users.filter((u) => u.plan === "FREE").length,
    STARTER: users.filter((u) => u.plan === "STARTER").length,
    GROWTH: users.filter((u) => u.plan === "GROWTH").length,
    PRO: users.filter((u) => u.plan === "PRO").length,
  };

  // Monthly revenue for last 6 months
  const now = new Date();
  const monthlyRevenue = await Promise.all(
    Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const label = d.toLocaleString("en-IN", { month: "short", year: "numeric" });
      return prisma.payment
        .aggregate({
          _sum: { amount: true },
          where: { status: "paid", createdAt: { gte: start, lte: end } },
        })
        .then(async (rev) => {
          const userCount = await prisma.user.count({
            where: { createdAt: { gte: start, lte: end } },
          });
          return { month: label, revenue: rev._sum.amount ?? 0, users: userCount };
        });
    })
  );

  const allUsers = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    plan: u.plan,
    createdAt: u.createdAt,
    stores: u._count.stores,
    automations: u._count.automations,
  }));

  return NextResponse.json({
    totalUsers: users.length,
    usersByPlan,
    totalStores: stores,
    totalAutomations: automations,
    totalRevenue: totalRevenue._sum.amount ?? 0,
    recentPayments: payments,
    monthlyRevenue,
    allUsers,
  });
}
