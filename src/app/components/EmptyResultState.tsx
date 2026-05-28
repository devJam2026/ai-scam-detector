export default function EmptyResultState() {
    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/30 bg-blue-500/10">
                    <span className="text-3xl">🛡️</span>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-300">
                    Awaiting Analysis
                </p>

                <h2 className="mt-3 text-2xl font-bold text-white">
                    Choose an approach and analyze a message
                </h2>

                <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                    Compare rule-based logic, traditional ML, OpenAI LLM, local LLM, and
                    hybrid detection on the same suspicious message.
                </p>

                <div className="mt-8 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-5">
                    {['Rules', 'ML', 'OpenAI', 'Local', 'Hybrid'].map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-4 text-sm font-semibold text-slate-300"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
