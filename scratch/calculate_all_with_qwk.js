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

// Assignments
const ASSIGNMENTS = {
  Relaxed: "a9a632e2-8adb-432c-b001-29b95f19f7aa",
  Strict: "5f70522f-665e-4f7a-a6b3-39ab4314632e",
  Binary: "bcc2f89d-9b24-4c02-be79-7c593b19d823",
  Trinary: "9aad3dea-a371-4cc7-abe0-11500b4bb0a5"
};

// Quadratic Weighted Kappa (QWK) implementation
function quadraticWeightedKappa(raterA, raterB, minRating = 0, maxRating = 100, step = 5) {
  // Generate categories: 0, 5, 10, ..., 100
  const categories = [];
  for (let r = minRating; r <= maxRating; r += step) {
    categories.push(r);
  }
  const numCategories = categories.length;

  // Map values to closest category index
  function toCategoryIndex(val) {
    let closestIdx = 0;
    let minDiff = Math.abs(val - categories[0]);
    for (let i = 1; i < numCategories; i++) {
      const diff = Math.abs(val - categories[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    return closestIdx;
  }

  const n = raterA.length;
  const idxA = raterA.map(toCategoryIndex);
  const idxB = raterB.map(toCategoryIndex);

  // Build weight matrix W (quadratic weights)
  const W = Array.from({ length: numCategories }, () => new Array(numCategories).fill(0));
  for (let i = 0; i < numCategories; i++) {
    for (let j = 0; j < numCategories; j++) {
      W[i][j] = Math.pow(i - j, 2) / Math.pow(numCategories - 1, 2);
    }
  }

  // Build observed matrix O
  const O = Array.from({ length: numCategories }, () => new Array(numCategories).fill(0));
  for (let k = 0; k < n; k++) {
    O[idxA[k]][idxB[k]] += 1;
  }

  // Build expected matrix E from marginal histograms
  const histA = new Array(numCategories).fill(0);
  const histB = new Array(numCategories).fill(0);
  for (let k = 0; k < n; k++) {
    histA[idxA[k]] += 1;
    histB[idxB[k]] += 1;
  }

  const E = Array.from({ length: numCategories }, () => new Array(numCategories).fill(0));
  for (let i = 0; i < numCategories; i++) {
    for (let j = 0; j < numCategories; j++) {
      E[i][j] = (histA[i] * histB[j]) / n;
    }
  }

  // Calculate num and den
  let num = 0;
  let den = 0;
  for (let i = 0; i < numCategories; i++) {
    for (let j = 0; j < numCategories; j++) {
      num += W[i][j] * O[i][j];
      den += W[i][j] * E[i][j];
    }
  }

  if (den === 0) return 1.0;
  return 1 - (num / den);
}

// Statistical Helpers
function getRanks(x) {
  const n = x.length;
  const sorted = x.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  const ranks = new Array(n);
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n && sorted[j].val === sorted[i].val) {
      j++;
    }
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) {
      ranks[sorted[k].idx] = avgRank;
    }
    i = j;
  }
  return ranks;
}

function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n === 0) return 0;
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
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

function spearmanCorrelation(x, y) {
  const rx = getRanks(x);
  const ry = getRanks(y);
  return pearsonCorrelation(rx, ry);
}

function kendallTau(x, y) {
  const n = x.length;
  if (n < 2) return 0;
  let nc = 0;
  let nd = 0;
  let tx = 0;
  let ty = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = x[i] - x[j];
      const dy = y[i] - y[j];
      const prod = dx * dy;
      if (prod > 0) {
        nc++;
      } else if (prod < 0) {
        nd++;
      } else {
        if (dx === 0 && dy !== 0) tx++;
        else if (dy === 0 && dx !== 0) ty++;
      }
    }
  }
  const numerator = nc - nd;
  const den1 = nc + nd + tx;
  const den2 = nc + nd + ty;
  if (den1 === 0 || den2 === 0) return 0;
  return numerator / Math.sqrt(den1 * den2);
}

async function run() {
  // 1. Read FIXED Ground Truth Dosen from IF23A_cleaned_trinary.csv
  const trinaryCsvPath = path.join(__dirname, "../docs/IF23A_cleaned_trinary.csv");
  const trinaryContent = fs.readFileSync(trinaryCsvPath, "utf8");
  const trinaryLines = trinaryContent.split("\n").map(l => l.trim()).filter(Boolean);

  const groundTruthDosenMap = {};
  for (let i = 1; i < trinaryLines.length; i++) {
    const parts = trinaryLines[i].split(",");
    if (parts.length >= 4) {
      const nim = parts[0].trim();
      const skorDosen = parseFloat(parts[parts.length - 2]);
      groundTruthDosenMap[nim] = skorDosen;
    }
  }

  console.log(`Loaded ${Object.keys(groundTruthDosenMap).length} FIXED Ground Truth Dosen scores from Trinary benchmark.`);

  // 2. Fetch AI scores for all 4 strategies
  const results = {};

  for (const [strategyName, assignmentId] of Object.entries(ASSIGNMENTS)) {
    const { data: subs, error } = await supabase
      .from("submissions")
      .select("nim, ai_score")
      .eq("assignment_id", assignmentId);

    if (error || !subs) {
      console.error(`Failed to fetch submissions for ${strategyName}:`, error);
      continue;
    }

    const aiScores = [];
    const dosenScores = [];

    subs.forEach(s => {
      if (s.ai_score !== null && groundTruthDosenMap[s.nim] !== undefined) {
        aiScores.push(s.ai_score);
        dosenScores.push(groundTruthDosenMap[s.nim]);
      }
    });

    const n = aiScores.length;
    const r = pearsonCorrelation(aiScores, dosenScores);
    const rho = spearmanCorrelation(aiScores, dosenScores);
    const tau = kendallTau(aiScores, dosenScores);
    const qwk = quadraticWeightedKappa(aiScores, dosenScores);
    const mae = aiScores.reduce((acc, val, idx) => acc + Math.abs(val - dosenScores[idx]), 0) / n;

    results[strategyName] = {
      n,
      pearson: r,
      spearman: rho,
      kendall: tau,
      qwk,
      mae
    };
  }

  console.log("\n=========================================================================================");
  console.log("STANDARDIZED COMPARISON WITH FIXED GROUND TRUTH DOSEN & QWK METRIC");
  console.log("=========================================================================================\n");
  console.table(results);
}

run();
