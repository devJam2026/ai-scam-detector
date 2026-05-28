export type RiskLevel = "low" | "medium" | "high";

export type MlClassifierAnalysisResult = {
    approach: "ml_classifier";
    riskLevel: RiskLevel;
    riskScore: number;
    confidence: number;
    scamType: string;
    redFlags: string[];
    explanation: string;
    safeAction: string;
    metrics: {
        latencyMs: number;
        estimatedCost: number;
        infra: "low";
        explainability: "medium";
        model: string;
    };
};
