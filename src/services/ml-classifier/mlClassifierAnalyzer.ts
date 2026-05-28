import { execFile } from "child_process";
import path from "path";
import { promisify } from "util";
import { MlClassifierAnalysisResult } from "./mlClassifierTypes";

const execFileAsync = promisify(execFile);

type RawMlPrediction = {
    error?: string;
    riskLevel?: "low" | "medium" | "high";
    riskScore?: number;
    confidence?: number;
    scamType?: string;
    redFlags?: string[];
    explanation?: string;
    safeAction?: string;
};

function fallbackResult(
    latencyMs: number,
    errorMessage: string
): MlClassifierAnalysisResult {
    return {
        approach: "ml_classifier",
        riskLevel: "medium",
        riskScore: 50,
        confidence: 0,
        scamType: "unknown",
        redFlags: ["ML classifier could not complete prediction"],
        explanation: `ML classifier failed. Error: ${errorMessage}`,
        safeAction:
            "Treat the message cautiously and verify through official channels.",
        metrics: {
            latencyMs,
            estimatedCost: 0,
            infra: "low",
            explainability: "medium",
            model: "TF-IDF + Logistic Regression",
        },
    };
}

function normalizeMlResult(
    raw: RawMlPrediction,
    latencyMs: number
): MlClassifierAnalysisResult {
    return {
        approach: "ml_classifier",
        riskLevel: raw.riskLevel ?? "medium",
        riskScore:
            typeof raw.riskScore === "number"
                ? Math.max(0, Math.min(100, raw.riskScore))
                : 50,
        confidence:
            typeof raw.confidence === "number"
                ? Math.max(0, Math.min(1, raw.confidence))
                : 0,
        scamType: raw.scamType ?? "unknown",
        redFlags: Array.isArray(raw.redFlags) ? raw.redFlags : [],
        explanation:
            raw.explanation ??
            "The ML classifier analyzed the message using learned text patterns.",
        safeAction:
            raw.safeAction ??
            "Verify the sender before clicking links or sharing personal information.",
        metrics: {
            latencyMs,
            estimatedCost: 0,
            infra: "low",
            explainability: "medium",
            model: "TF-IDF + Logistic Regression",
        },
    };
}

export async function analyzeWithMlClassifier(
    message: string
): Promise<MlClassifierAnalysisResult> {
    const start = Date.now();

    if (!message.trim()) {
        return {
            approach: "ml_classifier",
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
                infra: "low",
                explainability: "medium",
                model: "TF-IDF + Logistic Regression",
            },
        };
    }

    try {
        const scriptPath = path.join(process.cwd(), "scripts", "predict-ml-classifier.py");
        const pythonCommand = process.env.PYTHON_PATH || "python";

        const { stdout } = await execFileAsync(pythonCommand, [scriptPath, message], {
            timeout: 10000,
            maxBuffer: 1024 * 1024,
        });

        const raw = JSON.parse(stdout.trim()) as RawMlPrediction;
        const latencyMs = Date.now() - start;

        if (raw.error) {
            return fallbackResult(latencyMs, raw.error);
        }

        return normalizeMlResult(raw, latencyMs);
    } catch (error) {
        const latencyMs = Date.now() - start;
        const errorMessage =
            error instanceof Error ? error.message : "Unknown ML classifier error";

        return fallbackResult(latencyMs, errorMessage);
    }
}
