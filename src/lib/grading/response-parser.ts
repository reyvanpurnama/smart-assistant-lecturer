import { z } from "zod";
import type { ParsedLLMGrade } from "@/lib/grading/types";

// Schema Zod untuk validasi tiap kriteria aspek rubrik (skor, bobot, masukan, penalaran)
const rubricScoreSchema = z.object({
  aspect: z.string().min(1),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(100),
  feedback: z.string().min(1),
  reasoning: z.string().min(1),
});

// Schema Zod utama untuk validasi struktur JSON lengkap hasil penilaian AI
const llmGradeSchema = z.object({
  holistic: z.object({
    score: z.number().min(0).max(100),
    feedback: z.string().min(1),
  }),
  rubric: z.array(rubricScoreSchema),
  weighted_total: z.number().min(0).max(100),
  global_reasoning: z.string().min(1),
});

// Fungsi pembantu untuk mengekstrak string JSON dari blok teks mentah respons AI
function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    return trimmed;
  }

  // Jika AI membungkus JSON di dalam markdown code block ```json ... ```
  const blockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (blockMatch && blockMatch[1]) {
    return blockMatch[1].trim();
  }

  // Mencari kurung kurawal pembuka { dan penutup } terluar
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  throw new Error("LLM response does not contain a JSON object.");
}

// Fungsi utama parsing keluaran AI: Membaca teks mentah, melakukan pembersihan, dan memvalidasi ke schema Zod
export function parseLLMResponse(raw: string): ParsedLLMGrade {
  const jsonText = extractJsonObject(raw);

  let parsedJson: any;
  try {
    parsedJson = JSON.parse(jsonText);
  } catch {
    throw new Error("LLM response is not valid JSON.");
  }

  // Sanitasi & pra-pemrosesan agar parser tidak mudah gagal jika ada kesalahan format kecil dari AI
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

    // Nilai standar aman jika bidang alasan/umpan balik utama kosong
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

  // Memastikan struktur akhir benar-benar memenuhi skema Zod llmGradeSchema
  const parsed = llmGradeSchema.safeParse(parsedJson);
  if (!parsed.success) {
    throw new Error(`LLM response schema invalid: ${parsed.error.message}`);
  }

  return parsed.data;
}
