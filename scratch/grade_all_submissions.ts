import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { composeGradingPrompt } from "../src/lib/grading/prompt-composer";
import { getLLMProvider } from "../src/lib/grading/providers";
import { parseLLMResponse } from "../src/lib/grading/response-parser";
import { computeWeightedTotal, reconcileRubricScores } from "../src/lib/grading/policy";

const envContent = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
const envVars: any = {};
envContent.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, '');
    envVars[key] = value;
  }
});

// Set environment variables locally so getLLMProvider can read them
process.env.GROQ_API_KEY = envVars.GROQ_API_KEY;

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function gradeAll() {
  console.log("Mengambil semua data submissions yang belum dinilai (null)...");
  const { data: submissions, error: subErr } = await supabase
    .from("submissions")
    .select("id, assignment_id, raw_answer_text, nim, student_name")
    .is("ai_score", null)
    .not("nim", "in", '("230102073","230102125")');

  if (subErr) {
    console.error("Gagal mengambil data submissions:", subErr);
    return;
  }

  if (!submissions || submissions.length === 0) {
    console.log("Semua data mahasiswa sudah dinilai.");
    return;
  }

  console.log(`Ditemukan ${submissions.length} mahasiswa yang perlu dinilai.`);

  for (let i = 0; i < submissions.length; i++) {
    const sub = submissions[i];
    console.log(`\n[${i + 1}/${submissions.length}] Menilai: ${sub.student_name} (${sub.nim})`);

    try {
      // 1. Fetch assignment details
      const { data: assignment, error: assignmentError } = await supabase
        .from("assignments")
        .select("id, title, question, reference_context, model")
        .eq("id", sub.assignment_id)
        .single();

      if (assignmentError || !assignment) {
        console.error(`- Tugas untuk ${sub.student_name} tidak ditemukan:`, assignmentError);
        continue;
      }

      // 2. Fetch rubric aspects
      const { data: rubrics, error: rubricError } = await supabase
        .from("rubrics")
        .select("aspect_name, weight, description")
        .eq("assignment_id", assignment.id);

      if (rubricError || !rubrics || rubrics.length === 0) {
        console.error(`- Rubrik untuk ${sub.student_name} belum terkonfigurasi.`);
        continue;
      }

      const rubricDefinitions = rubrics.map(r => ({
        aspect: r.aspect_name,
        weight: r.weight,
        description: r.description
      }));

      // 3. Compose Prompt
      let prompt = composeGradingPrompt({
        assignmentTitle: assignment.title,
        assignmentInstructions: null,
        soalEsai: assignment.question,
        contextGrounding: assignment.reference_context,
        studentAnswer: sub.raw_answer_text || "",
        rubrics: rubricDefinitions
      });

      // Tambahkan instruksi ketat agar model tidak mengalikan skor dengan bobot sendiri
      prompt += "\n\n### CRITICAL INSTRUCTION ON SCORING:\nFor each aspect in the 'rubric' array, you MUST assign a raw score from 0 to 100 (where 100 is perfect and 0 is completely incorrect). DO NOT multiply or scale the score by the aspect's weight. The system will handle the weighting. For example, if a student gets a perfect score on an aspect with weight 30%, write \"score\": 100 (NOT 30).";

      // 4. Get LLM Provider
      const provider = getLLMProvider({
        provider: "groq",
        model: assignment.model
      });

      // 5. Call LLM
      console.log(`- Mengirim permintaan ke AI model: ${assignment.model}...`);
      const rawOutput = await provider.gradeEssay({ prompt });

      // 6. Parse and Calculate Score
      const parsedResult = parseLLMResponse(rawOutput);

      // Normalisasi jika model mengembalikan skor yang sudah dikali bobot (scaled by weight)
      let isScaledByWeight = false;
      if (parsedResult.holistic.score > 50 && parsedResult.rubric && parsedResult.rubric.length > 0) {
        const checkScaled = parsedResult.rubric.every(item => {
          const def = rubricDefinitions.find(d => d.aspect.toLowerCase().trim() === item.aspect.toLowerCase().trim());
          return def ? item.score <= def.weight : true;
        });
        if (checkScaled) {
          isScaledByWeight = true;
          console.log("- Terdeteksi model mengembalikan skor terbobot. Melakukan normalisasi ke skala 0-100...");
        }
      }

      const reconciledRubricInput = parsedResult.rubric.map(item => {
        const def = rubricDefinitions.find(d => d.aspect.toLowerCase().trim() === item.aspect.toLowerCase().trim());
        if (isScaledByWeight && def && def.weight > 0) {
          return {
            ...item,
            score: (item.score / def.weight) * 100
          };
        }
        return item;
      });

      const normalizedRubric = reconcileRubricScores(
        rubricDefinitions,
        reconciledRubricInput,
        parsedResult.holistic.score
      );
      const calculatedTotalScore = computeWeightedTotal(normalizedRubric);

      console.log(`- Skor AI: ${calculatedTotalScore.toFixed(1)} / 100`);

      // 7. Save to Database
      const { error: updateError } = await supabase
        .from("submissions")
        .update({
          ai_score: calculatedTotalScore,
          final_score: calculatedTotalScore,
          cot_log: parsedResult.global_reasoning
        })
        .eq("id", sub.id);

      if (updateError) {
        console.error(`- Gagal memperbarui nilai di database:`, updateError);
        continue;
      }

      // Delete existing rubric scores first just in case
      await supabase.from("rubric_scores").delete().eq("submission_id", sub.id);

      const aspectScores = normalizedRubric.map(ar => ({
        submission_id: sub.id,
        aspect_name: ar.aspect,
        score: Number(((ar.score * ar.weight) / 100).toFixed(2)),
        feedback_text: ar.feedback
      }));

      const { error: scoreInsertError } = await supabase
        .from("rubric_scores")
        .insert(aspectScores);

      if (scoreInsertError) {
        console.error(`- Gagal menyimpan rincian rubrik:`, scoreInsertError);
      } else {
        console.log(`- Rincian rubrik tersimpan.`);
      }

      // Add a 30-second delay between requests to stay under Groq's 8,000 TPM rate limits for GPT-OSS 120B
      await new Promise(resolve => setTimeout(resolve, 30000));

    } catch (err: any) {
      console.error(`- Gagal menilai ${sub.student_name}:`, err.message);
    }
  }

  console.log("\nSemua proses re-grading selesai!");
}

gradeAll();
