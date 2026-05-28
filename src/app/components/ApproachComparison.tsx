type ApproachComparisonProps = {
    compareResult: {
        results: Array<{
            approach: string;
            riskLevel: string;
            riskScore: number;
            confidence: number;
            metrics?: {
                latencyMs?: number;
                estimatedCost?: number;
                infra?: string;
                explainability?: string;
            };
        }>;
        summary?: {
            fastest?: string;
            cheapest?: string;
            bestOverall?: string;
            bestExplanation?: string;
            recommendation?: string;
        };
    };
};

function formatApproach(value: string) {
    return value
        ? value
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())
        : "Unknown";
}

function getRiskClass(risk: string) {
    if (risk === "high") {
        return "bg-red-500/10 text-red-300 border-red-500/30";
    }

    if (risk === "medium") {
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
    }

    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
}

export default function ApproachComparison({ compareResult }: ApproachComparisonProps) {
    if (!compareResult?.results?.length) return null;

    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-blue-300">
                    Compare All Approaches
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                    Approach Comparison
                </h2>
                <p className="mt-2 text-slate-400">
                    The same message analyzed by rule-based logic, traditional ML, OpenAI LLM, local LLM, and the hybrid engine.
                </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm text-slate-300">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                            <th className="px-4 py-4">Approach</th>
                            <th className="px-4 py-4">Risk</th>
                            <th className="px-4 py-4">Score</th>
                            <th className="px-4 py-4">Confidence</th>
                            <th className="px-4 py-4">Latency</th>
                            <th className="px-4 py-4">Cost</th>
                            <th className="px-4 py-4">Infra</th>
                            <th className="px-4 py-4">Explainability</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compareResult.results.map((item) => (
                            <tr key={item.approach} className="border-b border-slate-800 last:border-0">
                                <td className="px-4 py-4 font-medium text-white">
                                    {formatApproach(item.approach)}
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold uppercase ${getRiskClass(item.riskLevel)}`}>
                                        {item.riskLevel}
                                    </span>
                                </td>
                                <td className="px-4 py-4">{item.riskScore}</td>
                                <td className="px-4 py-4">{Math.round((item.confidence ?? 0) * 100)}%</td>
                                <td className="px-4 py-4">{item.metrics?.latencyMs ?? 0} ms</td>
                                <td className="px-4 py-4">₹{item.metrics?.estimatedCost ?? 0}</td>
                                <td className="px-4 py-4 capitalize">{String(item.metrics?.infra ?? "-").replaceAll("_", " ")}</td>
                                <td className="px-4 py-4 capitalize">{String(item.metrics?.explainability ?? "-").replaceAll("_", " ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {compareResult.summary && (
                <div className="mt-6 grid gap-4 sm:grid-cols-4">
                    {[
                        ["Fastest", compareResult.summary.fastest],
                        ["Cheapest", compareResult.summary.cheapest],
                        ["Best Overall", compareResult.summary.bestOverall],
                        ["Best Explanation", compareResult.summary.bestExplanation],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                            <p className="mt-2 text-base font-semibold text-white">{formatApproach(String(value ?? "unknown"))}</p>
                        </div>
                    ))}
                </div>
            )}

            {compareResult.summary?.recommendation && (
                <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
                    <p className="font-semibold text-white">Recommendation</p>
                    <p className="mt-2 text-slate-300">{compareResult.summary.recommendation}</p>
                </div>
            )}
        </section>
    );
}
