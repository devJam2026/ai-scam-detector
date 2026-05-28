# Hybrid Approach (Updated)

Overview

- The hybrid path runs multiple analyzers and normalizes their outputs for side-by-side comparison.
- Implemented in: `src/services/hybrid-engine/hybridAnalyzer.ts` and the compare API.

Key points

- Useful for evaluations, not a production routing solution in this repo.
- Shows disagreement and consensus between rule-based heuristics, ML, local LLMs, and OpenAI.

Learning outcomes

- Normalizing outputs from heterogeneous analyzers
- Designing comparison UIs that surface disagreements and confidence

Practical ideas

- Add weighted voting or confidence-based routing
- Store per-analyzer telemetry for offline analysis
- Create summaries that explain why engines disagree
