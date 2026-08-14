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
  const strictBinaryReferenceContext = `DOKUMEN ACUAN DAN PANDUAN PENILAIAN BINER KETAT (STRICT BINARY EVALUATION):

### ATURAN UTAMA PENILAIAN BINER:
Setiap aspek penilaian harus dinilai secara BINER (Hanya boleh diberi skor 0 ATAU 100).
- Berikan skor 100 jika aspek terpenuhi sepenuhnya dan tidak ada kesalahan sintaks atau kelalaian.
- Berikan skor 0 jika ada kesalahan sekecil apa pun, tidak lengkap, atau tidak memenuhi instruksi.
- DILARANG keras memberikan nilai di antara 0 dan 100 (misalnya 50, 70, 80, dll.).

### SPESIFIKASI DAN KUNCI JAWABAN KETAT:

1. CREATE DATABASE (Bobot 10%)
- Mahasiswa wajib menuliskan query: CREATE DATABASE universitas; (atau use universitas;).
- Nama database wajib 'universitas'.

2. CREATE TABLE (Bobot 10%)
- Query: CREATE TABLE mahasiswa ( ... );
- Nama kolom primary key WAJIB 'nim' (kesalahan ejaan seperti 'im' tidak ditoleransi dan langsung dinilai 0).
- Kolom 'nim' WAJIB dideklarasikan sebagai PRIMARY KEY.
- Tipe data nim wajib VARCHAR atau CHAR.

3. INSERT DATA (Bobot 10%)
- Query: INSERT INTO mahasiswa ... VALUES ...
- Wajib memasukkan ketiga baris data mahasiswa (Ali Hasan, Budi Santoso, Citra Dewi) secara lengkap.
- Nilai NIM ('12345', '12346', '12347') WAJIB menggunakan tanda kutip. Jika ditulis tanpa tanda kutip (misal: 12345), berikan nilai 0 untuk aspek ini.

4. READ DATA - Query 1 (Bobot 10%)
- Query: SELECT * FROM mahasiswa; (untuk menampilkan semua data).

5. READ DATA - Query 2 (Bobot 10%)
- Query: SELECT * FROM mahasiswa WHERE jurusan = 'Informatika'; (atau sejenisnya untuk filter Informatika).

6. READ DATA - Query 3 (Bobot 10%)
- Query: SELECT * FROM mahasiswa WHERE ipk > 3.7; (untuk filter IPK > 3.7).

7. UPDATE DATA - Query (Bobot 5%)
- Query: UPDATE mahasiswa SET ipk = 3.8 WHERE nim = '12346'; (atau filter yang benar).

8. UPDATE DATA - Screenshot (Bobot 5%)
- Mahasiswa wajib menyertakan bukti screenshot/running query (misalnya teks 'Screenshot hasil running query' atau bukti gambar). Jika tidak ada, berikan nilai 0.

9. DELETE DATA - Query (Bobot 5%)
- Query wajib menggunakan filter nama: DELETE FROM mahasiswa WHERE nama = 'Citra Dewi';
- Jika mahasiswa melakukan penghapusan menggunakan filter NIM (WHERE nim = '12347'), berikan nilai 0 untuk aspek ini karena tidak mengikuti instruksi spesifik soal (Hapus berdasarkan Nama).

10. DELETE DATA - Screenshot (Bobot 5%)
- Mahasiswa wajib menyertakan bukti screenshot/running query (misalnya teks 'Screenshot hasil running query' atau bukti gambar). Jika tidak ada, berikan nilai 0.

11. ALTER TABLE - Add Column (Bobot 10%)
- Query: ALTER TABLE mahasiswa ADD tanggal_lahir DATE; (atau tipe DATE lainnya).

12. ALTER TABLE - Update Data (Bobot 10%)
- Mahasiswa wajib menuliskan query UPDATE tanggal_lahir secara lengkap untuk KETIGA mahasiswa (3 query UPDATE terpisah). Jika jumlah query UPDATE kurang dari 3 (misal hanya 2 atau 1), berikan nilai 0 untuk aspek ini.`;

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
      title: "Praktikum 1: Konsep DBMS dan Dasar SQL (Binary)",
      course_code: "IF204",
      model: "openai/gpt-oss-120b",
      question: origAssign.question,
      reference_context: strictBinaryReferenceContext
    })
    .select("id")
    .single();

  if (insertErr || !newAssign) {
    console.error("Gagal membuat tugas baru:", insertErr);
    return;
  }

  const newAssignmentId = newAssign.id;
  console.log(`Berhasil membuat tugas baru dengan ID: ${newAssignmentId}`);

  // 3. Insert Rubrics matching spreadsheet columns
  const binaryRubrics = [
    {
      assignment_id: newAssignmentId,
      aspect_name: "CREATE DATABASE",
      weight: 10,
      description: "Pembuatan database universitas. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "CREATE TABLE",
      weight: 10,
      description: "Pembuatan tabel mahasiswa (wajib PK nim dan VARCHAR). Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "INSERT",
      weight: 10,
      description: "Insert 3 data mahasiswa. NIM wajib menggunakan tanda kutip. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "READ - Query 1",
      weight: 10,
      description: "Query SELECT untuk menampilkan semua data mahasiswa. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "READ - Query 2",
      weight: 10,
      description: "Query SELECT untuk menampilkan mahasiswa jurusan Informatika. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "READ - Query 3",
      weight: 10,
      description: "Query SELECT untuk menampilkan mahasiswa dengan IPK > 3.7. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "UPDATE - Query",
      weight: 5,
      description: "Query UPDATE IPK mahasiswa NIM 12346 menjadi 3.8. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "UPDATE - Screenshot",
      weight: 5,
      description: "Bukti/teks screenshot eksekusi query update. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "DELETE - Query",
      weight: 5,
      description: "Query DELETE mahasiswa Citra Dewi (wajib filter WHERE nama = 'Citra Dewi'). Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "DELETE - Screenshot",
      weight: 5,
      description: "Bukti/teks screenshot eksekusi query delete. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "ALTER - Add Column",
      weight: 10,
      description: "Query ALTER TABLE ADD tanggal_lahir. Harus bernilai biner: 0 atau 100."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "ALTER - Update Data",
      weight: 10,
      description: "Query UPDATE tanggal lahir lengkap untuk ketiga data mahasiswa. Harus bernilai biner: 0 atau 100."
    }
  ];

  const { error: rubricErr } = await supabase.from("rubrics").insert(binaryRubrics);
  if (rubricErr) {
    console.error("Gagal menginsert rubrik baru:", rubricErr);
    return;
  }
  console.log("Berhasil membuat rubrik biner untuk tugas baru.");

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
