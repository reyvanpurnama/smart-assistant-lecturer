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

const targetStudents = [
  { nim: "230102005", name: "Achmad Mahdi Adyan" },
  { nim: "230102115", name: "Regina Ulima Prasista Aura" },
  { nim: "230102042", name: "Fahmi Maulana Sitakar" },
  { nim: "230102073", name: "Melani Anggraena" },
  { nim: "230102125", name: "Tia Pebriyanti" }
];

async function extract() {
  console.log("Extracting cleared text for target students...");
  for (const student of targetStudents) {
    const { data, error } = await supabase
      .from("submissions")
      .select("raw_answer_text, ai_score, final_score")
      .eq("nim", student.nim)
      .single();

    if (error || !data) {
      console.error(`- Gagal mengambil data untuk ${student.name} (${student.nim}):`, error?.message || "Not found");
      continue;
    }

    const filename = `scratch/cleared_text_${student.nim}_${student.name.toLowerCase().replace(/\s+/g, '_')}.txt`;
    const content = `==================================================\nNIM: ${student.nim}\nNama: ${student.name}\nSkor AI: ${data.ai_score}\nSkor Akhir: ${data.final_score}\n==================================================\n\n${data.raw_answer_text}`;
    
    fs.writeFileSync(path.join(process.cwd(), filename), content, "utf8");
    console.log(`- Berhasil menyimpan ke: ${filename}`);
  }
}

extract();
