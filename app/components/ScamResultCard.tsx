import { RiskBadge } from "./RiskBadge";
import { RiskMeter } from "./RiskMeter";

export type ScamAnalysis = {
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

type ScamResultCardProps = {
    result: ScamAnalysis;
};

export function ScamResultCard({ result }: ScamResultCardProps) {
    async function copyResult() {
        await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        alert("Result copied to clipboard");
    }

    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                    <p className="text-sm text-slate-400">Analysis Result</p>
                    <h2 className="mt-1 text-2xl font-bold">{result.category}</h2>
                </div>

                <RiskBadge riskLevel={result.riskLevel} />
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

            <div className="mt-6 space-y-5">
                <div>
                    <p className="text-sm text-slate-400">Summary</p>
                    <p className="mt-1 text-slate-100">{result.summary}</p>
                </div>

                <div>
                    <p className="text-sm text-slate-400">Simple Explanation</p>
                    <p className="mt-1 text-slate-100">
                        {result.userFriendlyExplanation}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-slate-400">Why It May Be Risky</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-100">
                        {result.reasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="text-sm text-slate-400">Detected Scam Patterns</p>

                    <div className="mt-2 space-y-3">
                        {result.detectedPatterns.map((item, index) => (
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