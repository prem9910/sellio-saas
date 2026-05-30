"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [notifications, setNotifications] = useState({
    automationRun: true,
    weeklyReport: true,
    paymentAlert: true,
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? "");
      setUserName(data.user?.user_metadata?.full_name ?? "");
    });
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your account and preferences
        </p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-5 h-5" style={{ color: "#6366F1" }} />
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Name</label>
            <input defaultValue={userName} readOnly className="w-full px-4 py-2.5 rounded-lg text-sm"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Email</label>
            <input defaultValue={userEmail} readOnly className="w-full px-4 py-2.5 rounded-lg text-sm"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", fontFamily: "var(--font-jetbrains)" }} />
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Authenticated via Supabase. Profile updates available in your Supabase account.
          </p>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5" style={{ color: "#F59E0B" }} />
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Notifications</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: "automationRun" as const, label: "Automation run alerts" },
            { key: "weeklyReport" as const, label: "Weekly report emails" },
            { key: "paymentAlert" as const, label: "Payment & billing alerts" },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm" style={{ color: "var(--text-primary)" }}>{item.label}</span>
              <div onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer"
                style={{ background: notifications[item.key] ? "#6366F1" : "var(--bg-card)", border: "1px solid var(--border)" }}>
                <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200"
                  style={{ transform: notifications[item.key] ? "translateX(22px)" : "translateX(2px)" }} />
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5" style={{ color: "#10B981" }} />
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Security</h2>
        </div>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Authentication is handled by Supabase Auth with Google OAuth and magic email links.
        </p>
      </motion.div>
    </div>
  );
}
