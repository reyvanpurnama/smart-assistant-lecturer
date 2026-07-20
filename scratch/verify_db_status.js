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
  const { data: assignments } = await supabase.from("assignments").select("id, title");
  
  for (const a of assignments) {
    const { data: subs } = await supabase
      .from("submissions")
      .select("nim, ai_score, final_score, status")
      .eq("assignment_id", a.id);

    const statuses = {};
    let equalCount = 0;
    subs.forEach(s => {
      statuses[s.status] = (statuses[s.status] || 0) + 1;
      if (s.ai_score === s.final_score) equalCount++;
    });

    console.log(`\nAssignment: "${a.title}" (${a.id})`);
    console.log(`- Total Submissions: ${subs.length}`);
    console.log(`- Status Distribution:`, statuses);
    console.log(`- Submissions with final_score == ai_score: ${equalCount} / ${subs.length}`);
  }
}

run();
