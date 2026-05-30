"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  stores: number;
  automations: number;
  createdAt: string;
}

const planColors: Record<string, string> = {
  FREE: "#64748B",
  STARTER: "#10B981",
  GROWTH: "#F59E0B",
  PRO: "#6366F1",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setUsers(Array.isArray(d.allUsers) ? d.allUsers : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Users
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          All registered Sellio users
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or name…"
          className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 rounded animate-pulse" style={{ background: "var(--border)" }} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Email", "Name", "Plan", "Stores", "Automations", "Joined"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr
                      key={u.id}
                      style={{ borderTop: "1px solid var(--border)" }}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3" style={{ color: "var(--text-primary)" }}>
                        {u.email}
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--text-muted)" }}>
                        {u.name ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            background: `${planColors[u.plan] ?? "#64748B"}18`,
                            color: planColors[u.plan] ?? "#64748B",
                          }}
                        >
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--text-muted)" }}>
                        {u.stores}
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--text-muted)" }}>
                        {u.automations}
                      </td>
                      <td className="px-5 py-3" style={{ color: "var(--text-muted)" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
