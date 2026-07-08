import { z } from "zod";
import type { ParsedLLMGrade } from "@/lib/grading/types";

const rubricScoreSchema = z.object({
  aspect: z.string().min(1),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(100),
  feedback: z.string().min(1),
  reasoning: z.string().min(1),
});

const llmGradeSchema = z.object({
  holistic: z.object({
    score: z.number().min(0).max(100),
    feedback: z.string().min(1),
  }),
  rubric: z.array(rubricScoreSchema),
  weighted_total: z.number().min(0).max(100),
  global_reasoning: z.string().min(1),
});

function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  const blockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (blockMatch && blockMatch[1]) {
    return blockMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("LLM response does not contain a JSON object.");
}

export function parseLLMResponse(raw: string): ParsedLLMGrade {
  const jsonText = extractJsonObject(raw);

  let parsedJson: any;
  try {
    parsedJson = JSON.parse(jsonText);
  } catch {
    throw new Error("LLM response is not valid JSON.");
  }

  // Pre-process and sanitize to make the parser resilient against model formatting slips
  if (parsedJson && typeof parsedJson === "object") {
    const rawRubrics = parsedJson.rubric;
    const validRubrics: any[] = [];
    if (Array.isArray(rawRubrics)) {
      for (const item of rawRubrics) {
        if (item && typeof item === "object") {
          const parsedItem = rubricScoreSchema.safeParse(item);
          if (parsedItem.success) {
            validRubrics.push(parsedItem.data);
          } else {
            console.warn("Ignoring invalid rubric item:", item, parsedItem.error);
          }
        } else {
          console.warn("Ignoring non-object rubric item:", item);
        }
      }
    }
    parsedJson.rubric = validRubrics;

    // Fallbacks for missing/malformed root fields
    if (!parsedJson.global_reasoning || typeof parsedJson.global_reasoning !== "string") {
      parsedJson.global_reasoning = parsedJson.holistic?.feedback || "Evaluasi otomatis selesai.";
    }
    if (!parsedJson.holistic || typeof parsedJson.holistic !== "object") {
      parsedJson.holistic = { score: 70, feedback: "Evaluasi selesai." };
    } else {
      if (typeof parsedJson.holistic.score !== "number") {
        parsedJson.holistic.score = Number(parsedJson.holistic.score) || 70;
      }
      if (typeof parsedJson.holistic.feedback !== "string") {
        parsedJson.holistic.feedback = "Evaluasi selesai.";
      }
    }
    if (typeof parsedJson.weighted_total !== "number") {
      parsedJson.weighted_total = Number(parsedJson.weighted_total) || 0;
    }
  }

  const parsed = llmGradeSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error(`LLM response schema invalid: ${parsed.error.message}`);
  }

  return parsed.data;
}
