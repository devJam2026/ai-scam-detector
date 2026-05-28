import {
    LocalLlmAnalysisResult,
    OllamaGenerateResponse,
    RiskLevel,
} from "./localLlmTypes";
import { buildLocalLlmScamPrompt } from "./localLlmPrompt";

type RawLocalLlmResult = {
    riskLevel?: string;
    riskScore?: number;
    confidence?: number;
    scamType?: string;
    redFlags?: string[];
    explanation?: string;
    safeAction?: string;
};

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
    if (typeof value !== "number" || Number.isNaN(value)) return fallback;
    return Math.max(min, Math.min(max, value));
}

function normalizeRiskLevel(value: unknown): RiskLevel {
    if (value === "high" || value === "medium" || value === "low") {
        return value;
    }

    return "medium";
}

function extractJson(text: string): RawLocalLlmResult {
    try {
        return JSON.parse(text);
    } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("Local LLM did not return JSON");
        }

        return JSON.parse(jsonMatch[0]);
    }
}

function fallbackResult(
    message: string,
    latencyMs: number,
    model: string,
    errorMessage: string
): LocalLlmAnalysisResult {
    return {
        approach: "local_llm",
        riskLevel: "medium",
        riskScore: 50,
        confidence: 0.4,
        scamType: "unknown",
        redFlags: ["Local LLM response could not be parsed reliably"],
        explanation: `The local model could not produce a valid structured result. Error: ${errorMessage}`,
        safeAction:
            "Treat this message cautiously and verify through official channels before clicking links or sharing information.",
        metrics: {
            latencyMs,
            estimatedCost: 0,
            infra: "medium",
            explainability: "high",
            model,
        },
    };
}

function normalizeLocalLlmResult(
    raw: RawLocalLlmResult,
    latencyMs: number,
    model: string
): LocalLlmAnalysisResult {
    const riskLevel = normalizeRiskLevel(raw.riskLevel);
    const riskScore = clampNumber(raw.riskScore, 0, 100, 50);
    const confidence = clampNumber(raw.confidence, 0, 1, 0.5);

    return {
        approach: "local_llm",
        riskLevel,
        riskScore,
        confidence,
        scamType:
            typeof raw.scamType === "string" && raw.scamType.trim()
                ? raw.scamType
                : "unknown",
        redFlags: Array.isArray(raw.redFlags)
            ? raw.redFlags.filter((item) => typeof item === "string")
            : [],
        explanation:
            typeof raw.explanation === "string" && raw.explanation.trim()
                ? raw.explanation
                : "The local LLM analyzed the message but did not provide a detailed explanation.",
        safeAction:
            typeof raw.safeAction === "string" && raw.safeAction.trim()
                ? raw.safeAction
                : "Verify the sender through official channels before taking action.",
        metrics: {
            latencyMs,
            estimatedCost: 0,
            infra: "medium",
            explainability: "high",
            model,
        },
    };
}

export async function analyzeWithLocalLlm(
    message: string
): Promise<LocalLlmAnalysisResult> {
    const start = Date.now();

    const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "llama3.2";

    if (!message.trim()) {
        return {
            approach: "local_llm",
            riskLevel: "low",
            riskScore: 0,
            confidence: 0,
            scamType: "none",
            redFlags: [],
            explanation: "No message was provided for analysis.",
            safeAction: "Please enter a message to analyze.",
            metrics: {
                latencyMs: Date.now() - start,
                estimatedCost: 0,
                infra: "medium",
                explainability: "high",
                model,
            },
        };
    }

    try {
        const response = await fetch(`${baseUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model,
                prompt: buildLocalLlmScamPrompt(message),
                stream: false,
                options: {
                    temperature: 0.1,
                    top_p: 0.9,
                },
            }),
        });

        const latencyMs = Date.now() - start;

        if (!response.ok) {
            throw new Error(
                `Ollama request failed with status ${response.status}: ${response.statusText}`
            );
        }

        const data = (await response.json()) as OllamaGenerateResponse;
        const rawResult = extractJson(data.response);

        return normalizeLocalLlmResult(rawResult, latencyMs, model);
    } catch (error) {
        const latencyMs = Date.now() - start;
        const message =
            error instanceof Error ? error.message : "Unknown local LLM error";

        return fallbackResult("", latencyMs, model, message);
    }
}
