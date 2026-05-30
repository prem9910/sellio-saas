"use client";

import { motion } from "framer-motion";
import { CheckCircle, Zap, Crown, Rocket } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter", price: "₹2,499", period: "/mo", icon: Zap, color: "#6366F1", popular: false,
    features: ["5 automations", "1 store", "Email support", "Basic analytics", "Abandoned cart"],
  },
  {
    name: "Growth", price: "₹6,499", period: "/mo", icon: Rocket, color: "#F59E0B", popular: true,
    features: ["25 automations", "3 stores", "Priority support", "AI reports", "All automation types", "Auto-reply AI"],
  },
  {
    name: "Pro", price: "₹16,499", period: "/mo", icon: Crown, color: "#10B981", popular: false,
    features: ["Unlimited automations", "Unlimited stores", "Dedicated support", "API access", "White-label option"],
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
          Billing
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Manage your subscription
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, i) => {
          const Icon = plan.icon;
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="relative glass-card rounded-2xl p-6 flex flex-col"
              style={plan.popular ? { border: `1px solid ${plan.color}`, background: `rgba(245,158,11,0.04)` } : {}}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: plan.color }}>
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${plan.color}20` }}>
                  <Icon className="w-4 h-4" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>{plan.name}</h3>
                  <p className="text-lg font-bold" style={{ fontFamily: "var(--font-jetbrains)", color: plan.color }}>
                    {plan.price}<span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>{plan.period}</span>
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
              <Link href="/login">
                <button className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, color: "white" }}>
                  Upgrade to {plan.name}
                </button>
              </Link>
            </motion.div>
          );
        })}
      </div>
      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        All plans include GST. Payments processed securely by Razorpay. Cancel anytime.
      </p>
    </div>
  );
}
