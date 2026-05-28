# Evaluation Results (Updated)

Overview

- This document explains the lightweight evaluation strategy used by the repo and how to interpret results.

Key points

- Tests verify normalized output shape and reasonable risk labels for curated examples.
- The included `scripts/test-scam-detector.mjs` runner exercises analyzers against `src/data/test-cases.json`.

Practical notes

- AI outputs are non-deterministic; rely on schema validation rather than exact wording.
- Add new test-cases for ambiguous or adversarial messages you encounter.
