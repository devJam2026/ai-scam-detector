"use client";

import { useState } from "react";
import {
  ScamAnalysis,
  ScamResultCard
} from "./components/ScamResultCard";
import ApproachComparison from "./components/ApproachComparison";
import AnalysisLoader from "./components/AnalysisLoader";
import EmptyResultState from "./components/EmptyResultState";
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
  const [compareResult, setCompareResult] = useState<any | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loadingMode, setLoadingMode] = useState<"analyze" | "compare" | null>(null);
  const [error, setError] = useState("");
  const [approach, setApproach] = useState("openai_llm");

  async function analyzeMessage() {
    if (!message.trim()) return;

    setLoadingMode("analyze");
    setCompareResult(null);
    setError("");

    try {
      const response = await fetch("/api/analyze-scam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, approach })
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
      setLoadingMode(null);
    }
  }

  async function compareAllApproaches() {
    if (!message.trim()) return;

    setLoadingMode("compare");
    setResult(null);
    setError("");

    try {
      const response = await fetch("/api/analyze-scam/compare", {
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

      setCompareResult(data);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to compare approaches"
      );
    } finally {
      setLoadingMode(null);
    }
  }

  function selectHistoryItem(item: ScanHistoryItem) {
    setMessage(item.message);
    setResult(item.result);
    setCompareResult(null);
    setError("");
  }

  const isBusy = loadingMode !== null;

  return (
    <main className="min-h-screen px-6 py-8 text-white">
      <AnalysisLoader isVisible={isBusy} mode={loadingMode ?? "analyze"} />
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
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

              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Detection Approach
                </label>
                <select
                  value={approach}
                  onChange={(event) => setApproach(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="openai_llm">OpenAI LLM</option>
                  <option value="rule_based">Rule-Based</option>
                  <option value="ml_classifier">ML Classifier</option>
                  <option value="local_llm">Local LLM</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-800 bg-red-950 p-4 text-sm text-red-100">
                  {error}
                </div>
              )}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={analyzeMessage}
                  disabled={isBusy || !message.trim()}
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Analyze Message
                </button>

                <button
                  onClick={compareAllApproaches}
                  disabled={isBusy || !message.trim()}
                  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Compare All
                </button>

                <button
                  onClick={() => {
                    setMessage("");
                    setResult(null);
                    setCompareResult(null);
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
            {compareResult ? (
              <ApproachComparison compareResult={compareResult} />
            ) : result ? (
              <ScamResultCard result={result} />
            ) : (
              <EmptyResultState />
            )}

            <ScanHistory history={history} onSelect={selectHistoryItem} />
          </div>
        </section>
      </div>
    </main>
  );
}