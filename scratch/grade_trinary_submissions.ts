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

const TARGET_ASSIGNMENT_ID = "9aad3dea-a371-4cc7-abe0-11500b4bb0a5";
const REQUEST_DELAY_MS = 35000; // 35 seconds delay between requests (safe for Groq limits)

async function gradeAll() {
  console.log(`Mengambil data submissions untuk assignment ${TARGET_ASSIGNMENT_ID} yang belum dinilai (null)...`);
  const { data: submissions, error: subErr } = await supabase
    .from("submissions")
    .select("id, assignment_id, raw_answer_text, nim, student_name")
    .eq("assignment_id", TARGET_ASSIGNMENT_ID)
    .is("ai_score", null)
    .not("nim", "in", '("230102073","230102125")')
    .order("nim", { ascending: true });

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

      // Tambahkan instruksi ketat untuk penilaian bertingkat (0, 50, atau 100 saja)
      prompt += "\n\n### CRITICAL INSTRUCTION ON TRINARY SCORING:\nFor each aspect in the 'rubric' array, you MUST assign a raw score of EXACTLY ONE of these three options:\n- 100: If completely correct and perfect.\n- 50: If partially correct (has minor typos, missing quotes, or missing screenshot, but shows correct logic).\n- 0: If incorrect, incomplete, or missing.\n\nDO NOT use any other scores (e.g. 10, 20, 60, 70, 80, 90). The raw score MUST be strictly 0, 50, or 100. DO NOT scale the score by the aspect's weight. The system will handle the weighting automatically.";

      // 4. Get LLM Provider
      const provider = getLLMProvider({
        provider: "groq",
        model: assignment.model
      });

      // 5. Call LLM with retry on 429
      let rawOutput = "";
      let retries = 4;
      while (retries > 0) {
        try {
          console.log(`- Mengirim permintaan ke AI model: ${assignment.model}...`);
          rawOutput = await provider.gradeEssay({ prompt });
          break;
        } catch (err: any) {
          if (err.message.includes("429") || err.message.includes("rate_limit_exceeded") || err.message.includes("Rate limit")) {
            console.log(`- Terdeteksi rate limit (429). Menunggu 25 detik sebelum mencoba lagi (Sisa percobaan: ${retries - 1})...`);
            await new Promise(resolve => setTimeout(resolve, 25000));
            retries--;
            if (retries === 0) throw err;
          } else {
            throw err;
          }
        }
      }

      // 6. Parse and Calculate Score
      const parsedResult = parseLLMResponse(rawOutput);

      // Pastikan semua skor di rubrik yang dikembalikan model adalah trinary (0, 50, atau 100)
      const sanitizedRubric = parsedResult.rubric.map(item => {
        let rawScore = Number(item.score);
        // Force to closest of 0, 50, 100
        let trinaryScore = 0;
        if (rawScore > 75) {
          trinaryScore = 100;
        } else if (rawScore > 25) {
          trinaryScore = 50;
        } else {
          trinaryScore = 0;
        }
        return {
          ...item,
          score: trinaryScore
        };
      });

      // Clamp holistic score to closest of 0, 50, 100
      let rawHolistic = Number(parsedResult.holistic.score);
      let trinaryHolistic = 0;
      if (rawHolistic > 75) {
        trinaryHolistic = 100;
      } else if (rawHolistic > 25) {
        trinaryHolistic = 50;
      } else {
        trinaryHolistic = 0;
      }

      const normalizedRubric = reconcileRubricScores(
        rubricDefinitions,
        sanitizedRubric,
        trinaryHolistic
      );
      
      // Calculate weighted total score
      const calculatedTotalScore = computeWeightedTotal(normalizedRubric);

      console.log(`- Skor AI (Trinary): ${calculatedTotalScore} / 100`);

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

      // Delete existing rubric scores first
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

    } catch (err: any) {
      console.error(`- Gagal menilai ${sub.student_name}:`, err.message);
    }

    if (i < submissions.length - 1) {
      console.log(`Menunggu ${REQUEST_DELAY_MS / 1000} detik sebelum menilai berikutnya...`);
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
    }
  }

  console.log("\nSemua proses grading trinary selesai!");
}

gradeAll();
