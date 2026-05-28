import { RULE_BASED_SCAM_RULES } from "./ruleBasedRules";
import {
  RiskLevel,
  RuleBasedAnalysisResult,
  RuleBasedMatch,
  ScamType,
} from "./ruleBasedTypes";

function getRiskLevel(score: number): RiskLevel {
  if (score >= 70) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function getConfidence(score: number): number {
  if (score >= 90) return 0.95;
  if (score >= 70) return 0.88;
  if (score >= 50) return 0.75;
  if (score >= 35) return 0.62;
  return 0.35;
}

function getSafeAction(riskLevel: RiskLevel): string {
  if (riskLevel === "high") {
    return "Do not click any link, share OTP, password, PIN, CVV, or personal details. Contact the official organization through verified channels.";
  }

  if (riskLevel === "medium") {
    return "Be cautious. Verify the sender, avoid clicking links, and do not share sensitive information until confirmed.";
  }

  return "No strong scam indicators were found, but verify unexpected messages before taking action.";
}

function getExplanation(redFlags: string[], riskLevel: RiskLevel): string {
  if (redFlags.length === 0) {
    return "This message does not match the current rule-based scam patterns.";
  }

  return `This message is marked as ${riskLevel} risk because it contains signals such as: ${redFlags.join(", ")}.`;
}

function getMostLikelyScamType(matches: RuleBasedMatch[]): ScamType {
  if (matches.length === 0) return "none";

  const scoreByType = matches.reduce<Record<string, number>>((acc, match) => {
    acc[match.scamType] = (acc[match.scamType] || 0) + match.weight;
    return acc;
  }, {});

  const [topType] = Object.entries(scoreByType).sort((a, b) => b[1] - a[1])[0];

  return topType as ScamType;
}

export function analyzeRuleBased(message: string): RuleBasedAnalysisResult {
  const start = Date.now();
  const normalizedMessage = message.trim();

  if (!normalizedMessage) {
    return {
      approach: "rule_based",
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
        infra: "very_low",
        explainability: "high",
      },
    };
  }

  const matches: RuleBasedMatch[] = [];

  for (const rule of RULE_BASED_SCAM_RULES) {
    const matched = rule.patterns.some((pattern) =>
      pattern.test(normalizedMessage)
    );

    if (matched) {
      matches.push({
        id: rule.id,
        label: rule.label,
        scamType: rule.scamType,
        weight: rule.weight,
      });
    }
  }

  const rawScore = matches.reduce((sum, match) => sum + match.weight, 0);
  const riskScore = Math.min(rawScore, 100);
  const riskLevel = getRiskLevel(riskScore);
  const redFlags = matches.map((match) => match.label);
  const scamType = getMostLikelyScamType(matches);

  return {
    approach: "rule_based",
    riskLevel,
    riskScore,
    confidence: getConfidence(riskScore),
    scamType,
    redFlags,
    explanation: getExplanation(redFlags, riskLevel),
    safeAction: getSafeAction(riskLevel),
    metrics: {
      latencyMs: Date.now() - start,
      estimatedCost: 0,
      infra: "very_low",
      explainability: "high",
    },
  };
}
