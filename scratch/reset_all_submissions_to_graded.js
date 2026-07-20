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

async function run() {
  console.log("Fetching all assignments...");
  const { data: assignments, error: assignError } = await supabase
    .from("assignments")
    .select("id, title, model");

  if (assignError || !assignments) {
    console.error("Gagal mengambil assignments:", assignError);
    return;
  }

  console.log(`Ditemukan ${assignments.length} tugas:`);
  assignments.forEach(a => console.log(`- [${a.id}] ${a.title}`));

  for (const assign of assignments) {
    console.log(`\nMengatur ulang status dan final_score untuk tugas: "${assign.title}" (${assign.id})...`);
    
    // Fetch submissions
    const { data: subs, error: subErr } = await supabase
      .from("submissions")
      .select("id, ai_score, final_score, status")
      .eq("assignment_id", assign.id);

    if (subErr || !subs) {
      console.error(`- Gagal mengambil submissions:`, subErr);
      continue;
    }

    console.log(`- Ditemukan ${subs.length} submissions.`);
    
    let updatedCount = 0;
    for (const sub of subs) {
      if (sub.ai_score !== null) {
        // Set final_score = ai_score and status = "Graded"
        const { error: updErr } = await supabase
          .from("submissions")
          .update({
            final_score: sub.ai_score,
            status: "Graded"
          })
          .eq("id", sub.id);

        if (updErr) {
          console.error(`  - Gagal memperbarui submission ID ${sub.id}:`, updErr);
        } else {
          updatedCount++;
        }
      }
    }
    console.log(`- Berhasil memperbarui ${updatedCount} submissions ke status 'Graded' dan final_score = ai_score.`);
  }

  console.log("\nProses perapihan status untuk sidang selesai!");
}

run();
