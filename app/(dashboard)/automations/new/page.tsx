"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "ABANDONED_CART",
    "LOW_STOCK_ALERT",
    "WEEKLY_REPORT",
    "AUTO_REPLY",
    "ORDER_FOLLOWUP",
    "REVIEW_REQUEST",
  ]),
  storeId: z.string().min(1, "Select a store"),
  status: z.enum(["ACTIVE", "PAUSED", "DRAFT"]),
});

type FormData = z.infer<typeof schema>;

const AUTOMATION_TYPES = [
  {
    value: "ABANDONED_CART",
    label: "Abandoned Cart",
    desc: "Recover lost sales by emailing customers who left items in cart",
  },
  {
    value: "LOW_STOCK_ALERT",
    label: "Low Stock Alert",
    desc: "Get notified when product inventory falls below threshold",
  },
  {
    value: "WEEKLY_REPORT",
    label: "Weekly Report",
    desc: "AI-generated performance summary delivered every Monday",
  },
  {
    value: "AUTO_REPLY",
    label: "Auto Reply",
    desc: "AI-powered responses to common customer messages",
  },
  {
    value: "ORDER_FOLLOWUP",
    label: "Order Follow-up",
    desc: "Thank customers after purchase and request reviews",
  },
  {
    value: "REVIEW_REQUEST",
    label: "Review Request",
    desc: "Automatically ask happy customers for product reviews",
  },
];

interface Store {
  id: string;
  name: string;
  platform: string;
}

export default function NewAutomationPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "ACTIVE" },
  });

  const selectedType = watch("type");

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => setStores(Array.isArray(data) ? data : []));
  }, []);

  async function onSubmit(data: FormData) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, trigger: {}, action: {} }),
      });
      if (!res.ok) throw new Error("Failed to create automation");
      router.push("/automations");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link
          href="/automations"
          className="inline-flex items-center gap-2 text-sm mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Automations
        </Link>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          New Automation
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Set up a new automation for your store
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Name */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Basic Details
          </h2>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
              Automation Name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Recover Abandoned Carts"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${errors.name ? "#EF4444" : "var(--border)"}`,
                color: "var(--text-primary)",
              }}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Store */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
              Store
            </label>
            {stores.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                No stores connected.{" "}
                <Link href="/stores" style={{ color: "#6366F1" }}>
                  Add a store first →
                </Link>
              </p>
            ) : (
              <select
                {...register("storeId")}
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${errors.storeId ? "#EF4444" : "var(--border)"}`,
                  color: "var(--text-primary)",
                }}
              >
                <option value="">Select a store</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id} style={{ background: "#0D1423" }}>
                    {s.name} ({s.platform})
                  </option>
                ))}
              </select>
            )}
            {errors.storeId && (
              <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                {errors.storeId.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
              Initial Status
            </label>
            <div className="flex gap-2">
              {(["ACTIVE", "PAUSED", "DRAFT"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setValue("status", s)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background:
                      watch("status") === s ? "rgba(99,102,241,0.2)" : "var(--bg-card)",
                    color: watch("status") === s ? "#6366F1" : "var(--text-muted)",
                    border: `1px solid ${watch("status") === s ? "#6366F1" : "var(--border)"}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Type selection */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
            Automation Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AUTOMATION_TYPES.map((t) => {
              const isSelected = selectedType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() =>
                    setValue("type", t.value as FormData["type"])
                  }
                  className="text-left p-4 rounded-lg transition-all"
                  style={{
                    background: isSelected ? "rgba(99,102,241,0.12)" : "var(--bg-card)",
                    border: `1px solid ${isSelected ? "#6366F1" : "var(--border)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-sm font-medium"
                      style={{ color: isSelected ? "#6366F1" : "var(--text-primary)" }}
                    >
                      {t.label}
                    </span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-[#6366F1]" />}
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
          {errors.type && (
            <p className="text-xs mt-2" style={{ color: "#EF4444" }}>
              Select an automation type
            </p>
          )}
        </div>

        {error && (
          <p className="text-sm text-center" style={{ color: "#EF4444" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {loading ? "Creating..." : "Create Automation"}
        </button>
      </motion.form>
    </div>
  );
}
