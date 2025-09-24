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
      prompt: `
        You are a classifier. 
        Given the following immigration interview answers, classify the Korean text into exactly three categories.

        The output MUST strictly use these exact values (copy-paste from here):

        Formality: "하십시오체" | "해요체" | "해체"
        Verbosity: "단답" | "평범" | "투머치토커"
        Warmth: "친근한" | "중립적인" | "적대적인"

        Rules for Formality:
        - Use "하십시오체" only if the text uses ends with "-습니다", "-입니다", '-니다', '-니까", '-시오', '-쇼'.
        - Use "해요체" if the text ends with "-요", "-용", or "-유".
        - Use "해체" for casual speech.

        Special rules for Verbosity:
        - If the answer has 4 words or fewer → "단답"
        - If the answer has 5–15 words → "평범"
        - If the answer has more than 15 words → "투머치토커"

        Rules for Warmth:
        - "친근한" for friendly tone
        - "중립적인" for neutral tone
        - "적대적인" for hostile tone

        Return the result as **JSON** with keys exactly:
        {
          "formality": "...",
          "verbosity": "...",
          "warmth": "..."
        }

        Answers: ${input}
      `
    });

    return NextResponse.json(object);
  } catch(error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to classify" }, { status: 500 })
  }
}