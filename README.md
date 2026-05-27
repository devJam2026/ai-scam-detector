# AI-Powered Scam Detection System

A GenAI application that analyzes emails, SMS messages, and chat messages to detect scam, phishing, spam, and social engineering risk.

The system uses an LLM with structured output, schema validation, explainable risk scoring, and a clean user interface.

---

## Features

- Scam, phishing, spam, and social engineering detection
- Risk level classification: LOW, MEDIUM, HIGH, CRITICAL
- Risk score from 0 to 100
- Confidence score
- Detected scam patterns
- Simple user-friendly explanation
- Safe action recommendation
- Red flag extraction
- Structured JSON response
- Zod schema validation
- Test dataset and evaluation script
- Clean Next.js frontend

---

## Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | Next.js, React, TypeScript |
| Styling    | Tailwind CSS               |
| Backend    | Next.js API Route          |
| AI         | OpenAI API                 |
| Validation | Zod                        |
| Testing    | Custom test dataset script |

---

## Architecture

```text
User Message
   ↓
Next.js Frontend
   ↓
POST /api/analyze-scam
   ↓
Input Validation
   ↓
System Prompt + User Prompt
   ↓
OpenAI Structured Output
   ↓
Zod Schema Validation
   ↓
Risk Score + Explanation
   ↓
Frontend Result Card
```
