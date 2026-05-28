export type RiskLevel = "low" | "medium" | "high";

export type HybridAnalysisResult = {
    approach: "hybrid";
    riskLevel: RiskLevel;
    riskScore: number;
    confidence: number;
    scamType: string;
    redFlags: string[];
    explanation: string;
    safeAction: string;
    engineBreakdown: {
        ruleBased: {
            riskLevel: RiskLevel;
            riskScore: number;
            confidence: number;
            redFlags: string[];
        };
        llm: {
            riskLevel: RiskLevel;
            riskScore: number;
            confidence: number;
            redFlags: string[];
        };
    };
    metrics: {
        latencyMs: number;
        estimatedCost: number;
        infra: "medium";
        explainability: "very_high";
    };
};
