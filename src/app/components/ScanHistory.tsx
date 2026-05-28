import { ScamAnalysis } from "./ScamResultCard";
import { RiskBadge } from "./RiskBadge";

type ScanHistoryItem = {
    id: string;
    message: string;
    result: ScamAnalysis;
};

type ScanHistoryProps = {
    history: ScanHistoryItem[];
    onSelect: (item: ScanHistoryItem) => void;
};

export function ScanHistory({ history, onSelect }: ScanHistoryProps) {
    if (history.length === 0) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-lg font-semibold">Recent Scans</h2>
            <p className="mt-1 text-sm text-slate-400">
                Stored only in your browser during this session.
            </p>

            <div className="mt-4 space-y-3">
                {history.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-left hover:border-blue-500"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="line-clamp-1 text-sm text-slate-300">
                                {item.message}
                            </p>
                            <RiskBadge riskLevel={item.result.riskLevel} />
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                            {item.result.category} • Score {item.result.riskScore}/100
                        </p>
                    </button>
                ))}
            </div>
        </section>
    );
}