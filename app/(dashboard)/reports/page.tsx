"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Download } from "lucide-react";

interface Store {
  id: string;
  name: string;
  platform: string;
}

export default function ReportsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [report, setReport] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : [];
        setStores(list);
        if (list.length > 0) setSelectedStore(list[0].id);
      });
  }, []);

  async function generateReport() {
    if (!selectedStore) return;
    setGenerating(true);
    setError("");
    setReport("");
    try {
      const res = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: selectedStore }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate");
      setReport(data.report ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}
        >
          AI Reports
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Generate AI-powered performance reports for your store
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            {stores.length === 0 ? (
              <option>No stores connected</option>
            ) : (
              stores.map((s) => (
                <option key={s.id} value={s.id} style={{ background: "#0D1423" }}>
                  {s.name} ({s.platform})
                </option>
              ))
            )}
          </select>

          <button
            onClick={generateReport}
            disabled={generating || !selectedStore}
            className="btn-primary flex items-center gap-2"
          >
            {generating ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {generating ? "Generating..." : "Generate Report"}
          </button>
        </div>

        {error && (
          <p className="text-sm" style={{ color: "#EF4444" }}>
            {error}
          </p>
        )}
      </motion.div>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: "#6366F1" }} />
              <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Weekly Report
              </h2>
            </div>
            <button
              onClick={() => {
                const blob = new Blob([report], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "sellio-report.md";
                a.click();
              }}
              className="btn-secondary flex items-center gap-2 text-sm py-1.5 px-3"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          <div
            className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-dm-sans)" }}
          >
            {report}
          </div>
        </motion.div>
      )}

      {!report && !generating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: "#6366F1" }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            AI-Powered Reports
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Select a store and generate a comprehensive performance report with
            actionable insights powered by GPT-4o.
          </p>
        </motion.div>
      )}
    </div>
  );
}
