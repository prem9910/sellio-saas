"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Store, X, ShoppingCart, Globe } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Store name required"),
  platform: z.enum(["shopify", "woocommerce", "other"]),
  url: z.string().url("Valid URL required"),
  apiKey: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface StoreData {
  id: string;
  name: string;
  platform: string;
  url: string;
  createdAt: string;
  _count: { automations: number };
}

const PLATFORM_ICONS: Record<string, typeof ShoppingCart> = {
  shopify: ShoppingCart,
  woocommerce: Globe,
  other: Store,
};

export default function StoresPage() {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { platform: "shopify" },
  });

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => {
        setStores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function onSubmit(data: FormData) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const store = await res.json();
      if (!res.ok) throw new Error("Failed to add store");
      setStores((prev) => [{ ...store, _count: { automations: 0 } }, ...prev]);
      setShowModal(false);
      reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

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
            Stores
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Connect your e-commerce stores
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Connect Store
        </button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 animate-pulse h-36" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <Store className="w-12 h-12 mx-auto mb-4" style={{ color: "#6366F1" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            No stores connected
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Connect your Shopify or WooCommerce store to start automating.
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Connect Store
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {stores.map((store, i) => {
            const Icon = PLATFORM_ICONS[store.platform] ?? Store;
            return (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(99,102,241,0.15)" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: "#6366F1" }} />
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: "rgba(16,185,129,0.15)",
                      color: "#10B981",
                    }}
                  >
                    Connected
                  </span>
                </div>
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {store.name}
                </h3>
                <p className="text-xs mt-1 capitalize" style={{ color: "var(--text-muted)" }}>
                  {store.platform} · {store._count.automations} automations
                </p>
                <p
                  className="text-xs mt-1 truncate"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains)" }}
                >
                  {store.url}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.7)" }}
            onClick={() => setShowModal(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative glass-card rounded-2xl p-6 w-full max-w-md z-10"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Connect Store
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Store Name
                </label>
                <input
                  {...register("name")}
                  placeholder="My Shopify Store"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--bg-card)",
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

              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Platform
                </label>
                <select
                  {...register("platform")}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="shopify" style={{ background: "#0D1423" }}>
                    Shopify
                  </option>
                  <option value="woocommerce" style={{ background: "#0D1423" }}>
                    WooCommerce
                  </option>
                  <option value="other" style={{ background: "#0D1423" }}>
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
                  Store URL
                </label>
                <input
                  {...register("url")}
                  placeholder="https://mystore.myshopify.com"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: `1px solid ${errors.url ? "#EF4444" : "var(--border)"}`,
                    color: "var(--text-primary)",
                  }}
                />
                {errors.url && (
                  <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                    {errors.url.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
                  API Key (optional)
                </label>
                <input
                  {...register("apiKey")}
                  type="password"
                  placeholder="shpat_xxxx"
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-jetbrains)",
                  }}
                />
              </div>

              {error && (
                <p className="text-xs" style={{ color: "#EF4444" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full py-2.5"
              >
                {saving ? "Connecting..." : "Connect Store"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
