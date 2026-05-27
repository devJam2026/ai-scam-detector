type RiskMeterProps = {
    score: number;
};

export function RiskMeter({ score }: RiskMeterProps) {
    function getLabel() {
        if (score < 30) return "Low Risk";
        if (score < 60) return "Medium Risk";
        if (score < 85) return "High Risk";
        return "Critical Risk";
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Risk Score</p>
                <p className="font-bold">{score}/100</p>
            </div>

            <div className="h-3 w-full rounded-full bg-slate-800">
                <div
                    className="h-3 rounded-full bg-white"
                    style={{ width: `${score}%` }}
                />
            </div>

            <p className="text-sm text-slate-300">{getLabel()}</p>
        </div>
    );
}