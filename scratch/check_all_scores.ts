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

async function checkAllScores() {
  console.log("Mengambil hasil penilaian mahasiswa dari Supabase...");
  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("nim, student_name, ai_score, final_score")
    .order("ai_score", { ascending: true });

  if (error) {
    console.error("Error fetching submissions:", error);
    return;
  }

  if (!submissions || submissions.length === 0) {
    console.log("Tidak ada data ditemukan.");
    return;
  }

  console.log("\n=== DAFTAR NILAI AI MAHASISWA (Urut dari Terendah ke Tertinggi) ===");
  submissions.forEach((sub, index) => {
    console.log(`${index + 1}. [NIM: ${sub.nim}] ${sub.student_name}`);
    console.log(`   - AI Score: ${sub.ai_score !== null ? sub.ai_score : "Belum Dinilai (null)"}`);
    console.log(`   - Final Score (Override): ${sub.final_score !== null ? sub.final_score : "Belum Dinilai (null)"}`);
    console.log("   -------------------------------------------------");
  });
}

checkAllScores();
