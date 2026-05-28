import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import { ScamAnalysisSchema } from "@/lib/scamSchema";
import {
    SCAM_ANALYSIS_SYSTEM_PROMPT,
    buildScamUserPrompt,
} from "@/lib/scamPrompt";

function mapCategoryToScamType(category: string) {
    switch (category) {
        case "PHISHING":
            return "phishing";
        case "SCAM":
            return "scam";
        case "SOCIAL_ENGINEERING":
            return "social_engineering";
        case "SPAM":
            return "spam";
        case "SAFE":
            return "none";
        default:
            return "unknown";
    }
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeWithOpenAI(message: string) {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured");
    }

    const start = Date.now();

    const response = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: [
            {
                role: "system",
                content: SCAM_ANALYSIS_SYSTEM_PROMPT,
            },
            {
                role: "user",
                content: buildScamUserPrompt(message),
            },
        ],
        text: {
            format: zodTextFormat(ScamAnalysisSchema, "scam_analysis"),
        },
        temperature: 0.1,
    });

    const parsedResult = response.output_parsed;

    if (!parsedResult) {
        throw new Error("Unable to parse AI response");
    }

    const validatedResult = ScamAnalysisSchema.parse(parsedResult);
    const normalizedRiskLevel =
        validatedResult.riskLevel === "CRITICAL"
            ? "HIGH"
            : validatedResult.riskLevel;

    return {
        approach: "openai_llm" as const,
        ...validatedResult,
        riskLevel: normalizedRiskLevel,
        scamType: mapCategoryToScamType(validatedResult.category),
        metrics: {
            latencyMs: Date.now() - start,
            estimatedCost: 0.001,
            infra: "very_low" as const,
            explainability: "very_high" as const,
            model: "gpt-4o-mini",
        },
    };
}
