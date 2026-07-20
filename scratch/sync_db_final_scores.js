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

const TARGET_ASSIGNMENT_ID = "5f70522f-665e-4f7a-a6b3-39ab4314632e";

async function run() {
  // 1. Read strict CSV file
  const csvPath = path.join(__dirname, "../docs/IF23A_cleaned_strict.csv");
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV not found at: ${csvPath}`);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, "utf8");
  const lines = csvContent.split("\n").map(l => l.trim()).filter(Boolean);
  
  const csvData = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(",");
    if (parts.length >= 4) {
      const nim = parts[0].trim();
      const name = parts.slice(1, parts.length - 3).join(",").trim().replace(/^["']|["']$/g, '');
      const skorAi = parseFloat(parts[parts.length - 3]);
      const skorDosen = parseFloat(parts[parts.length - 2]);
      csvData.push({ nim, name, skorAi, skorDosen });
    }
  }

  console.log(`Loaded ${csvData.length} records from strict CSV.`);

  // 2. Fetch all submissions for the target assignment
  const { data: dbSubmissions, error: subErr } = await supabase
    .from("submissions")
    .select("id, nim, student_name, ai_score, final_score")
    .eq("assignment_id", TARGET_ASSIGNMENT_ID);

  if (subErr || !dbSubmissions) {
    console.error("Failed to fetch submissions from database:", subErr);
    return;
  }

  // 3. Fetch rubrics definitions for weight limits
  const { data: rubrics, error: rubErr } = await supabase
    .from("rubrics")
    .select("aspect_name, weight")
    .eq("assignment_id", TARGET_ASSIGNMENT_ID);

  if (rubErr || !rubrics) {
    console.error("Failed to fetch rubrics:", rubErr);
    return;
  }

  const weightMap = {};
  rubrics.forEach(r => {
    weightMap[r.aspect_name] = r.weight;
  });

  console.log("Rubric aspect weights mapped:", weightMap);

  for (const csvRow of csvData) {
    const sub = dbSubmissions.find(s => s.nim === csvRow.nim);
    if (!sub) {
      console.warn(`No DB submission found for student: ${csvRow.name} (${csvRow.nim})`);
      continue;
    }

    const { skorAi, skorDosen } = csvRow;
    console.log(`Syncing ${csvRow.name} (${csvRow.nim}): AI = ${skorAi}, Dosen = ${skorDosen}`);

    // Fetch rubric scores for this submission
    const { data: currentScores, error: scoresErr } = await supabase
      .from("rubric_scores")
      .select("id, aspect_name, score")
      .eq("submission_id", sub.id);

    if (scoresErr || !currentScores) {
      console.error(`- Failed to fetch rubric scores for ${csvRow.name}:`, scoresErr);
      continue;
    }

    // Scale aspect scores
    let scale = skorAi > 0 ? (skorDosen / skorAi) : 0;
    let newScores = currentScores.map(cs => {
      const maxWeight = weightMap[cs.aspect_name] || 10;
      let scaled = cs.score * scale;
      // Clamp to max weight
      scaled = Math.min(maxWeight, Math.max(0, scaled));
      return {
        id: cs.id,
        aspect_name: cs.aspect_name,
        original: cs.score,
        maxWeight,
        score: Number(scaled.toFixed(2))
      };
    });

    // Adjust rounding differences
    let sum = newScores.reduce((acc, curr) => acc + curr.score, 0);
    let diff = skorDosen - sum;
    if (Math.abs(diff) > 0.01 && newScores.length > 0) {
      // Add difference to the aspect with the largest score that hasn't exceeded its limit
      let adjusted = false;
      // Try to find an aspect where we can add/subtract without violating bounds
      for (const ns of newScores) {
        if (ns.score + diff >= 0 && ns.score + diff <= ns.maxWeight) {
          ns.score = Number((ns.score + diff).toFixed(2));
          adjusted = true;
          break;
        }
      }
      if (!adjusted) {
        // Fallback: just add to the first aspect and clamp it
        newScores[0].score = Math.min(newScores[0].maxWeight, Math.max(0, Number((newScores[0].score + diff).toFixed(2))));
      }
    }

    // Update rubric scores in DB
    for (const ns of newScores) {
      const { error: scoreUpdErr } = await supabase
        .from("rubric_scores")
        .update({ score: ns.score })
        .eq("id", ns.id);

      if (scoreUpdErr) {
        console.error(`  - Failed to update rubric score ID ${ns.id}:`, scoreUpdErr);
      }
    }

    // Update submission record
    const { error: subUpdErr } = await supabase
      .from("submissions")
      .update({
        final_score: skorDosen,
        status: "Overridden"
      })
      .eq("id", sub.id);

    if (subUpdErr) {
      console.error(`  - Failed to update submission ID ${sub.id}:`, subUpdErr);
    } else {
      console.log(`  - Successfully synced database. final_score = ${skorDosen}`);
    }
  }

  console.log("\nDatabase synchronization completed successfully!");
}

run();
