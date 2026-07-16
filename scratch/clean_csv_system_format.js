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

const csvPath = path.join(__dirname, "../docs/IF23A.xlsx - Praktikum 2 - DBMS & Dasar MySQ.csv");
const cleanedCsvPath = path.join(__dirname, "../docs/IF23A_cleaned.csv");

// Helper to normalize names for matching
function normalize(str) {
  if (!str) return "";
  let clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Manual overrides for slight spelling differences
  if (clean === "dafffaaqylariyadi") clean = "daffaaqylariyadi";
  return clean;
}

async function run() {
  if (!fs.existsSync(csvPath)) {
    console.error("CSV file not found:", csvPath);
    return;
  }

  // 1. Fetch data from Supabase
  console.log("Fetching submissions from Supabase...");
  const { data: dbSubmissions, error: dbErr } = await supabase
    .from("submissions")
    .select("nim, student_name, ai_score, status")
    .order("nim", { ascending: true });

  if (dbErr) {
    console.error("Error fetching from Supabase:", dbErr);
    return;
  }
  console.log(`Fetched ${dbSubmissions.length} submissions from DB.`);

  // 2. Parse the lecturer spreadsheet CSV and recalculate scores
  const fileContent = fs.readFileSync(csvPath, "utf8");
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");
  const weights = [10, 10, 10, 10, 10, 10, 5, 5, 5, 5, 10, 10];

  const lecturerScores = [];
  for (let i = 2; i < lines.length; i++) {
    const row = lines[i].split(",");
    if (row.length < 2) continue;

    const name = row[1].trim();
    if (!name) continue;

    // Check if they submitted
    let hasSubmission = false;
    const academicValues = [];
    for (let j = 2; j <= 13; j++) {
      const val = row[j] ? row[j].trim().toUpperCase() : "FALSE";
      academicValues.push(val);
      if (val === "TRUE") {
        hasSubmission = true;
      }
    }

    if (!hasSubmission) continue;

    // Calculate score
    let academicTotal = 0;
    for (let j = 0; j < academicValues.length; j++) {
      if (academicValues[j] === "TRUE") {
        academicTotal += weights[j];
      }
    }

    lecturerScores.push({
      name,
      normName: normalize(name),
      score: academicTotal
    });
  }

  // 3. Match DB submissions with recalculated lecturer scores
  const matchedRows = [];
  
  // Header row matching system format
  matchedRows.push("nim,nama_mahasiswa,skor_ai,skor_dosen,status");

  let matchCount = 0;
  for (const dbSub of dbSubmissions) {
    const dbNorm = normalize(dbSub.student_name);
    
    // Try to find exact or prefix match
    let match = lecturerScores.find(l => l.normName === dbNorm);
    if (!match) {
      match = lecturerScores.find(l => l.normName.startsWith(dbNorm) || dbNorm.startsWith(l.normName));
    }

    if (match) {
      matchCount++;
      matchedRows.push([
        dbSub.nim,
        dbSub.student_name,
        dbSub.ai_score,
        match.score,
        dbSub.status
      ].join(","));
    } else {
      console.warn(`WARNING: No match found for DB student: ${dbSub.student_name} (${dbSub.nim})`);
      // Fallback with same score or null
      matchedRows.push([
        dbSub.nim,
        dbSub.student_name,
        dbSub.ai_score,
        null,
        dbSub.status
      ].join(","));
    }
  }

  fs.writeFileSync(cleanedCsvPath, matchedRows.join("\n"), "utf8");
  console.log(`\nMatched ${matchCount}/${dbSubmissions.length} students.`);
  console.log(`Cleaned CSV in system format saved to: docs/IF23A_cleaned.csv`);
}

run();
