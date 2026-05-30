"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, Store, TrendingUp, Activity, Plus } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
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

export default function DashboardPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/automations")
      .then((r) => r.json())
      .then((data) => {
        setAutomations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRuns = automations.reduce((s, a) => s + a.runCount, 0);
  const activeCount = automations.filter((a) => a.status === "ACTIVE").length;

  return (
    <div className="space-y-8">
      {/* Header */}
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
            Dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Welcome back — here&apos;s your store overview
          </p>
        </div>
        <Link href="/automations/new">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Automation
          </button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Active Automations"
          value={String(activeCount)}
          change="+2 this week"
          changeType="positive"
          icon={Zap}
          iconColor="#6366F1"
          delay={0}
        />
        <StatsCard
          title="Total Runs"
          value={String(totalRuns)}
          change="↑ 18% vs last week"
          changeType="positive"
          icon={Activity}
          iconColor="#10B981"
          delay={0.1}
        />
        <StatsCard
          title="Revenue Recovered"
          value="₹2.4L"
          change="Abandoned cart automations"
          changeType="positive"
          icon={TrendingUp}
          iconColor="#F59E0B"
          delay={0.2}
        />
        <StatsCard
          title="Connected Stores"
          value="—"
          change="Go to Stores to add"
          changeType="neutral"
          icon={Store}
          iconColor="#6366F1"
          delay={0.3}
        />
      </div>

      {/* Recent automations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Recent Automations
          </h2>
          <Link
            href="/automations"
            className="text-sm"
            style={{ color: "#6366F1" }}
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : automations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: "#6366F1" }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              No automations yet
            </h3>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Create your first automation to start saving time and recovering revenue.
            </p>
            <Link href="/automations/new">
              <button className="btn-primary">Create Automation</button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {automations.slice(0, 6).map((a, i) => (
              <AutomationCard
                key={a.id}
                id={a.id}
                name={a.name}
                type={a.type}
                status={a.status}
                runCount={a.runCount}
                lastRun={a.lastRun}
                storeName={a.store?.name}
                delay={i * 0.05}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
