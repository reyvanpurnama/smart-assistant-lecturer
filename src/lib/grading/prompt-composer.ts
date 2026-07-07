import type { RubricDefinition } from "@/lib/grading/types";

type ComposePromptInput = {
  assignmentTitle: string;
  assignmentInstructions: string | null;
  soalEsai: string | null;
  contextGrounding: string | null;
  studentAnswer: string;
  rubrics: RubricDefinition[];
};

export function composeGradingPrompt(input: ComposePromptInput): string {
  const rubricBlock = input.rubrics
    .map(
      (rubric, index) =>
        `${index + 1}. Aspect: ${rubric.aspect}\n   Weight: ${rubric.weight}%\n   Criteria: ${rubric.description}`
    )
    .join("\n\n");

  const safeInstructions = input.assignmentInstructions?.trim() || "No extra instructions.";
  const safeSoal = input.soalEsai?.trim() || "No specific question text provided.";
  const safeContext = input.contextGrounding?.trim() || "No specific academic context reference provided.";

  return [
    "### [ROLE]",
    "You are a strict but fair smart assistant lecturer (asisten dosen cerdas) for essay and pseudocode grading.",
    "",
    "### [TASK]",
    "Evaluate the student's answer using a step-by-step Chain-of-Thought (CoT) strategy:",
    "1. Analyze the student's answer logic relative to the essay question, the provided rubrics, and the reference material.",
    "2. Compare the logic of the student's answer with the context grounding. Note any discrepancies, omissions, or errors.",
    "3. Reason about each specific grading aspect in the rubrics and assign scores strictly on a 0-100 scale.",
    "4. Determine the overall holistic score and provide feedback based on this step-by-step reasoning.",
    "",
    "### Area Context Grounding (Lecturer Authority)",
    "#### [CRITERIA] Rubrik Penilaian:",
    rubricBlock || "No rubric provided.",
    "",
    "#### [CONTEXT] Konteks Akademik / Materi Referensi:",
    safeContext,
    "",
    "#### [SOAL_ESAI] Soal Ujian:",
    safeSoal,
    "",
    "### [INPUT_DATA] Jawaban Mahasiswa:",
    input.studentAnswer,
    "",
    "### [OUTPUT_FORMAT]",
    "You MUST respond ONLY with a valid JSON object matching the schema below. Do not output any markdown fences (like ```json) or explanation outside the JSON object.",
    "",
    "JSON Schema:",
    "{",
    '  "holistic": {',
    '    "score": number,',
    '    "feedback": "Detailed overall feedback in Indonesian"',
    "  },",
    '  "rubric": [',
    "    {",
    '      "aspect": "Name of the aspect",',
    '      "score": number,',
    '      "weight": number,',
    '      "feedback": "Feedback for this specific aspect in Indonesian",',
    '      "reasoning": "Step-by-step justification for the score of this aspect in Indonesian"',
    "    }",
    "  ],",
    '  "weighted_total": number,',
    '  "global_reasoning": "Comprehensive Chain-of-Thought reasoning for the entire evaluation in Indonesian"',
    "}"
  ].join("\n");
}

