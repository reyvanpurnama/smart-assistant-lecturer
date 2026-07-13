import { createClient } from "@supabase/supabase-js";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";

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

async function processAll() {
  const listPath = path.join(process.cwd(), "scratch/all_submissions_list.json");
  if (!fs.existsSync(listPath)) {
    console.error("List submissions tidak ditemukan di scratch/all_submissions_list.json");
    return;
  }

  const submissions = JSON.parse(fs.readFileSync(listPath, "utf8"));
  
  const docsDir = path.join(process.cwd(), "scratch/downloaded_docs");
  const reportsDir = path.join(process.cwd(), "scratch/ocr_reports");
  
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

  console.log(`Memulai unduh, ekstraksi gambar, dan OCR untuk ${submissions.length} mahasiswa...`);

  for (let i = 0; i < submissions.length; i++) {
    const sub = submissions[i];
    const cleanName = sub.student_name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    
    console.log(`\n==================================================`);
    console.log(`[${i + 1}/${submissions.length}] Mahasiswa: ${sub.student_name} (${sub.nim})`);
    console.log(`==================================================`);

    if (!sub.file_path) {
      console.log("- Tidak ada file_path untuk mahasiswa ini. Skip.");
      continue;
    }

    const ext = path.extname(sub.file_path).toLowerCase();
    const localFilename = `${sub.nim}_${cleanName}${ext}`;
    const localDocPath = path.join(docsDir, localFilename);

    // 1. Download file jika belum ada
    if (!fs.existsSync(localDocPath)) {
      console.log(`- Mengunduh file dari Storage...`);
      const { data, error } = await supabase.storage
        .from("student-submissions")
        .download(sub.file_path);

      if (error || !data) {
        console.error(`  Gagal mengunduh:`, error?.message || "Data kosong");
        continue;
      }
      fs.writeFileSync(localDocPath, Buffer.from(await data.arrayBuffer()));
      console.log(`  Sukses diunduh.`);
    } else {
      console.log(`- File dokumen sudah ada di lokal.`);
    }

    // 2. Ekstrak gambar
    const imageDir = path.join(docsDir, `${sub.nim}_extracted_images`);
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
      console.log(`- Mengekstrak gambar dari dokumen...`);
      try {
        if (ext === ".pdf") {
          execSync(`pdfimages -png "${localDocPath}" "${path.join(imageDir, "img")}"`);
        } else if (ext === ".docx") {
          // Unzip media folder
          execSync(`unzip -o "${localDocPath}" "word/media/*" -d "${imageDir}" 2>/dev/null || true`);
        }
        console.log(`  Ekstraksi gambar selesai.`);
      } catch (err: any) {
        console.error(`  Gagal mengekstrak gambar:`, err.message);
      }
    } else {
      console.log(`- Folder ekstraksi gambar sudah ada.`);
    }

    // Cari semua file gambar di dalam folder ekstraksi
    const images: string[] = [];
    const findImages = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const list = fs.readdirSync(dir);
      for (const item of list) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          findImages(fullPath);
        } else if (item.endsWith(".png") || item.endsWith(".jpg") || item.endsWith(".jpeg")) {
          images.push(fullPath);
        }
      }
    };
    findImages(imageDir);
    images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    console.log(`- Ditemukan ${images.length} gambar screenshot.`);

    // 3. Jalankan OCR
    const reportPath = path.join(reportsDir, `ocr_report_${sub.nim}.txt`);
    if (fs.existsSync(reportPath)) {
      console.log(`- Laporan OCR untuk mahasiswa ini sudah ada. Skip OCR.`);
      continue;
    }

    let compiledText = `==================================================\n`;
    compiledText += `OCR SCREENSHOT EXTRACTION REPORT\n`;
    compiledText += `Nama: ${sub.student_name}\n`;
    compiledText += `NIM: ${sub.nim}\n`;
    compiledText += `Tanggal Ekstraksi: ${new Date().toLocaleString()}\n`;
    compiledText += `==================================================\n\n`;

    for (let imgIdx = 0; imgIdx < images.length; imgIdx++) {
      const imgPath = images[imgIdx];
      const basename = path.basename(imgPath);
      console.log(`  - OCR [${imgIdx + 1}/${images.length}]: ${basename}...`);
      try {
        const { data: { text } } = await Tesseract.recognize(imgPath, "eng");
        compiledText += `### SCREENSHOT ${imgIdx + 1} (${basename})\n`;
        compiledText += `--------------------------------------------------\n`;
        compiledText += `${text.trim() || "[No text detected]"}\n`;
        compiledText += `--------------------------------------------------\n\n`;
      } catch (err: any) {
        console.error(`    Gagal OCR ${basename}:`, err.message);
        compiledText += `### SCREENSHOT ${imgIdx + 1} (${basename})\n`;
        compiledText += `[Error: ${err.message}]\n\n`;
      }
    }

    fs.writeFileSync(reportPath, compiledText, "utf8");
    console.log(`- Menyimpan laporan OCR ke: ${reportPath}`);
  }

  console.log("\nProses ekstraksi & OCR seluruh dokumen selesai!");
}

processAll();
