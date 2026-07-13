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

async function checkDarenRaw() {
  const { data: sub, error } = await supabase
    .from("submissions")
    .select("cot_log, ai_score, final_score")
    .eq("nim", "230102033")
    .single();

  if (error || !sub) {
    console.error("Gagal memuat:", error);
    return;
  }

  console.log("AI Score in DB:", sub.ai_score);
  console.log("Final Score in DB:", sub.final_score);
  console.log("CoT Log (justification/JSON output):");
  console.log(sub.cot_log);
}

checkDarenRaw();
