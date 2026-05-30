"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, TrendingUp, Zap, Store } from "lucide-react";

interface Stats {
  totalUsers: number;
  usersByPlan: Record<string, number>;
  totalStores: number;
  totalAutomations: number;
  totalRevenue: number;
  recentPayments: {
    id: string;
    plan: string;
    amount: number;
    status: string;
    createdAt: string;
    user: { email: string; name: string | null } | null;
  }[];
  monthlyRevenue: { month: string; revenue: number; users: number }[];
}

const planColors: Record<string, string> = {
  FREE: "#64748B",
  STARTER: "#10B981",
  GROWTH: "#F59E0B",
  PRO: "#6366F1",
};

const statusColors: Record<string, string> = {
  paid: "#10B981",
  failed: "#EF4444",
  refunded: "#F59E0B",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 glass-card rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-28" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Failed to load stats.
      </p>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      iconColor: "#6366F1",
    },
    {
      title: "Total Revenue",
      value: `₹${(stats.totalRevenue / 100).toFixed(2)}`,
      icon: TrendingUp,
      iconColor: "#10B981",
    },
    {
      title: "Active Automations",
      value: stats.totalAutomations,
      icon: Zap,
      iconColor: "#F59E0B",
    },
    {
      title: "Total Stores",
      value: stats.totalStores,
      icon: Store,
      iconColor: "#6366F1",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Overview of all Sellio users and activity
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ title, value, icon: Icon, iconColor }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {title}
              </p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${iconColor}18` }}
              >
                <Icon className="w-4 h-4" style={{ color: iconColor }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              {value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Users by Plan
        </h2>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.usersByPlan).map(([plan, count]) => (
            <div
              key={plan}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{
                background: `${planColors[plan] ?? "#64748B"}18`,
                color: planColors[plan] ?? "#64748B",
                border: `1px solid ${planColors[plan] ?? "#64748B"}33`,
              }}
            >
              {plan} — {count}
            </div>
          ))}
        </div>
      </div>

      {/* Recent payments */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Recent Payments
        </h2>
        {stats.recentPayments.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No payments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--text-muted)" }}>
                  <th className="text-left pb-3 font-medium">User Email</th>
                  <th className="text-left pb-3 font-medium">Plan</th>
                  <th className="text-left pb-3 font-medium">Amount</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.map((p) => (
                  <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                    <td className="py-2.5 pr-4" style={{ color: "var(--text-primary)" }}>
                      {p.user?.email ?? "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: `${planColors[p.plan] ?? "#64748B"}18`,
                          color: planColors[p.plan] ?? "#64748B",
                        }}
                      >
                        {p.plan}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4" style={{ color: "var(--text-primary)" }}>
                      ₹{(p.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: `${statusColors[p.status] ?? "#64748B"}18`,
                          color: statusColors[p.status] ?? "#64748B",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2.5" style={{ color: "var(--text-muted)" }}>
                      {new Date(p.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Monthly revenue */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Monthly Revenue (last 6 months)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: "var(--text-muted)" }}>
                <th className="text-left pb-3 font-medium">Month</th>
                <th className="text-left pb-3 font-medium">Revenue</th>
                <th className="text-left pb-3 font-medium">New Users</th>
              </tr>
            </thead>
            <tbody>
              {stats.monthlyRevenue.map((m) => (
                <tr key={m.month} style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="py-2.5 pr-4 font-medium" style={{ color: "var(--text-primary)" }}>
                    {m.month}
                  </td>
                  <td className="py-2.5 pr-4" style={{ color: "#10B981" }}>
                    ₹{(m.revenue / 100).toFixed(2)}
                  </td>
                  <td className="py-2.5" style={{ color: "var(--text-muted)" }}>
                    {m.users}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
