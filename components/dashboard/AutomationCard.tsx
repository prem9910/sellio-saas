"use client";

import { motion } from "framer-motion";
import { Zap, Pause, Play, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AutomationCardProps {
  id: string;
  name: string;
  type: string;
  status: "ACTIVE" | "PAUSED" | "DRAFT";
  runCount: number;
  lastRun?: string | null;
  storeName?: string;
  delay?: number;
  onToggle?: (id: string, status: string) => void;
  onDelete?: (id: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  ABANDONED_CART: "Abandoned Cart",
  LOW_STOCK_ALERT: "Low Stock Alert",
  WEEKLY_REPORT: "Weekly Report",
  AUTO_REPLY: "Auto Reply",
  ORDER_FOLLOWUP: "Order Follow-up",
  REVIEW_REQUEST: "Review Request",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#10B981",
  PAUSED: "#F59E0B",
  DRAFT: "#64748B",
};

export default function AutomationCard({
  id,
  name,
  type,
  status,
  runCount,
  lastRun,
  storeName,
  delay = 0,
  onToggle,
  onDelete,
}: AutomationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="glass-card rounded-xl p-5 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(99,102,241,0.15)" }}
          >
            <Zap className="w-4 h-4" style={{ color: "#6366F1" }} />
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              {name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {TYPE_LABELS[type] ?? type}
              {storeName && ` · ${storeName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: STATUS_COLORS[status] }}
          />
          <span className="text-xs" style={{ color: STATUS_COLORS[status] }}>
            {status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div>
            <p
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}
            >
              {runCount}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              runs
            </p>
          </div>
          {lastRun && (
            <div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Last run
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                {new Date(lastRun).toLocaleDateString("en-IN")}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/automations/${id}`}>
            <button
              className="p-1.5 rounded-md transition-colors"
              style={{ color: "var(--text-muted)" }}
              title="View details"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </Link>

          {onToggle && (
            <button
              onClick={() => onToggle(id, status)}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: status === "ACTIVE" ? "#F59E0B" : "#10B981" }}
              title={status === "ACTIVE" ? "Pause" : "Activate"}
            >
              {status === "ACTIVE" ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 rounded-md transition-colors"
              style={{ color: "#EF4444" }}
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
