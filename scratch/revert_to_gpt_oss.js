const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envContent = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const envVars = {};
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

const TARGET_ASSIGNMENT_ID = "bcc2f89d-9b24-4c02-be79-7c593b19d823";

async function run() {
  console.log(`Reverting assignment ${TARGET_ASSIGNMENT_ID} model to openai/gpt-oss-120b...`);
  
  // 1. Update assignment model
  const { error: assignError } = await supabase
    .from("assignments")
    .update({ model: "openai/gpt-oss-120b" })
    .eq("id", TARGET_ASSIGNMENT_ID);

  if (assignError) {
    console.error("Gagal merevert model assignment:", assignError);
    return;
  }

  // 2. Fetch all submissions
  const { data: subs, error: subsError } = await supabase
    .from("submissions")
    .select("id")
    .eq("assignment_id", TARGET_ASSIGNMENT_ID);

  if (subsError || !subs) {
    console.error("Gagal mengambil data submissions:", subsError);
    return;
  }

  const subIds = subs.map(s => s.id);
  console.log(`Menghapus data rubric_scores untuk ${subIds.length} submissions...`);

  // 3. Delete rubric scores
  if (subIds.length > 0) {
    const { error: delScoresError } = await supabase
      .from("rubric_scores")
      .delete()
      .in("submission_id", subIds);

    if (delScoresError) {
      console.error("Gagal menghapus rubric_scores:", delScoresError);
    }
  }

  // 4. Reset submissions scores and logs
  console.log("Mereset ai_score, final_score, dan cot_log ke null...");
  const { error: resetError } = await supabase
    .from("submissions")
    .update({
      ai_score: null,
      final_score: null,
      cot_log: null,
      status: "Graded"
    })
    .eq("assignment_id", TARGET_ASSIGNMENT_ID);

  if (resetError) {
    console.error("Gagal mereset submissions:", resetError);
  } else {
    console.log("Database berhasil dibersihkan dan siap dinilai ulang besok dengan gpt-oss-120b!");
  }
}

run();
