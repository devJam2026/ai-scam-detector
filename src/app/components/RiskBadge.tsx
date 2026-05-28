type RiskBadgeProps = {
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export function RiskBadge({ riskLevel }: RiskBadgeProps) {
    const riskClassMap = {
        LOW: "bg-green-950 text-green-200 border-green-800",
        MEDIUM: "bg-yellow-950 text-yellow-200 border-yellow-800",
        HIGH: "bg-orange-950 text-orange-200 border-orange-800",
        CRITICAL: "bg-red-950 text-red-200 border-red-800"
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-bold ${riskClassMap[riskLevel]}`}
        >
            {riskLevel}
        </span>
    );
}