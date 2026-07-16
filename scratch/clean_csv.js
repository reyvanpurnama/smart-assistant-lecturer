const fs = require("fs");
const path = require("path");

const csvPath = path.join(__dirname, "../docs/IF23A.xlsx - Praktikum 2 - DBMS & Dasar MySQ.csv");
const cleanedCsvPath = path.join(__dirname, "../docs/IF23A_cleaned.csv");

// List of outliers to be removed (using names matching the spreadsheet)
const outliers = [
  "Melani Anggraena",
  "Tia Pebriyanti",
  "Muhammad Lutfi Ari Saputra"
];

function cleanCsv() {
  if (!fs.existsSync(csvPath)) {
    console.error("CSV file not found:", csvPath);
    return;
  }

  const fileContent = fs.readFileSync(csvPath, "utf8");
  const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");

  // Column weights for academic columns (indices 2 to 13)
  const weights = [10, 10, 10, 10, 10, 10, 5, 5, 5, 5, 10, 10];
  
  const cleanedRows = [];

  // Header row - only keeping No, Mahasiswa, and Total
  cleanedRows.push(["No", "Mahasiswa", "Total"].join(","));

  let activeIndex = 1;
  for (let i = 2; i < lines.length; i++) {
    const row = lines[i].split(",");
    if (row.length < 2) continue;

    const name = row[1].trim();
    if (!name) continue;

    // Filter out non-submitters
    let hasSubmission = false;
    const academicValues = [];
    for (let j = 2; j <= 13; j++) {
      const val = row[j] ? row[j].trim().toUpperCase() : "FALSE";
      academicValues.push(val);
      if (val === "TRUE") {
        hasSubmission = true;
      }
    }

    if (!hasSubmission) {
      console.log(`Filtering out non-submitter: ${name}`);
      continue;
    }

    // Filter out outliers
    if (outliers.some(o => name.toLowerCase() === o.toLowerCase())) {
      console.log(`Filtering out outlier: ${name}`);
      continue;
    }

    // Calculate new academic total (without late submission penalties)
    let academicTotal = 0;
    for (let j = 0; j < academicValues.length; j++) {
      if (academicValues[j] === "TRUE") {
        academicTotal += weights[j];
      }
    }

    // Build the cleaned row (No, Mahasiswa, Total)
    const newRow = [
      activeIndex++,
      name,
      academicTotal
    ];

    cleanedRows.push(newRow.join(","));
  }

  fs.writeFileSync(cleanedCsvPath, cleanedRows.join("\n"), "utf8");
  console.log(`\nSuccessfully cleaned CSV. Cleaned file saved to: docs/IF23A_cleaned.csv`);
  console.log(`Total students in cleaned list: ${activeIndex - 1}`);
}

cleanCsv();
