import { RiskLevel } from "./hybridTypes";

export function getRiskLevelFromScore(score: number): RiskLevel {
    if (score >= 70) return "high";
    if (score >= 35) return "medium";
    return "low";
}

export function calculateHybridRiskScore(params: {
    ruleScore: number;
    llmScore: number;
    ruleConfidence: number;
    llmConfidence: number;
}) {
    const { ruleScore, llmScore, ruleConfidence, llmConfidence } = params;

    /**
     * Rule engine is reliable for obvious hard signals:
     * OTP, KYC, suspicious links, account blocking, payment request.
     *
     * LLM is better for intent and explanation.
     */
    const weightedScore =
        ruleScore * 0.45 +
        llmScore * 0.45 +
        Math.max(ruleConfidence, llmConfidence) * 10;

    return Math.min(Math.round(weightedScore), 100);
}

export function calculateHybridConfidence(params: {
    ruleConfidence: number;
    llmConfidence: number;
    agreementBoost: number;
}) {
    const { ruleConfidence, llmConfidence, agreementBoost } = params;

    const confidence = ruleConfidence * 0.4 + llmConfidence * 0.5 + agreementBoost;

    return Math.min(Number(confidence.toFixed(2)), 0.98);
}

export function getAgreementBoost(
    ruleRiskLevel: RiskLevel,
    llmRiskLevel: RiskLevel
) {
    if (ruleRiskLevel === llmRiskLevel) return 0.08;

    if (
        (ruleRiskLevel === "high" && llmRiskLevel === "medium") ||
        (ruleRiskLevel === "medium" && llmRiskLevel === "high")
    ) {
        return 0.04;
    }

    return 0;
}
