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
  // 1. Read binary CSV file
  const csvPath = path.join(__dirname, "../docs/IF23A_cleaned_binary.csv");
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

  console.log(`Loaded ${csvData.length} records from binary CSV.`);

  // 2. Fetch all submissions for the target assignment
  const { data: dbSubmissions, error: subErr } = await supabase
    .from("submissions")
    .select("id, nim, student_name, ai_score, final_score")
    .eq("assignment_id", TARGET_ASSIGNMENT_ID);

  if (subErr || !dbSubmissions) {
    console.error("Failed to fetch submissions from database:", subErr);
    return;
  }

  // 3. Fetch rubrics definitions for weights
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

    const { skorDosen } = csvRow;
    console.log(`Syncing ${csvRow.name} (${csvRow.nim}): Target Dosen Score = ${skorDosen}`);

    // Fetch current rubric scores for this submission
    const { data: currentScores, error: scoresErr } = await supabase
      .from("rubric_scores")
      .select("id, aspect_name, score")
      .eq("submission_id", sub.id);

    if (scoresErr || !currentScores) {
      console.error(`- Failed to fetch rubric scores for ${csvRow.name}:`, scoresErr);
      continue;
    }

    // Convert to working array
    let workingScores = currentScores.map(cs => {
      const maxWeight = weightMap[cs.aspect_name] || 10;
      return {
        id: cs.id,
        aspect_name: cs.aspect_name,
        maxWeight,
        score: cs.score // Currently stored in DB as the actual weight contribution (e.g. 10 or 0)
      };
    });

    let currentSum = workingScores.reduce((acc, curr) => acc + curr.score, 0);
    let diff = skorDosen - currentSum;

    console.log(`  - Current Sum: ${currentSum}, Diff: ${diff}`);

    if (diff !== 0) {
      if (diff > 0) {
        // We need to add points
        // Sort aspects currently scored 0 by weight descending
        const zeroAspects = workingScores.filter(ws => ws.score === 0).sort((a, b) => b.maxWeight - a.maxWeight);
        
        for (const za of zeroAspects) {
          if (diff >= za.maxWeight) {
            za.score = za.maxWeight;
            diff -= za.maxWeight;
          } else if (diff > 0) {
            // If the remaining difference is smaller than the aspect's weight (e.g. diff is 5 but weight is 10)
            // we can set the score to the remaining difference (e.g. 5)
            za.score = diff;
            diff = 0;
          }
          if (diff === 0) break;
        }
      } else {
        // We need to subtract points (diff < 0)
        let amtToSubtract = Math.abs(diff);
        // Sort aspects currently scored > 0 by score ascending
        const nonZeroAspects = workingScores.filter(ws => ws.score > 0).sort((a, b) => a.score - b.score);
        
        for (const nza of nonZeroAspects) {
          if (amtToSubtract >= nza.score) {
            amtToSubtract -= nza.score;
            nza.score = 0;
          } else if (amtToSubtract > 0) {
            nza.score -= amtToSubtract;
            amtToSubtract = 0;
          }
          if (amtToSubtract === 0) break;
        }
      }
    }

    // Update rubric scores in DB
    for (const ws of workingScores) {
      const { error: scoreUpdErr } = await supabase
        .from("rubric_scores")
        .update({ score: ws.score })
        .eq("id", ws.id);

      if (scoreUpdErr) {
        console.error(`  - Failed to update rubric score ID ${ws.id}:`, scoreUpdErr);
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
