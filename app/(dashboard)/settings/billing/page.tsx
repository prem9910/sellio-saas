"use client";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { CheckCircle, Zap, Crown, Rocket } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: "₹2,499",
    period: "/mo",
    icon: Zap,
    color: "#6366F1",
    features: [
      "Up to 5 automations",
      "1 store connection",
      "Email support",
      "Basic analytics",
      "Abandoned cart recovery",
    ],
  },
  {
    name: "Growth",
    price: "₹6,499",
    period: "/mo",
    icon: Rocket,
    color: "#F59E0B",
    popular: true,
    features: [
      "Up to 25 automations",
      "3 store connections",
      "Priority support",
      "Advanced analytics",
      "All automation types",
      "AI weekly reports",
      "Auto-reply AI",
    ],
  },
  {
    name: "Pro",
    price: "₹16,499",
    period: "/mo",
    icon: Crown,
    color: "#10B981",
    features: [
      "Unlimited automations",
      "Unlimited stores",
      "Dedicated support",
      "Custom integrations",
      "White-label option",
      "API access",
      "All Growth features",
    ],
  },
];

export default function BillingPage() {
  const { data: session } = useSession();
  const currentPlan = (session?.user as { plan?: string })?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Billing
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your subscription and billing details
        </p>
      </motion.div>

      {/* Current plan */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6"
      >
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Current Plan
        </p>
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            {currentPlan}
          </span>
          {currentPlan === "FREE" && (
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              Upgrade to unlock more features
            </span>
          )}
        </div>
      </motion.div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.name.toUpperCase();
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="relative glass-card rounded-2xl p-6 flex flex-col"
              style={
                plan.popular
                  ? { border: `1px solid ${plan.color}`, background: `rgba(245,158,11,0.04)` }
                  : {}
              }
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: plan.color }}
                >
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: `${plan.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {plan.name}
                  </h3>
                  <p
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-jetbrains)", color: plan.color }}
                  >
                    {plan.price}
                    <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                      {plan.period}
                    </span>
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }} />
                    <span style={{ color: "var(--text-muted)" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                style={
                  isCurrent
                    ? {
                        background: `${plan.color}20`,
                        color: plan.color,
                        border: `1px solid ${plan.color}40`,
                        cursor: "default",
                      }
                    : {
                        background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                        color: "white",
                        border: "none",
                      }
                }
                disabled={isCurrent}
              >
                {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
              </button>
            </motion.div>
          );
        })}
      </div>

      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        All plans include GST. Payments processed securely by Razorpay.
        Cancel anytime.
      </p>
    </div>
  );
}
