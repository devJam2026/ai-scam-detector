import { NextRequest, NextResponse } from "next/server";
import { analyzeRuleBased } from "@/services/rule-based-analyzer/ruleBasedAnalyzer";
import { analyzeWithLocalLlm } from "@/services/local-llm-analyzer/localLlmAnalyzer";
import { analyzeWithOpenAI } from "@/services/openai-llm-analyzer/openAiAnalyzer";
import { analyzeHybrid } from "@/services/hybrid-engine/hybridAnalyzer";
import { analyzeWithMlClassifier } from "@/services/ml-classifier/mlClassifierAnalyzer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const message = body.message;
        const approach = body.approach || "openai_llm";

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        if (approach === "rule_based") {
            return NextResponse.json(analyzeRuleBased(message));
        }

        if (approach === "ml_classifier") {
            return NextResponse.json(await analyzeWithMlClassifier(message));
        }

        if (approach === "local_llm") {
            return NextResponse.json(await analyzeWithLocalLlm(message));
        }

        if (approach === "hybrid") {
            return NextResponse.json(await analyzeHybrid(message));
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        if (message.trim().length < 5) {
            return NextResponse.json(
                { error: "Message is too short to analyze" },
                { status: 400 }
            );
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { error: "Message is too long. Please keep it under 5000 characters." },
                { status: 400 }
            );
        }

        return NextResponse.json(await analyzeWithOpenAI(message));
    } catch (error) {
        console.error("Scam analysis error:", error);

        return NextResponse.json(
            {
                error: "Failed to analyze message"
            },
            { status: 500 }
        );
    }
}