"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Filter, Search } from "lucide-react";
import AutomationCard from "@/components/dashboard/AutomationCard";
import Link from "next/link";

interface Automation {
  id: string;
  name: string;
  type: string;
  status: "ACTIVE" | "PAUSED" | "DRAFT";
  runCount: number;
  lastRun: string | null;
  store: { name: string };
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/automations")
      .then((r) => r.json())
      .then((data) => {
        setAutomations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function toggleAutomation(id: string, status: string) {
    const newStatus = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    await fetch(`/api/automations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus as "ACTIVE" | "PAUSED" } : a))
    );
  }

  async function deleteAutomation(id: string) {
    if (!confirm("Delete this automation?")) return;
    await fetch(`/api/automations/${id}`, { method: "DELETE" });
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  }

  const filtered = automations.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "ALL" || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Automations
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {automations.length} automation{automations.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link href="/automations/new">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Automation
          </button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
          {["ALL", "ACTIVE", "PAUSED", "DRAFT"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 text-xs rounded-lg font-medium transition-all"
              style={{
                background: filter === s ? "rgba(99,102,241,0.2)" : "var(--bg-card)",
                color: filter === s ? "#6366F1" : "var(--text-muted)",
                border: `1px solid ${filter === s ? "#6366F1" : "var(--border)"}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {search || filter !== "ALL"
              ? "No automations match your filters."
              : "No automations yet. Create your first one!"}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a, i) => (
            <AutomationCard
              key={a.id}
              {...a}
              storeName={a.store?.name}
              delay={i * 0.05}
              onToggle={toggleAutomation}
              onDelete={deleteAutomation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
