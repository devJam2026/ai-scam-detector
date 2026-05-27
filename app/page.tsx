"use client";

import { useState } from "react";

type ScamAnalysis = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  category: string;
  confidence: number;
  riskScore: number;
  summary: string;
  detectedPatterns: {
    pattern: string;
    evidence: string;
  }[];
  reasons: string[];
  safeAction: string;
  redFlags: string[];
  userFriendlyExplanation: string;
};

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ScamAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyzeMessage() {
    setLoading(true);
    setResult(null);

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
    } catch (error) {
      console.error(error);
      alert("Failed to analyze message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold">AI Scam Detector</h1>
          <p className="text-slate-300 mt-2">
            Paste an email, SMS, or WhatsApp message and let AI explain the scam risk.
          </p>
        </div>

        <textarea
          className="w-full h-48 p-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
          placeholder="Paste suspicious message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={analyzeMessage}
          disabled={loading || !message.trim()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600"
        >
          {loading ? "Analyzing..." : "Analyze Message"}
        </button>

        {result && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-400">Risk Level</p>
              <h2 className="text-2xl font-bold">{result.riskLevel}</h2>
            </div>

            <div>
              <p className="text-sm text-slate-400">Category</p>
              <p>{result.category}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Confidence</p>
              <p>{Math.round(result.confidence * 100)}%</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Risk Score</p>
              <p className="text-2xl font-bold">{result.riskScore}/100</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Summary</p>
              <p>{result.summary}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Simple Explanation</p>
              <p>{result.userFriendlyExplanation}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Reasons</p>
              <ul className="list-disc list-inside space-y-1">
                {result.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-slate-400">Detected Scam Patterns</p>

              <div className="space-y-3 mt-2">
                {result.detectedPatterns.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-700 bg-slate-950 p-4"
                  >
                    <p className="font-semibold">{item.pattern}</p>
                    <p className="text-slate-300 text-sm mt-1">{item.evidence}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">Safe Action</p>
              <p>{result.safeAction}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Red Flags</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.redFlags.map((flag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-red-900 text-red-100 text-sm"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}