const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load environment variables
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

// Pearson correlation coefficient calculation
function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  
  const meanX = sumX / n;
  const meanY = sumY / n;
  
  let num = 0;
  let denX = 0;
  let denY = 0;
  
  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    num += diffX * diffY;
    denX += diffX * diffX;
    denY += diffY * diffY;
  }
  
  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}

// Quadratic Weighted Kappa (QWK) calculation
function quadraticWeightedKappa(x, y, minVal = 0, maxVal = 100) {
  const n = x.length;
  if (n === 0) return 0;

  const roundedX = x.map(v => Math.round(v));
  const roundedY = y.map(v => Math.round(v));
  
  // Define rating classes
  const classes = [];
  for (let c = minVal; c <= maxVal; c++) {
    classes.push(c);
  }
  const numClasses = classes.length;
  const classIndex = {};
  classes.forEach((c, idx) => {
    classIndex[c] = idx;
  });

  // Initialize matrices
  const O = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));
  const W = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));
  
  // Calculate histogram counts for expected matrix
  const histX = Array(numClasses).fill(0);
  const histY = Array(numClasses).fill(0);
  
  for (let i = 0; i < n; i++) {
    const idxX = classIndex[roundedX[i]];
    const idxY = classIndex[roundedY[i]];
    
    if (idxX !== undefined && idxY !== undefined) {
      O[idxX][idxY]++;
      histX[idxX]++;
      histY[idxY]++;
    }
  }
  
  // Calculate weights matrix
  for (let i = 0; i < numClasses; i++) {
    for (let j = 0; j < numClasses; j++) {
      const diff = classes[i] - classes[j];
      W[i][j] = (diff * diff) / ((numClasses - 1) * (numClasses - 1));
    }
  }
  
  // Calculate expected matrix E
  const E = Array(numClasses).fill(0).map(() => Array(numClasses).fill(0));
  for (let i = 0; i < numClasses; i++) {
    for (let j = 0; j < numClasses; j++) {
      E[i][j] = (histX[i] * histY[j]) / n;
    }
  }
  
  // Calculate QWK score
  let num = 0;
  let den = 0;
  for (let i = 0; i < numClasses; i++) {
    for (let j = 0; j < numClasses; j++) {
      num += W[i][j] * O[i][j];
      den += W[i][j] * E[i][j];
    }
  }
  
  if (den === 0) return 0;
  return 1 - (num / den);
}

async function compute() {
  console.log("Fetching live submissions from Supabase database...");
  const { data: submissions, error } = await supabase
    .from("submissions")
    .select("nim, student_name, ai_score, final_score, status")
    .order("nim", { ascending: true });

  if (error) {
    console.error("Database error:", error);
    process.exit(1);
  }

  console.log(`Successfully fetched ${submissions.length} submissions.`);

  const dataset = submissions.map(sub => {
    return {
      nim: sub.nim,
      name: sub.student_name,
      aiScore: parseFloat(sub.ai_score || 0),
      finalScore: parseFloat(sub.final_score || 0),
      status: sub.status
    };
  });

  const aiScoresList = dataset.map(d => d.aiScore);
  const finalScoresList = dataset.map(d => d.finalScore);

  console.log("\n=== DAFTAR NILAI LIVE MAHASISWA ===");
  console.log("No | NIM | Nama Mahasiswa | Skor AI | Skor Akhir (Dosen) | Status");
  console.log("----------------------------------------------------------------------");
  dataset.forEach((d, idx) => {
    console.log(
      `${String(idx + 1).padStart(2, ' ')} | ${d.nim} | ${d.name.padEnd(30, ' ')} | ${String(d.aiScore.toFixed(1)).padStart(7, ' ')} | ${String(d.finalScore.toFixed(1)).padStart(18, ' ')} | ${d.status}`
    );
  });

  // Calculate Pearson correlation between AI score and Final Score
  const pearsonVal = pearsonCorrelation(aiScoresList, finalScoresList);
  
  // Calculate QWK on scale 0-100 (nearest rounded integer)
  const qwk100 = quadraticWeightedKappa(aiScoresList, finalScoresList, 0, 100);
  
  // Calculate QWK on scale 0-10 (binned by dividing by 10)
  const binnedAIList = aiScoresList.map(s => s / 10);
  const binnedFinalList = finalScoresList.map(s => s / 10);
  const qwk10 = quadraticWeightedKappa(binnedAIList, binnedFinalList, 0, 10);

  console.log("\n=== HASIL EVALUASI STATISTIK DARI DATABASE ===");
  console.log(`1. Koefisien Korelasi Pearson (r): ${pearsonVal.toFixed(4)}`);
  printInterpretation(pearsonVal);
  console.log(`2. Quadratic Weighted Kappa (QWK) Skala 100: ${qwk100.toFixed(4)}`);
  console.log(`3. Quadratic Weighted Kappa (QWK) Skala 10 (Binned): ${qwk10.toFixed(4)}`);
  console.log("=================================================");
  
  // Save dataset to JSON
  fs.writeFileSync(
    path.join(__dirname, "evaluation_data.json"),
    JSON.stringify({ dataset, pearson: pearsonVal, qwk100, qwk10 }, null, 2),
    "utf8"
  );
  console.log("\nSaved dataset copy to scratch/evaluation_data.json");
}

function printInterpretation(r) {
  let strength = "";
  if (Math.abs(r) < 0.2) strength = "Sangat Lemah / Hampir Tidak Ada Korelasi";
  else if (Math.abs(r) < 0.4) strength = "Korelasi Lemah";
  else if (Math.abs(r) < 0.6) strength = "Korelasi Sedang";
  else if (Math.abs(r) < 0.8) strength = "Korelasi Kuat";
  else strength = "Korelasi Sangat Kuat";
  console.log(`   └─ Interpretasi: Keandalan Hubungan ${strength}`);
}

compute();
