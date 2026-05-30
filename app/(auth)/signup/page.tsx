"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";

const PERKS = [
  "Free plan — no credit card needed",
  "Abandoned cart recovery automation",
  "AI-powered weekly reports",
  "Works with Shopify & WooCommerce",
];

export default function SignupPage() {
  async function handleGoogle() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="mesh-bg" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 glass-card rounded-2xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366F1, #4F46E5)" }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
          >
            Sellio
          </span>
        </div>

        <h1
          className="text-2xl font-bold text-center mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          Start for free
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Built for sellers, powered by AI
        </p>

        <ul className="space-y-2 mb-6">
          {PERKS.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10B981" }} />
              <span style={{ color: "var(--text-muted)" }}>{p}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleGoogle}
          className="btn-primary w-full flex items-center justify-center gap-3"
        >
          Sign up with Google
        </button>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#6366F1" }}>
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
