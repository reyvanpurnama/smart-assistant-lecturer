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

async function run() {
  const trinaryReferenceContext = `DOKUMEN ACUAN DAN PANDUAN PENILAIAN BERTINGKAT (TRINARY EVALUATION):

### ATURAN UTAMA PENILAIAN BERTINGKAT (TRINARY):
Setiap aspek penilaian dinilai menggunakan tiga kemungkinan nilai mentah (raw score):
- 100: Terpenuhi sepenuhnya tanpa ada kesalahan sintaks atau kelalaian.
- 50: Terpenuhi sebagian (ada typo ejaan, kelalaian tanda kutip, atau tidak ada screenshot bukti running tetapi kodenya secara logika benar).
- 0: Salah total, tidak lengkap, atau tidak mengumpulkan.
DILARANG memberikan skor di luar 0, 50, dan 100 untuk setiap aspek rubrik.

### SPESIFIKASI KUNCI JAWABAN DAN TOLERANSI:

1. CREATE DATABASE (Bobot 10%)
- Skor 100: Query CREATE DATABASE universitas; lengkap.
- Skor 50: Membuat database tapi nama tidak sesuai (misal 'db_mahasiswa').
- Skor 0: Tidak membuat query database.

2. CREATE TABLE (Bobot 10%)
- Skor 100: Query CREATE TABLE mahasiswa lengkap dengan primary key 'nim' bertipe VARCHAR/CHAR.
- Skor 50: Ada kesalahan ejaan kecil (misal typo 'im' alih-alih 'nim'), atau tipe data nim tidak sesuai.
- Skor 0: Tidak membuat tabel.

3. INSERT DATA (Bobot 10%)
- Skor 100: Memasukkan data ketiga mahasiswa secara lengkap dengan NIM menggunakan tanda kutip.
- Skor 50: Memasukkan data lengkap tapi NIM ditulis tanpa tanda kutip (misal 12345), atau hanya memasukkan 2 dari 3 data mahasiswa.
- Skor 0: Tidak memasukkan data atau salah total.

4. READ DATA - Query 1 (Bobot 10%)
- Skor 100: Query SELECT * FROM mahasiswa; lengkap.
- Skor 50: Query SELECT salah penulisan kolom tapi secara sintaks SQL valid.
- Skor 0: Tidak ada query SELECT 1.

5. READ DATA - Query 2 (Bobot 10%)
- Skor 100: Query SELECT * FROM mahasiswa WHERE jurusan = 'Informatika'; lengkap.
- Skor 50: Menggunakan filter jurusan lain atau salah penulisan literal string.
- Skor 0: Tidak ada query SELECT 2.

6. READ DATA - Query 3 (Bobot 10%)
- Skor 100: Query SELECT * FROM mahasiswa WHERE ipk > 3.7; lengkap.
- Skor 50: Salah operator perbandingan (misal >= 3.7 atau > 3.5).
- Skor 0: Tidak ada query SELECT 3.

7. UPDATE DATA (Bobot 10%)
- Skor 100: Query UPDATE IPK mahasiswa NIM 12346 menjadi 3.8 lengkap DAN menyertakan bukti screenshot/teks running.
- Skor 50: Query UPDATE benar tetapi tidak menyertakan screenshot/teks running, atau query UPDATE salah sintaks sedikit tetapi logika pembaruan benar.
- Skor 0: Tidak ada query UPDATE.

8. DELETE DATA (Bobot 10%)
- Skor 100: Query DELETE FROM mahasiswa WHERE nama = 'Citra Dewi'; lengkap DAN menyertakan bukti screenshot/teks running.
- Skor 50: Query DELETE benar tetapi tidak menyertakan screenshot/teks running, atau menggunakan filter NIM (WHERE nim = '12347') alih-alih nama.
- Skor 0: Tidak ada query DELETE.

9. ALTER TABLE - Add Column (Bobot 10%)
- Skor 100: Query ALTER TABLE mahasiswa ADD tanggal_lahir DATE; lengkap.
- Skor 50: Menambahkan kolom dengan tipe data non-DATE, atau ejaan nama kolom salah.
- Skor 0: Tidak ada query ALTER ADD.

10. ALTER TABLE - Update Data (Bobot 10%)
- Skor 100: Query UPDATE tanggal_lahir lengkap untuk ketiga mahasiswa (3 query UPDATE terpisah).
- Skor 50: Melakukan update tetapi kurang dari 3 mahasiswa (hanya 1 atau 2 data mahasiswa).
- Skor 0: Tidak ada query UPDATE tanggal lahir.`;

  // 1. Fetch original assignment question
  const { data: origAssign, error: origErr } = await supabase
    .from("assignments")
    .select("question")
    .eq("id", "a9a632e2-8adb-432c-b001-29b95f19f7aa")
    .single();

  if (origErr || !origAssign) {
    console.error("Gagal mengambil data tugas asli:", origErr);
    return;
  }

  // 2. Insert new assignment
  const { data: newAssign, error: insertErr } = await supabase
    .from("assignments")
    .insert({
      title: "Praktikum 1: Konsep DBMS dan Dasar SQL (Trinary)",
      course_code: "IF204",
      model: "openai/gpt-oss-120b",
      question: origAssign.question,
      reference_context: trinaryReferenceContext
    })
    .select("id")
    .single();

  if (insertErr || !newAssign) {
    console.error("Gagal membuat tugas baru:", insertErr);
    return;
  }

  const newAssignmentId = newAssign.id;
  console.log(`Berhasil membuat tugas baru dengan ID: ${newAssignmentId}`);

  // 3. Insert Rubrics matching 10 aspects of 10%
  const trinaryRubrics = [
    {
      assignment_id: newAssignmentId,
      aspect_name: "CREATE DATABASE",
      weight: 10,
      description: "Pembuatan database universitas. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "CREATE TABLE",
      weight: 10,
      description: "Pembuatan tabel mahasiswa (wajib PK nim). Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "INSERT",
      weight: 10,
      description: "Insert 3 data mahasiswa. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "READ - Query 1",
      weight: 10,
      description: "Query SELECT menampilkan semua data. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "READ - Query 2",
      weight: 10,
      description: "Query SELECT menampilkan mahasiswa jurusan Informatika. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "READ - Query 3",
      weight: 10,
      description: "Query SELECT menampilkan mahasiswa dengan IPK > 3.7. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "UPDATE (Query & SS)",
      weight: 10,
      description: "Query UPDATE IPK mahasiswa NIM 12346 menjadi 3.8 dan bukti screenshot. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "DELETE (Query & SS)",
      weight: 10,
      description: "Query DELETE mahasiswa Citra Dewi (filter nama) dan bukti screenshot. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "ALTER - Add Column",
      weight: 10,
      description: "Query ALTER TABLE ADD tanggal_lahir. Skor bertingkat: 0, 50, atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "ALTER - Update Data",
      weight: 10,
      description: "Query UPDATE tanggal lahir lengkap untuk ketiga data mahasiswa. Skor bertingkat: 0, 50, atau 100."
    }
  ];

  const { error: rubricErr } = await supabase.from("rubrics").insert(trinaryRubrics);
  if (rubricErr) {
    console.error("Gagal menginsert rubrik baru:", rubricErr);
    return;
  }
  console.log("Berhasil membuat rubrik trinary untuk tugas baru.");

  // 4. Copy Submissions
  const { data: oldSubmissions, error: subErr } = await supabase
    .from("submissions")
    .select("nim, student_name, raw_answer_text, file_path")
    .eq("assignment_id", "a9a632e2-8adb-432c-b001-29b95f19f7aa");

  if (subErr || !oldSubmissions) {
    console.error("Gagal mengambil submissions lama:", subErr);
    return;
  }

  const newSubmissions = oldSubmissions.map(sub => ({
    assignment_id: newAssignmentId,
    nim: sub.nim,
    student_name: sub.student_name,
    raw_answer_text: sub.raw_answer_text,
    file_path: sub.file_path,
    ai_score: null,
    final_score: null,
    status: "Graded",
    cot_log: null
  }));

  const { error: copySubErr } = await supabase.from("submissions").insert(newSubmissions);
  if (copySubErr) {
    console.error("Gagal menyalin submissions ke tugas baru:", copySubErr);
    return;
  }
  console.log(`Berhasil menyalin ${newSubmissions.length} submissions ke tugas baru.`);
}

run();
