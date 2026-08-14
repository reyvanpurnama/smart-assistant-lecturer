import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { composeGradingPrompt } from "../src/lib/grading/prompt-composer";
import { getLLMProvider } from "../src/lib/grading/providers";

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

process.env.GROQ_API_KEY = envVars.GROQ_API_KEY;

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data: sub } = await supabase
    .from("submissions")
    .select("id, assignment_id, raw_answer_text, nim, student_name")
    .eq("nim", "230102033")
    .single();

  if (!sub) return;

  const { data: assignment } = await supabase
    .from("assignments")
    .select("id, title, question, reference_context")
    .eq("id", sub.assignment_id)
    .single();

  if (!assignment) return;

  const { data: rubrics } = await supabase
    .from("rubrics")
    .select("aspect_name, weight, description")
    .eq("assignment_id", assignment.id);

  if (!rubrics) return;

  const rubricDefinitions = rubrics.map(r => ({
    aspect: r.aspect_name,
    weight: r.weight,
    description: r.description
  }));

  const prompt = composeGradingPrompt({
    assignmentTitle: assignment.title,
    assignmentInstructions: null,
    soalEsai: assignment.question,
    contextGrounding: assignment.reference_context,
    studentAnswer: sub.raw_answer_text || "",
    rubrics: rubricDefinitions
  });

  const provider = getLLMProvider({
    provider: "groq",
    model: "llama-3.3-70b-versatile"
  });

  console.log("Calling Llama 3.3 for Daren Saffana...");
  const rawOutput = await provider.gradeEssay({ prompt });
  console.log("Raw LLM Output JSON:");
  console.log(rawOutput);
}

check();
