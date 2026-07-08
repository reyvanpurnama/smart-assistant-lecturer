import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { composeGradingPrompt } from "@/lib/grading/prompt-composer";
import { getLLMProvider } from "@/lib/grading/providers";
import { parseLLMResponse } from "@/lib/grading/response-parser";
import { computeWeightedTotal, reconcileRubricScores } from "@/lib/grading/policy";

export async function POST(req: NextRequest) {
  try {
    const { submissionId } = await req.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "Parameter submissionId harus disertakan." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Fetch the submission details
    const { data: submission, error: subError } = await supabase
      .from("submissions")
      .select("id, assignment_id, raw_answer_text, nim, student_name")
      .eq("id", submissionId)
      .single();

    if (subError || !submission) {
      console.error("Fetch submission error:", subError);
      return NextResponse.json(
        { error: "Jawaban mahasiswa tidak ditemukan." },
        { status: 404 }
      );
    }

    // 2. Fetch the assignment details
    const { data: assignment, error: assignmentError } = await supabase
      .from("assignments")
      .select("id, title, question, reference_context, model")
      .eq("id", submission.assignment_id)
      .single();

    if (assignmentError || !assignment) {
      console.error("Fetch assignment error:", assignmentError);
      return NextResponse.json(
        { error: "Tugas praktikum tidak ditemukan." },
        { status: 404 }
      );
    }

    // 3. Load rubric aspects
    const { data: rubrics, error: rubricError } = await supabase
      .from("rubrics")
      .select("aspect_name, weight, description")
      .eq("assignment_id", assignment.id);

    if (rubricError || !rubrics || rubrics.length === 0) {
      return NextResponse.json(
        { error: "Kriteria penilaian rubrik tugas belum terkonfigurasi." },
        { status: 500 }
      );
    }

    const rubricDefinitions = rubrics.map(r => ({
      aspect: r.aspect_name,
      weight: r.weight,
      description: r.description
    }));

    // 4. Compose Prompt and Trigger Groq API Inference
    const prompt = composeGradingPrompt({
      assignmentTitle: assignment.title,
      assignmentInstructions: null,
      soalEsai: assignment.question,
      contextGrounding: assignment.reference_context,
      studentAnswer: submission.raw_answer_text || "",
      rubrics: rubricDefinitions
    });

    const provider = getLLMProvider({
      provider: "groq",
      model: assignment.model
    });

    let providerRawOutput = "";
    try {
      providerRawOutput = await provider.gradeEssay({ prompt });
    } catch (err: any) {
      console.error("LLM Provider error:", err);
      return NextResponse.json(
        { error: `Gagal memanggil API model AI (Groq): ${err.message}` },
        { status: 502 }
      );
    }

    // 5. Parse LLM Output & Reconcile Scores
    let parsedResult;
    try {
      parsedResult = parseLLMResponse(providerRawOutput);
    } catch (err: any) {
      console.error("LLM Parser error:", err);
      return NextResponse.json(
        { error: `Format respon dari AI tidak valid: ${err.message}` },
        { status: 502 }
      );
    }

    const normalizedRubric = reconcileRubricScores(
      rubricDefinitions,
      parsedResult.rubric,
      parsedResult.holistic.score
    );

    const calculatedTotalScore = computeWeightedTotal(normalizedRubric);

    // 6. Update Submission record in DB with grades
    const { error: updateError } = await supabase
      .from("submissions")
      .update({
        ai_score: calculatedTotalScore,
        final_score: calculatedTotalScore,
        cot_log: parsedResult.global_reasoning
      })
      .eq("id", submission.id);

    if (updateError) {
      console.error("Database update error:", updateError);
      return NextResponse.json(
        { error: `Gagal memperbarui hasil penilaian: ${updateError.message}` },
        { status: 500 }
      );
    }

    // 7. Save individual aspect scores (clear existing first just in case)
    await supabase.from("rubric_scores").delete().eq("submission_id", submission.id);

    const aspectScores = normalizedRubric.map(ar => ({
      submission_id: submission.id,
      aspect_name: ar.aspect,
      score: Number(((ar.score * ar.weight) / 100).toFixed(2)),
      feedback_text: ar.feedback
    }));

    const { error: scoreInsertError } = await supabase
      .from("rubric_scores")
      .insert(aspectScores);

    if (scoreInsertError) {
      console.error("Aspect scores insert error:", scoreInsertError);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Grade route error:", err);
    return NextResponse.json(
      { error: `Terjadi kesalahan internal server: ${err.message}` },
      { status: 500 }
    );
  }
}
