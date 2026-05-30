"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PERKS = [
  "Free plan — no credit card needed",
  "Abandoned cart recovery automation",
  "AI-powered weekly reports",
  "Works with Shopify & WooCommerce",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function handleGoogle() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleMagicLink() {
    if (!email) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
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
        <div className="flex items-center justify-center gap-2 mb-6">
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
        <p className="text-center text-sm mb-5" style={{ color: "var(--text-muted)" }}>
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

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ background: "rgba(16,185,129,0.15)" }}
            >
              <Mail className="w-6 h-6" style={{ color: "#10B981" }} />
            </div>
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Check your email
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Magic link sent to <strong>{email}</strong>
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="btn-primary w-full flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              )}
              Sign up with Google
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>or email</span>
              <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

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

            {error && <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>}

            <button
              onClick={handleMagicLink}
              disabled={loading || !email}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Continue with Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#6366F1" }}>Sign in</Link>
        </p>
        <p className="text-center text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          By signing up you agree to our Terms of Service.
        </p>
      </motion.div>
    </div>
  );
}
