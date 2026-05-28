# OpenAI LLM Approach (Updated)

Overview

- Uses OpenAI cloud API to generate structured analysis for suspicious messages.
- Implemented in: `src/services/openai-llm-analyzer/openAiAnalyzer.ts`.
- Returns JSON validated by Zod and normalized for the UI.

Key points

- Best for complex contextual understanding and subtle scam signals.
- Requires `OPENAI_API_KEY` set in `.env.local`.
- Consider pinning model versions and adding retry/backoff logic.

Learning outcomes

- Prompt design for structured output
- Schema-based parsing with Zod
- Normalizing AI fields to match other analyzers

Practical ideas

- Cache identical prompt results
- Add telemetry for token usage and latency
- Pin model to a stable version for reproducibility
