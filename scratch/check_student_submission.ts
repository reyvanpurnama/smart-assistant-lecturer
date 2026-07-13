import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

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

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function findStudent() {
  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("*");
  if (error) {
    console.error("Error fetching submissions:", error);
    return;
  }
  
  console.log("=== ALL SUBMISSIONS ===");
  submissions.forEach((sub: any) => {
    console.log(`ID: ${sub.id} | NIM: ${sub.nim} | Name: ${sub.student_name}`);
  });

  const matching = submissions.filter((sub: any) => 
    sub.student_name?.toLowerCase().includes("fahmi") ||
    sub.student_name?.toLowerCase().includes("maulana")
  );

  console.log("\n=== MATCHING SUBMISSIONS ===");
  for (const sub of matching) {
    console.log("----------------------------------------");
    console.log("Sub ID:", sub.id);
    console.log("Student Name:", sub.student_name);
    console.log("NIM:", sub.nim);
    console.log("File Path:", sub.file_path);
    console.log("AI Score:", sub.ai_score);
    console.log("Final Score:", sub.final_score);
    console.log("Raw Answer Text (first 3000 chars):");
    console.log(sub.raw_answer_text);
    console.log("CoT Log:");
    console.log(sub.cot_log);
    console.log("----------------------------------------");
    
    // Check rubric scores
    const { data: scores, error: scoresErr } = await supabase
      .from("rubric_scores")
      .select("*")
      .eq("submission_id", sub.id);
      
    if (scoresErr) {
      console.log("Error fetching rubric scores:", scoresErr.message);
    } else {
      console.log("Rubric Scores:");
      console.log(JSON.stringify(scores, null, 2));
    }
  }
}

findStudent();
