"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "#6366F1",
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--text-muted)" }}>
            {title}
          </p>
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-primary)" }}
          >
            {value}
          </p>
          {change && (
            <p
              className="text-xs mt-1"
              style={{
                color:
                  changeType === "positive"
                    ? "#10B981"
                    : changeType === "negative"
                    ? "#EF4444"
                    : "var(--text-muted)",
              }}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${iconColor}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </motion.div>
  );
}
