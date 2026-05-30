"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleMagicLink() {
    if (!email) return;
    setLoading(true);
    setError("");
    const res = await signIn("email", { email, redirect: false });
    if (res?.error) setError("Failed to send login link");
    else setSent(true);
    setLoading(false);
  }

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
        {/* Logo */}
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
          Welcome back
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Sign in to your Sellio account
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(16,185,129,0.15)" }}
            >
              <Mail className="w-6 h-6" style={{ color: "#10B981" }} />
            </div>
            <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Check your email
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              We sent a magic link to <strong>{email}</strong>
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGoogle}
              className="btn-secondary w-full flex items-center justify-center gap-3"
            >
              Continue with Google
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                or
              </span>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
              />
            </div>

            {error && (
              <p className="text-xs" style={{ color: "#EF4444" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Magic Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={{ color: "#6366F1" }}>
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
