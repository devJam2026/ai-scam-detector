type AnalysisLoaderProps = {
    isVisible: boolean;
    mode: "analyze" | "compare";
};

export default function AnalysisLoader({ isVisible, mode }: AnalysisLoaderProps) {
    if (!isVisible) return null;

    const title =
        mode === "compare"
            ? "Comparing all detection approaches..."
            : "Analyzing message...";

    const subtitle =
        mode === "compare"
            ? "Running rule-based, ML, OpenAI LLM, local LLM, and hybrid engines."
            : "Checking scam signals, risk patterns, and explanation quality.";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md">
            <div className="w-[90%] max-w-md rounded-3xl border border-slate-700 bg-slate-900/95 p-8 text-center shadow-2xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
                    GenAI Security Lab
                </p>

                <h2 className="mt-3 text-xl font-bold text-white">{title}</h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">{subtitle}</p>

                <div className="mt-6 grid grid-cols-3 gap-2 text-xs text-slate-400">
                    <div className="rounded-xl bg-slate-800 px-3 py-2">Risk</div>
                    <div className="rounded-xl bg-slate-800 px-3 py-2">Latency</div>
                    <div className="rounded-xl bg-slate-800 px-3 py-2">Cost</div>
                </div>
            </div>
        </div>
    );
}
