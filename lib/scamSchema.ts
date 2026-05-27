import { z } from "zod";

export const DetectedPatternSchema = z.object({
    pattern: z.enum([
        "URGENCY",
        "FEAR",
        "FAKE_REWARD",
        "AUTHORITY_IMPERSONATION",
        "SENSITIVE_INFO_REQUEST",
        "SUSPICIOUS_LINK",
        "PAYMENT_PRESSURE",
        "EMOTIONAL_MANIPULATION",
        "UNUSUAL_SENDER",
        "NONE"
    ]),
    evidence: z.string()
});

export const ScamAnalysisSchema = z.object({
    riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    category: z.enum([
        "SAFE",
        "SPAM",
        "PHISHING",
        "SCAM",
        "SOCIAL_ENGINEERING",
        "UNKNOWN"
    ]),
    confidence: z.number().min(0).max(1),
    riskScore: z.number().min(0).max(100),
    summary: z.string(),
    detectedPatterns: z.array(DetectedPatternSchema),
    reasons: z.array(z.string()).min(1),
    safeAction: z.string(),
    redFlags: z.array(z.string()),
    userFriendlyExplanation: z.string()
});

export type ScamAnalysis = z.infer<typeof ScamAnalysisSchema>;