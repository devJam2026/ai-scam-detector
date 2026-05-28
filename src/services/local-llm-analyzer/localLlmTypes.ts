export type RiskLevel = "low" | "medium" | "high";

export type LocalLlmAnalysisResult = {
    approach: "local_llm";
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
        infra: "medium";
        explainability: "high";
        model: string;
    };
};

export type OllamaGenerateResponse = {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
};
