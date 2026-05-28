export type RiskLevel = "low" | "medium" | "high";

export type ScamType =
    | "none"
    | "phishing"
    | "kyc_phishing"
    | "credential_theft"
    | "fake_reward"
    | "advance_fee_fraud"
    | "impersonation"
    | "identity_theft"
    | "social_engineering";

export type RuleBasedMatch = {
    id: string;
    label: string;
    scamType: ScamType;
    weight: number;
};

export type RuleBasedAnalysisResult = {
    approach: "rule_based";
    riskLevel: RiskLevel;
    riskScore: number;
    confidence: number;
    scamType: ScamType;
    redFlags: string[];
    explanation: string;
    safeAction: string;
    metrics: {
        latencyMs: number;
        estimatedCost: number;
        infra: "very_low";
        explainability: "high";
    };
};
