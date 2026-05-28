import { analyzeRuleBased } from "@/services/rule-based-analyzer/ruleBasedAnalyzer";
import { analyzeWithOpenAI } from "@/services/openai-llm-analyzer/openAiAnalyzer";
import { HybridAnalysisResult, RiskLevel } from "./hybridTypes";
import {
    calculateHybridConfidence,
    calculateHybridRiskScore,
    getAgreementBoost,
    getRiskLevelFromScore,
} from "./hybridScoring";

function uniqueItems(items: string[]) {
    return Array.from(new Set(items.filter(Boolean)));
}

function mapLlmRiskLevel(value: string): RiskLevel {
    const normalized = value.toLowerCase();

    if (normalized === "high" || normalized === "medium" || normalized === "low") {
        return normalized as RiskLevel;
    }

    if (normalized === "critical") {
        return "high";
    }

    return "medium";
}

function getHybridSafeAction(riskLevel: RiskLevel) {
    if (riskLevel === "high") {
        return "Do not click links, share OTP, password, PIN, CVV, or personal details. Verify directly through the official website, app, or customer care number.";
    }

    if (riskLevel === "medium") {
        return "Treat this message carefully. Verify the sender and avoid clicking links or sharing sensitive information until confirmed.";
    }

    return "No strong scam indicators were found, but verify unexpected messages before taking action.";
}

export async function analyzeHybrid(message: string): Promise<HybridAnalysisResult> {
    const start = Date.now();

    const ruleResult = analyzeRuleBased(message);
    const llmResult = await analyzeWithOpenAI(message);

    const ruleRiskLevel = ruleResult.riskLevel;
    const llmRiskLevel = mapLlmRiskLevel(llmResult.riskLevel);

    const agreementBoost = getAgreementBoost(ruleRiskLevel, llmRiskLevel);

    const riskScore = calculateHybridRiskScore({
        ruleScore: ruleResult.riskScore,
        llmScore: llmResult.riskScore,
        ruleConfidence: ruleResult.confidence,
        llmConfidence: llmResult.confidence,
    });

    const riskLevel = getRiskLevelFromScore(riskScore);

    const confidence = calculateHybridConfidence({
        ruleConfidence: ruleResult.confidence,
        llmConfidence: llmResult.confidence,
        agreementBoost,
    });

    const redFlags = uniqueItems([
        ...(ruleResult.redFlags || []),
        ...(llmResult.redFlags || []),
    ]);

    return {
        approach: "hybrid",
        riskLevel,
        riskScore,
        confidence,
        scamType:
            llmResult.scamType && llmResult.scamType !== "none"
                ? llmResult.scamType
                : ruleResult.scamType,
        redFlags,
        explanation: `Hybrid analysis combined deterministic fraud rules with LLM reasoning. Rule engine classified this as ${ruleResult.riskLevel} risk, while LLM classified it as ${llmRiskLevel} risk. Final decision: ${riskLevel} risk.`,
        safeAction: getHybridSafeAction(riskLevel),
        engineBreakdown: {
            ruleBased: {
                riskLevel: ruleResult.riskLevel,
                riskScore: ruleResult.riskScore,
                confidence: ruleResult.confidence,
                redFlags: ruleResult.redFlags,
            },
            llm: {
                riskLevel: llmRiskLevel,
                riskScore: llmResult.riskScore,
                confidence: llmResult.confidence,
                redFlags: llmResult.redFlags,
            },
        },
        metrics: {
            latencyMs: Date.now() - start,
            estimatedCost: llmResult.metrics?.estimatedCost ?? 0,
            infra: "medium",
            explainability: "very_high",
        },
    };
}
