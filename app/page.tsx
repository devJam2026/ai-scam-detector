"use client";

import { useState } from "react";
import {
  ScamAnalysis,
  ScamResultCard
} from "./components/ScamResultCard";
import { ExampleMessages } from "./components/ExampleMessages";
import { ScanHistory } from "./components/ScanHistory";

type ScanHistoryItem = {
  id: string;
  message: string;
  result: ScamAnalysis;
};

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeMessage() {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/analyze-scam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);

      const historyItem: ScanHistoryItem = {
        id: crypto.randomUUID(),
        message,
        result: data
      };

      setHistory((previous) => [historyItem, ...previous].slice(0, 5));
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to analyze message"
      );
    } finally {
      setLoading(false);
    }
  }

  function selectHistoryItem(item: ScanHistoryItem) {
    setMessage(item.message);
    setResult(item.result);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
              <p className="text-sm font-medium uppercase tracking-widest text-blue-300">
                GenAI Security Project
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                AI-Powered Scam Detection System
              </h1>

              <p className="mt-4 max-w-2xl text-slate-300">
                Paste an email, SMS, or WhatsApp-style message. The system uses
                an LLM with structured output validation to detect scam,
                phishing, spam, and social engineering risk.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-2xl font-bold">JSON</p>
                  <p className="text-sm text-slate-400">Structured Output</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-2xl font-bold">Zod</p>
                  <p className="text-sm text-slate-400">Schema Validation</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-2xl font-bold">AI</p>
                  <p className="text-sm text-slate-400">Risk Explanation</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <label className="text-sm font-medium text-slate-300">
                Message to Analyze
              </label>

              <textarea
                className="mt-3 h-52 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-white outline-none focus:border-blue-500"
                placeholder="Paste suspicious message here..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />

              {error && (
                <div className="mt-4 rounded-xl border border-red-800 bg-red-950 p-4 text-sm text-red-100">
                  {error}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={analyzeMessage}
                  disabled={loading || !message.trim()}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {loading ? "Analyzing..." : "Analyze Message"}
                </button>

                <button
                  onClick={() => {
                    setMessage("");
                    setResult(null);
                    setError("");
                  }}
                  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-800"
                >
                  Clear
                </button>
              </div>
            </div>

            <ExampleMessages onSelect={setMessage} />
          </div>

          <div className="space-y-6">
            {result ? (
              <ScamResultCard result={result} />
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-8 text-center">
                <p className="text-xl font-semibold">No analysis yet</p>
                <p className="mt-2 text-slate-400">
                  Paste a message and click Analyze Message to see the scam risk
                  report.
                </p>
              </div>
            )}

            <ScanHistory history={history} onSelect={selectHistoryItem} />
          </div>
        </section>
      </div>
    </main>
  );
}