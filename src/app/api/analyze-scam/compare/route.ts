import { NextRequest, NextResponse } from "next/server";
import { analyzeRuleBased } from "@/services/rule-based-analyzer/ruleBasedAnalyzer";
import { analyzeWithMlClassifier } from "@/services/ml-classifier/mlClassifierAnalyzer";
import { analyzeWithOpenAI } from "@/services/openai-llm-analyzer/openAiAnalyzer";
import { analyzeWithLocalLlm } from "@/services/local-llm-analyzer/localLlmAnalyzer";
import { analyzeHybrid } from "@/services/hybrid-engine/hybridAnalyzer";

function getCostRank(estimatedCost: number) {
    if (estimatedCost === 0) return "best";
    if (estimatedCost <= 0.001) return "good";
    return "medium";
}

function getLatencyRank(latencyMs: number) {
    if (latencyMs <= 100) return "best";
    if (latencyMs <= 1500) return "good";
    return "slow";
}

function getOverallRecommendation(results: any[]) {
    const hybrid = results.find((item) => item.approach === "hybrid");

    if (hybrid) {
        return {
            bestOverall: "hybrid",
            reason:
                "Hybrid gives the best balance because it combines deterministic rule signals with LLM reasoning, validation, scoring control, and explainability.",
        };
    }

    return {
        bestOverall: results[0]?.approach ?? "unknown",
        reason: "Recommendation is based on available analyzer results.",
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message = body.message;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        const startedAt = Date.now();

        const settledResults = await Promise.allSettled([
            Promise.resolve(analyzeRuleBased(message)),
            analyzeWithMlClassifier(message),
            analyzeWithOpenAI(message),
            analyzeWithLocalLlm(message),
            analyzeHybrid(message),
        ]);

        const approachMap = [
            "rule_based",
            "ml_classifier",
            "openai_llm",
            "local_llm",
            "hybrid",
        ];

        const results = settledResults.map((result, index) => {
            if (result.status === "fulfilled") {
                const value = result.value;

                return {
                    ...value,
                    efficiency: {
                        costRank: getCostRank(value.metrics?.estimatedCost ?? 0),
                        latencyRank: getLatencyRank(value.metrics?.latencyMs ?? 0),
                    },
                };
            }

            return {
                approach: approachMap[index],
                riskLevel: "medium",
                riskScore: 50,
                confidence: 0,
                scamType: "unknown",
                redFlags: ["Analyzer failed"],
                explanation:
                    result.reason instanceof Error
                        ? result.reason.message
                        : "Analyzer failed unexpectedly.",
                safeAction:
                    "Treat the message cautiously and verify through official channels.",
                metrics: {
                    latencyMs: 0,
                    estimatedCost: 0,
                    infra: "unknown",
                    explainability: "unknown",
                },
                efficiency: {
                    costRank: "unknown",
                    latencyRank: "unknown",
                },
            };
        });

        const fastest = [...results].sort(
            (a, b) =>
                (a.metrics?.latencyMs ?? Number.MAX_SAFE_INTEGER) -
                (b.metrics?.latencyMs ?? Number.MAX_SAFE_INTEGER)
        )[0];

        const cheapest = [...results].sort(
            (a, b) =>
                (a.metrics?.estimatedCost ?? Number.MAX_SAFE_INTEGER) -
                (b.metrics?.estimatedCost ?? Number.MAX_SAFE_INTEGER)
        )[0];

        const recommendation = getOverallRecommendation(results);

        return NextResponse.json({
            message,
            totalLatencyMs: Date.now() - startedAt,
            results,
            summary: {
                fastest: fastest?.approach ?? "unknown",
                cheapest: cheapest?.approach ?? "unknown",
                bestExplanation: "openai_llm",
                bestOverall: recommendation.bestOverall,
                recommendation: recommendation.reason,
            },
        });
    } catch (error) {
        console.error("Compare analysis failed:", error);

        return NextResponse.json(
            { error: "Failed to compare scam detection approaches" },
            { status: 500 }
        );
    }
}
