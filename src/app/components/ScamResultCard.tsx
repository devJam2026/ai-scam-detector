import { RiskBadge } from "./RiskBadge";
import { RiskMeter } from "./RiskMeter";
import { RuleBasedAnalysisResult } from "@/services/rule-based-analyzer/ruleBasedTypes";
import { LocalLlmAnalysisResult } from "@/services/local-llm-analyzer/localLlmTypes";
import { HybridAnalysisResult } from "@/services/hybrid-engine/hybridTypes";
import { MlClassifierAnalysisResult } from "@/services/ml-classifier/mlClassifierTypes";

type OpenAIScamAnalysis = {
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

export type ScamAnalysis = OpenAIScamAnalysis | RuleBasedAnalysisResult | LocalLlmAnalysisResult | HybridAnalysisResult;

function isRuleBasedResult(result: ScamAnalysis): result is RuleBasedAnalysisResult {
    return (result as RuleBasedAnalysisResult).approach === "rule_based";
}

function isLocalLlmResult(result: ScamAnalysis): result is LocalLlmAnalysisResult {
    return (result as LocalLlmAnalysisResult).approach === "local_llm";
}

function isMlClassifierResult(result: ScamAnalysis): result is MlClassifierAnalysisResult {
    return (result as MlClassifierAnalysisResult).approach === "ml_classifier";
}

function isHybridResult(result: ScamAnalysis): result is HybridAnalysisResult {
    return (result as HybridAnalysisResult).approach === "hybrid";
}

type ScamResultCardProps = {
    result: ScamAnalysis;
};

function formatMetricLabel(value?: string | number) {
    if (value === undefined || value === null || value === "") return "N/A";

    return String(value)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatLatency(value?: number) {
    if (typeof value !== "number") return "N/A";
    return `${value} ms`;
}

function formatCost(value?: number) {
    if (typeof value !== "number") return "N/A";

    if (value === 0) return "₹0";

    return `₹${value}`;
}

export function ScamResultCard({ result }: ScamResultCardProps) {
    const ruleBased = isRuleBasedResult(result);
    const localLlm = isLocalLlmResult(result);
    const mlClassifier = isMlClassifierResult(result);
    const hybrid = isHybridResult(result);
    const approachLabel = ruleBased
        ? "Rule based"
        : mlClassifier
            ? "ML Classifier"
            : localLlm
                ? "Local LLM"
                : hybrid
                    ? "Hybrid"
                    : "OpenAI LLM";
    const categoryLabel = ruleBased
        ? result.scamType.replaceAll("_", " ")
        : mlClassifier || localLlm || hybrid
            ? result.scamType
            : result.category;
    const displayRiskLevel = ruleBased || mlClassifier || localLlm || hybrid ? result.riskLevel.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" : result.riskLevel;
    const summaryText = ruleBased || mlClassifier || localLlm || hybrid ? result.explanation : result.summary;
    const explanationText = ruleBased || mlClassifier || localLlm || hybrid ? result.explanation : result.userFriendlyExplanation;
    const reasons = ruleBased || mlClassifier || localLlm || hybrid ? result.redFlags : result.reasons;
    const patternItems = ruleBased || mlClassifier || localLlm || hybrid
        ? result.redFlags.map((flag) => ({ pattern: flag, evidence: "" }))
        : result.detectedPatterns;
    const metrics = "metrics" in result ? result.metrics : undefined;

    async function copyResult() {
        await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        alert("Result copied to clipboard");
    }

    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Approach: {approachLabel}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">Analysis Result</p>
                    <h2 className="mt-1 text-2xl font-bold">{categoryLabel}</h2>
                </div>

                <RiskBadge riskLevel={displayRiskLevel} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm text-slate-400">Confidence</p>
                    <p className="mt-1 text-3xl font-bold">
                        {Math.round(result.confidence * 100)}%
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <RiskMeter score={result.riskScore} />
                </div>
            </div>

            {metrics && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                        <p className="text-xs text-slate-400">Latency</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                            {formatLatency(metrics.latencyMs)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                        <p className="text-xs text-slate-400">Estimated Cost</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                            {formatCost(metrics.estimatedCost)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                        <p className="text-xs text-slate-400">Infra</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                            {formatMetricLabel(metrics.infra)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                        <p className="text-xs text-slate-400">Explainability</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                            {formatMetricLabel(metrics.explainability)}
                        </p>
                    </div>

                    {"model" in metrics && metrics.model && (
                        <div className="rounded-xl border border-slate-700 bg-slate-950 p-4 sm:col-span-2">
                            <p className="text-xs text-slate-400">Model</p>
                            <p className="mt-1 text-sm font-semibold text-white">
                                {String(metrics.model)}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 space-y-5">
                <div>
                    <p className="text-sm text-slate-400">Summary</p>
                    <p className="mt-1 text-slate-100">{summaryText}</p>
                </div>

                <div>
                    <p className="text-sm text-slate-400">Simple Explanation</p>
                    <p className="mt-1 text-slate-100">{explanationText}</p>
                </div>

                <div>
                    <p className="text-sm text-slate-400">Why It May Be Risky</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-100">
                        {reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="text-sm text-slate-400">Detected Scam Patterns</p>
                    <div className="mt-2 space-y-3">
                        {patternItems.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                            >
                                <p className="font-semibold">{item.pattern}</p>
                                <p className="mt-1 text-sm text-slate-300">{item.evidence}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-blue-900 bg-blue-950/40 p-4">
                    <p className="text-sm text-blue-300">Safe Action</p>
                    <p className="mt-1 text-blue-100">{result.safeAction}</p>
                </div>

                {hybrid && (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <p className="text-sm text-slate-400">Hybrid engine breakdown</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-slate-900 p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">Rule-Based</p>
                                <p className="mt-2 text-sm text-slate-200">Risk: {result.engineBreakdown.ruleBased.riskLevel}</p>
                                <p className="text-sm text-slate-200">Score: {result.engineBreakdown.ruleBased.riskScore}</p>
                                <p className="text-sm text-slate-200">Confidence: {Math.round(result.engineBreakdown.ruleBased.confidence * 100)}%</p>
                            </div>
                            <div className="rounded-xl bg-slate-900 p-3">
                                <p className="text-xs uppercase tracking-wide text-slate-500">LLM</p>
                                <p className="mt-2 text-sm text-slate-200">Risk: {result.engineBreakdown.llm.riskLevel}</p>
                                <p className="text-sm text-slate-200">Score: {result.engineBreakdown.llm.riskScore}</p>
                                <p className="text-sm text-slate-200">Confidence: {Math.round(result.engineBreakdown.llm.confidence * 100)}%</p>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-sm text-slate-400">Red Flags</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {result.redFlags.map((flag, index) => (
                            <span
                                key={index}
                                className="rounded-full border border-red-800 bg-red-950 px-3 py-1 text-sm text-red-100"
                            >
                                {flag}
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    onClick={copyResult}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
                >
                    Copy JSON Result
                </button>
            </div>
        </section>
    );
}