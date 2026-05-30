"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText } from "lucide-react";

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

function getLastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(
      d.toLocaleString("en-IN", { month: "long", year: "numeric" })
    );
  }
  return months;
}

async function downloadPDF(month: string, stats: Stats) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(`Sellio Admin Report — ${month}`, 14, 22);
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

  // Summary section
  doc.setFontSize(13);
  doc.text("Summary", 14, 42);
  autoTable(doc, {
    startY: 46,
    head: [["Metric", "Value"]],
    body: [
      ["Total Users", String(stats.totalUsers)],
      ["Total Revenue", `₹${(stats.totalRevenue / 100).toFixed(2)}`],
      ["Total Automations", String(stats.totalAutomations)],
      ["Total Stores", String(stats.totalStores)],
    ],
  });

  // Users by plan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY1 = (doc as any).lastAutoTable.finalY;
  doc.setFontSize(13);
  doc.text("Users by Plan", 14, finalY1 + 10);
  autoTable(doc, {
    startY: finalY1 + 14,
    head: [["Plan", "Count"]],
    body: Object.entries(stats.usersByPlan).map(([plan, count]) => [plan, String(count)]),
  });

  // Payments table
  doc.addPage();
  doc.setFontSize(13);
  doc.text("Payment History", 14, 20);
  autoTable(doc, {
    startY: 24,
    head: [["User", "Plan", "Amount", "Status", "Date"]],
    body: stats.recentPayments.map((p) => [
      p.user?.email ?? "—",
      p.plan,
      `₹${(p.amount / 100).toFixed(2)}`,
      p.status,
      new Date(p.createdAt).toLocaleDateString("en-IN"),
    ]),
  });

  doc.save(`sellio-report-${month.replace(" ", "-")}.pdf`);
}

export default function AdminReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const months = getLastNMonths(12);
  const [selectedMonth, setSelectedMonth] = useState(months[0]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter payments for selected month
  const filteredPayments =
    stats?.recentPayments.filter((p) => {
      const d = new Date(p.createdAt);
      const label = d.toLocaleString("en-IN", { month: "long", year: "numeric" });
      return label === selectedMonth;
    }) ?? [];

  const monthRevenue = filteredPayments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  async function handleDownload() {
    if (!stats) return;
    setDownloading(true);
    try {
      await downloadPDF(selectedMonth, {
        ...stats,
        recentPayments: filteredPayments,
        totalRevenue: monthRevenue,
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Reports
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Monthly revenue and activity reports
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={loading || downloading || !stats}
          className="btn-primary flex items-center gap-2"
        >
          {downloading ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download PDF
        </button>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Select Month:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        >
          {months.map((m) => (
            <option key={m} value={m} style={{ background: "#0D1423" }}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-24" />
          ))}
        </div>
      ) : !stats ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Failed to load stats.
        </p>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-5">
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Revenue ({selectedMonth})
              </p>
              <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
                ₹{(monthRevenue / 100).toFixed(2)}
              </p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Payments this month
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {filteredPayments.length}
              </p>
            </div>
            <div className="glass-card rounded-xl p-5">
              <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
                Total Users (all time)
              </p>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {stats.totalUsers}
              </p>
            </div>
          </div>

          {/* Payments table for month */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" style={{ color: "#6366F1" }} />
              <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Payments — {selectedMonth}
              </h2>
            </div>
            {filteredPayments.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No payments in this period.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ color: "var(--text-muted)" }}>
                      {["User", "Plan", "Amount", "Status", "Date"].map((h) => (
                        <th key={h} className="text-left pb-3 font-medium pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((p) => (
                      <tr key={p.id} style={{ borderTop: "1px solid var(--border)" }}>
                        <td className="py-2.5 pr-4" style={{ color: "var(--text-primary)" }}>
                          {p.user?.email ?? "—"}
                        </td>
                        <td className="py-2.5 pr-4" style={{ color: "var(--text-muted)" }}>
                          {p.plan}
                        </td>
                        <td className="py-2.5 pr-4" style={{ color: "var(--text-primary)" }}>
                          ₹{(p.amount / 100).toFixed(2)}
                        </td>
                        <td className="py-2.5 pr-4" style={{ color: "var(--text-muted)" }}>
                          {p.status}
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

          {/* Monthly revenue summary table */}
          <div className="glass-card rounded-xl p-5">
            <h2 className="text-base font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Monthly Revenue Summary
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--text-muted)" }}>
                    <th className="text-left pb-3 font-medium pr-4">Month</th>
                    <th className="text-left pb-3 font-medium pr-4">Revenue</th>
                    <th className="text-left pb-3 font-medium">New Users</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.monthlyRevenue.map((m) => (
                    <tr
                      key={m.month}
                      style={{
                        borderTop: "1px solid var(--border)",
                        background: m.month === selectedMonth ? "rgba(99,102,241,0.05)" : undefined,
                      }}
                    >
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
        </>
      )}
    </motion.div>
  );
}
