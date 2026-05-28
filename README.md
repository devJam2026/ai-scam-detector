# AI Scam Detector (Educational)

An educational multi-engine scam detection demo built with Next.js, TypeScript, OpenAI, Zod, and optional local AI/ML paths.

> This project is intended as a learning experiment. It demonstrates how different scam detection approaches compare, but it is not a production-ready fraud detection system.

## Quick summary

- Paste a suspicious SMS/email/chat message in the UI and get a normalized risk report.
- Supported analyzer paths: rule-based, traditional ML, OpenAI LLM (cloud), local LLM (Ollama), and a hybrid compare mode.
- Outputs are validated with Zod and normalized so the frontend can render consistent cards and comparison tables.

## Getting started

Prerequisites:

- Node.js 18+ and npm
- OpenAI API key (for `openai_llm`) — optional for other modes
- Optional: Ollama local server for `local_llm`
- Optional: Python for `ml_classifier`

Clone & install:

```bash
git clone https://github.com/devJam2026/ai-scam-detector.git
cd ai-scam-detector
npm install
```

Copy env example and fill values:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local`:

```text
OPENAI_API_KEY=your_openai_api_key_here
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
PYTHON_PATH=python
```

Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- This repository is educational: do not rely on it for production security decisions.
- The `compare` endpoint runs multiple engines to help evaluate disagreement and consensus across techniques.

## Files of interest

- `src/app/api/analyze-scam/route.ts` — main analysis API
- `src/app/api/analyze-scam/compare/route.ts` — multi-engine compare API
- `src/lib/scamSchema.ts` — Zod schema for structured AI output
- `src/services/*` — analyzer implementations
- `scripts/test-scam-detector.mjs` — small evaluation runner

If you'd like, I can replace the main README and overwrite the docs in-place with these revisions now.
