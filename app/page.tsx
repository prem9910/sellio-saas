"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Bell,
  ShoppingCart,
  ArrowRight,
  Star,
  Check,
  Play,
} from "lucide-react";

const FEATURES = [
  {
    icon: ShoppingCart,
    title: "Abandoned Cart Recovery",
    desc: "Automatically email customers who leave items in cart. Recover up to 15% of lost revenue.",
    color: "#6366F1",
  },
  {
    icon: Bell,
    title: "Low Stock Alerts",
    desc: "Get instant notifications when inventory drops below your threshold. Never run out.",
    color: "#F59E0B",
  },
  {
    icon: BarChart3,
    title: "AI Weekly Reports",
    desc: "GPT-4o analyzes your store data and delivers actionable insights every Monday.",
    color: "#10B981",
  },
  {
    icon: MessageSquare,
    title: "Auto Customer Reply",
    desc: "AI reads customer messages and sends professional replies instantly, 24/7.",
    color: "#6366F1",
  },
  {
    icon: TrendingUp,
    title: "Order Follow-up",
    desc: "Thank customers post-purchase and upsell complementary products automatically.",
    color: "#F59E0B",
  },
  {
    icon: Zap,
    title: "Review Requests",
    desc: "Timely, personalized review requests sent to happy customers to boost your rating.",
    color: "#10B981",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Owner, Priya's Boutique (Shopify)",
    avatar: "PS",
    quote:
      "Sellio recovered ₹1.2 lakhs in abandoned carts in the first month alone. The AI reports are incredibly insightful — I finally understand what's working in my store.",
    stars: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Founder, Mehta Electronics (WooCommerce)",
    avatar: "RM",
    quote:
      "The auto-reply feature saved me 3 hours every day. My customers get instant responses and my reviews have gone from 3.8 to 4.6 stars. Absolutely worth it.",
    stars: 5,
  },
  {
    name: "Kavya Reddy",
    role: "CEO, KR Fashion (Shopify)",
    avatar: "KR",
    quote:
      "I was skeptical about AI tools but Sellio proved me wrong. The weekly reports actually helped me identify my best-performing products and double down on them.",
    stars: 5,
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "₹2,499",
    period: "/mo",
    color: "#6366F1",
    popular: false,
    features: ["5 automations", "1 store", "Email support", "Basic analytics", "Abandoned cart"],
  },
  {
    name: "Growth",
    price: "₹6,499",
    period: "/mo",
    color: "#F59E0B",
    popular: true,
    features: [
      "25 automations",
      "3 stores",
      "Priority support",
      "AI reports",
      "All automation types",
      "Auto-reply AI",
    ],
  },
  {
    name: "Pro",
    price: "₹16,499",
    period: "/mo",
    color: "#10B981",
    popular: false,
    features: [
      "Unlimited everything",
      "Unlimited stores",
      "Dedicated support",
      "API access",
      "White-label option",
      "Custom integrations",
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <div className="mesh-bg" />

      {/* Navbar */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{
          background: "rgba(8,12,20,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            Sellio
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="btn-secondary text-sm px-4 py-2">Sign in</button>
          </Link>
          <Link href="/signup">
            <button className="btn-primary text-sm px-4 py-2">Start Free</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#6366F1" }}
            >
              <Sparkles className="w-3 h-3" />
              AI-powered for Indian sellers
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
              Built for sellers,{" "}
              <span className="gradient-text">powered by AI</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Sellio automates abandoned carts, stock alerts, customer replies, and weekly reports so
              you can focus on growing your Shopify or WooCommerce store.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <button className="btn-primary flex items-center gap-2 text-base px-6 py-3">
                  Start Free — No Card Needed
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <button className="btn-secondary flex items-center gap-2 text-base px-6 py-3">
                <Play className="w-4 h-4" />
                See It In Action
              </button>
            </div>
            <div className="flex items-center gap-8 mt-8">
              {["500+ stores", "₹50L+ recovered", "4.9/5 rating"].map((stat) => (
                <p key={stat} className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {stat}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card rounded-2xl p-4" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="flex gap-1.5">
                  {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 h-5 rounded" style={{ background: "var(--bg-card)" }} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Automations", value: "12", color: "#6366F1" },
                  { label: "Runs Today", value: "1,247", color: "#10B981" },
                  { label: "Revenue Rec.", value: "₹2.4L", color: "#F59E0B" },
                  { label: "Stores", value: "3", color: "#6366F1" },
                ].map((s) => (
                  <div key={s.label} className="glass-card rounded-lg p-3">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                    <p className="text-lg font-bold mt-1" style={{ fontFamily: "var(--font-jetbrains)", color: s.color }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { name: "Abandoned Cart Recovery", status: "ACTIVE", runs: 342 },
                  { name: "Weekly AI Report", status: "ACTIVE", runs: 8 },
                  { name: "Low Stock Alert", status: "PAUSED", runs: 56 },
                ].map((a) => (
                  <div key={a.name} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "var(--bg-card)" }}>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3" style={{ color: "#6366F1" }} />
                      <span className="text-xs" style={{ color: "var(--text-primary)" }}>{a.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--text-muted)" }}>
                        {a.runs}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: a.status === "ACTIVE" ? "#10B981" : "#F59E0B" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -top-4 -right-4 glass-card rounded-xl px-4 py-2.5"
              style={{ border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>This week</p>
              <p className="font-bold text-sm" style={{ color: "#10B981", fontFamily: "var(--font-jetbrains)" }}>
                ₹2.4L recovered
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ repeat: Infinity, duration: 3.5 }}
              className="absolute -bottom-4 -left-4 glass-card rounded-xl px-4 py-2.5"
              style={{ border: "1px solid rgba(99,102,241,0.3)" }}
            >
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Today</p>
              <p className="font-bold text-sm" style={{ color: "#6366F1", fontFamily: "var(--font-jetbrains)" }}>
                1,247 automations ran
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Everything you need to automate
          </h2>
          <p className="text-lg" style={{ color: "var(--text-muted)" }}>
            Six powerful automations built specifically for Indian e-commerce sellers
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${f.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Up and running in minutes
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Connect your store", desc: "Link your Shopify or WooCommerce store with your API key. Setup takes under 2 minutes." },
            { step: "02", title: "Choose automations", desc: "Pick from 6 pre-built automation types. Customize triggers and actions to match your business." },
            { step: "03", title: "Watch it work", desc: "Sellio runs 24/7 in the background. Get reports, recover revenue, delight customers automatically." },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))",
                  border: "1px solid rgba(99,102,241,0.3)",
                  fontFamily: "var(--font-jetbrains)",
                  color: "#6366F1",
                }}
              >
                {s.step}
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Loved by Indian sellers
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.stars)].map((_, si) => (
                  <Star key={si} className="w-4 h-4 fill-[#F59E0B]" style={{ color: "#F59E0B" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Simple, transparent pricing
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            Start free, upgrade when you grow. All prices include GST.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative glass-card rounded-2xl p-6 flex flex-col"
              style={plan.popular ? { border: `1px solid ${plan.color}`, background: `rgba(245,158,11,0.04)` } : {}}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: plan.color }}
                >
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-1" style={{ color: "var(--text-primary)" }}>{plan.name}</h3>
                <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-jetbrains)", color: plan.color }}>
                  {plan.price}
                  <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>{plan.period}</span>
                </p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: plan.color }} />
                    <span style={{ color: "var(--text-muted)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <button
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: plan.popular ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` : "transparent",
                    color: plan.popular ? "white" : plan.color,
                    border: `1px solid ${plan.color}${plan.popular ? "00" : "60"}`,
                  }}
                >
                  Get Started
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-2xl p-12"
          style={{ border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Ready to automate your store?
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
            Join 500+ Indian sellers already saving time and recovering revenue with Sellio.
          </p>
          <Link href="/signup">
            <button className="btn-primary text-base px-8 py-3 flex items-center gap-2 mx-auto">
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
            No credit card needed · Free forever plan available
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}>
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "var(--font-playfair)" }}>Sellio</span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Sellio. All rights reserved. Built for sellers, powered by AI.
          </p>
          <div className="flex gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="mailto:hello@sellio.io" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
