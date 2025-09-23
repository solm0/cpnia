import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import test from "@/app/lib/data/prompts/test";

// const Emotions = z.enum(["행복", "우울", "냉소", "화남"]);
// const Warmths = z.enum(["친근한", "중립적인", "적대적인"]);
// const Verbosities = z.enum(["단답", "평범", "투머치토커"]);
// const Formalities = z.enum(["하십시오체", "하게체", "해라체", "해요체", "해체"]);

// const VariationSchema = z.object({
//   formality: Formalities,
//   verbosity: Verbosities,
//   warmth: Warmths,
//   emotion: Emotions,
//   text: z.string()
// });

// // 180 variations array
// export const NPCVariationsSchema = z.object({
//   name: z.string(),
//   world: z.string(),
//   baseline: z.string(),
//   variations: z.array(VariationSchema) // 180 elements
// });

export async function GET() {
  const prompt = JSON.stringify(test());

  try {
    const { text } = await generateText({
      model: openai("gpt-5-nano"),
      // system: "Always include a key 'variations' with an array of variation objects according to the schema, even if empty. baseline과 thoughts를 우선적으로 반영하고, transformation_guide를 적용해 4개의 변주를 생성하라. ideology는 참고용으로만 활용하고 과도하게 포함하지 말 것.",
      prompt: prompt,
    });

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch(err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}