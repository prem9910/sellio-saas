"use client";

import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 right-0 left-64 h-16 z-30 flex items-center justify-between px-6"
      style={{
        background: "rgba(8, 12, 20, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Search automations..."
          className="pl-9 pr-4 py-2 text-sm rounded-lg outline-none w-64"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <Bell className="w-5 h-5" />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ background: "#6366F1" }}
          />
        </button>

        <div className="flex items-center gap-2">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? "User"}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
            >
              {session?.user?.name?.[0] ?? "U"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {(session?.user as { plan?: string })?.plan ?? "FREE"}
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
