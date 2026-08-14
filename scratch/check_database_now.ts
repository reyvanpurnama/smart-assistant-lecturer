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

async function check() {
  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("nim, student_name, ai_score, final_score, status");

  if (error) {
    console.error(error);
    return;
  }

  console.log("Submissions state in Supabase:");
  console.log(submissions);
}

check();
