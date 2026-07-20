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
  const { data: assignments, error: assignError } = await supabase
    .from("assignments")
    .select("id, title, course_code, model");

  if (assignError) {
    console.error("Error fetching assignments:", assignError);
    return;
  }

  console.log("Assignments:");
  console.log(JSON.stringify(assignments, null, 2));

  for (const assign of assignments) {
    const { count, error: subError } = await supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .eq("assignment_id", assign.id);

    if (subError) {
      console.error(`Error for assignment ${assign.id}:`, subError);
    } else {
      console.log(`Assignment "${assign.title}" (${assign.id}) has ${count} submissions.`);
    }
  }
}

run();
