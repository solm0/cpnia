import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from 'zod';

const Formalities = z.enum(["하십시오체", "해요체", "해체"]);
const Verbosities = z.enum(["단답", "평범", "투머치토커"]);
const Warmths = z.enum(["친근한", "중립적인", "적대적인"]);

export async function POST(req: Request) {
  try {
    const { input } = await req.json();
    const { object } = await generateObject({
      model: openai('gpt-5-nano'),
      schema: z.object({
        formality: Formalities,
        verbosity: Verbosities,
        warmth: Warmths,
      }),
      messages: [
        {
          role: "system",
          content: `
            You are a classifier.
            Classify the text into exactly three categories: formality, verbosity, and warmth.
            Use exactly these values:

            Formality: "하십시오체" | "해요체" | "해체"
            Verbosity: "단답" | "평범" | "투머치토커"
            Warmth: "친근한" | "중립적인" | "적대적인"

            Rules:
            - Formality:
              "하십시오체" → ends with "-습니다", "-입니다", '-니다', '-니까", '-시오', '-쇼'.
              "해요체" → ends with "-요", "-용", or "-유".
              "해체" → casual speech.
            - Verbosity:
              ≤4 words → "단답"
              5–15 words → "평범"
              >15 words → "투머치토커"
            - Warmth:
              Friendly → "친근한"
              Neutral → "중립적인"
              Hostile → "적대적인"

            Return result strictly as JSON with keys:
            {
              "formality": "...",
              "verbosity": "...",
              "warmth": "..."
            }
          `
        },
        {
          role: "user",
          content: input
        }
      ]
    });

    return NextResponse.json(object);
  } catch(error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to classify" }, { status: 500 })
  }
}