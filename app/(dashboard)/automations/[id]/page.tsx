"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

interface AutomationLog {
  id: string;
  status: string;
  message: string;
  createdAt: string;
}

interface Automation {
  id: string;
  name: string;
  type: string;
  status: string;
  runCount: number;
  lastRun: string | null;
  store: { name: string; platform: string };
  logs: AutomationLog[];
  createdAt: string;
}

export default function AutomationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetch(`/api/automations/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setAutomation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function toggleStatus() {
    if (!automation) return;
    setToggling(true);
    const newStatus = automation.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    await fetch(`/api/automations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setAutomation((prev) => prev ? { ...prev, status: newStatus } : prev);
    setToggling(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this automation permanently?")) return;
    await fetch(`/api/automations/${id}`, { method: "DELETE" });
    router.push("/automations");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!automation) {
    return (
      <div className="text-center py-20">
        <p style={{ color: "var(--text-muted)" }}>Automation not found.</p>
        <Link href="/automations" className="btn-primary mt-4 inline-block">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          href="/automations"
          className="inline-flex items-center gap-2 text-sm mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(99,102,241,0.15)" }}
            >
              <Zap className="w-5 h-5" style={{ color: "#6366F1" }} />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
              >
                {automation.name}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {automation.store?.name} · {automation.type.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleStatus}
              disabled={toggling}
              className="btn-secondary text-sm"
            >
              {automation.status === "ACTIVE" ? "Pause" : "Activate"}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#EF4444",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: "Total Runs", value: automation.runCount },
          {
            label: "Status",
            value: automation.status,
          },
          {
            label: "Last Run",
            value: automation.lastRun
              ? new Date(automation.lastRun).toLocaleDateString("en-IN")
              : "Never",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
            <p
              className="text-xl font-bold"
              style={{
                fontFamily: "var(--font-jetbrains)",
                color:
                  stat.label === "Status"
                    ? automation.status === "ACTIVE"
                      ? "#10B981"
                      : "#F59E0B"
                    : "var(--text-primary)",
              }}
            >
              {String(stat.value)}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Logs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl p-6"
      >
        <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Run Logs
        </h2>
        {automation.logs.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
            No logs yet. This automation hasn&apos;t run.
          </p>
        ) : (
          <div className="space-y-2">
            {automation.logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                {log.status === "success" ? (
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#10B981" }} />
                ) : log.status === "error" ? (
                  <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#EF4444" }} />
                ) : (
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                    {log.message}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {new Date(log.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
