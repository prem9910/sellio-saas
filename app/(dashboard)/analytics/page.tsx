"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Store, Activity } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

interface Automation {
  id: string;
  name: string;
  type: string;
  status: string;
  runCount: number;
}

export default function AnalyticsPage() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/automations")
      .then((r) => r.json())
      .then((d) => {
        setAutomations(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRuns = automations.reduce((s, a) => s + a.runCount, 0);
  const activeCount = automations.filter((a) => a.status === "ACTIVE").length;

  const byType = automations.reduce<Record<string, number>>((acc, a) => {
    acc[a.type] = (acc[a.type] ?? 0) + a.runCount;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Analytics
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Performance metrics for your automations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Automation Runs"
          value={String(totalRuns)}
          icon={Activity}
          iconColor="#6366F1"
          delay={0}
        />
        <StatsCard
          title="Active Automations"
          value={String(activeCount)}
          icon={Zap}
          iconColor="#10B981"
          delay={0.1}
        />
        <StatsCard
          title="Revenue Recovered (est.)"
          value="₹2.4L"
          change="From abandoned cart"
          changeType="positive"
          icon={TrendingUp}
          iconColor="#F59E0B"
          delay={0.2}
        />
        <StatsCard
          title="Automation Types"
          value={String(Object.keys(byType).length)}
          icon={Store}
          iconColor="#6366F1"
          delay={0.3}
        />
      </div>

      {/* Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        <h2 className="font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
          Runs by Automation Type
        </h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 rounded animate-pulse" style={{ background: "var(--bg-card)" }} />
            ))}
          </div>
        ) : Object.keys(byType).length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
            No automation data yet.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(byType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, runs]) => {
                const pct = totalRuns > 0 ? Math.round((runs / totalRuns) * 100) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                        {type.replace(/_/g, " ")}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-jetbrains)", color: "#6366F1" }}
                      >
                        {runs} runs ({pct}%)
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "var(--bg-card)" }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #6366F1, #4F46E5)" }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
