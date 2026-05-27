import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";

import {
    ScamAnalysisSchema
} from "@/lib/scamSchema";

import {
    SCAM_ANALYSIS_SYSTEM_PROMPT,
    buildScamUserPrompt
} from "@/lib/scamPrompt";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        const body = await req.json();
        const message = body.message;

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        if (message.trim().length < 5) {
            return NextResponse.json(
                { error: "Message is too short to analyze" },
                { status: 400 }
            );
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { error: "Message is too long. Please keep it under 5000 characters." },
                { status: 400 }
            );
        }

        const response = await openai.responses.parse({
            model: "gpt-4o-mini",
            input: [
                {
                    role: "system",
                    content: SCAM_ANALYSIS_SYSTEM_PROMPT
                },
                {
                    role: "user",
                    content: buildScamUserPrompt(message)
                }
            ],
            text: {
                format: zodTextFormat(ScamAnalysisSchema, "scam_analysis")
            },
            temperature: 0.1
        });

        const parsedResult = response.output_parsed;

        if (!parsedResult) {
            return NextResponse.json(
                { error: "Unable to parse AI response" },
                { status: 500 }
            );
        }

        const validatedResult = ScamAnalysisSchema.parse(parsedResult);

        return NextResponse.json(validatedResult);
    } catch (error) {
        console.error("Scam analysis error:", error);

        return NextResponse.json(
            {
                error: "Failed to analyze message"
            },
            { status: 500 }
        );
    }
}