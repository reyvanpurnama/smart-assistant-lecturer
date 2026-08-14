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
  // 1. Create strict reference context
  const strictReferenceContext = `DOKUMEN ACUAN DAN PANDUAN PENILAIAN KETAT (STRICT EVALUATION):

1. PEMBUATAN DATABASE
Sintaks Standar: CREATE DATABASE universitas;
Aturan Ketat:
- Harus membuat database bernama 'universitas'.

2. PEMBUATAN TABEL
Sintaks Standar: 
CREATE TABLE mahasiswa (
  nim VARCHAR(10) PRIMARY KEY,
  nama VARCHAR(100),
  jurusan VARCHAR(50),
  angkatan YEAR,
  ipk DECIMAL(3,2)
);
Aturan Ketat:
- Nama kolom primary key WAJIB 'nim' (kesalahan ejaan seperti 'im' tidak ditoleransi dan diberi nilai 0 untuk aspek ini).
- Kolom 'nim' WAJIB diset sebagai PRIMARY KEY.
- Tipe data kolom nim harus VARCHAR (atau CHAR).
- Kolom angkatan harus bertipe YEAR atau INTEGER/INT.
- Seluruh kolom yang diminta (nim, nama, jurusan, angkatan, ipk) wajib ada.

3. MENAMBAHKAN DATA
Sintaks Standar:
INSERT INTO mahasiswa (nim, nama, jurusan, angkatan, ipk) VALUES 
('12345', 'Ali Hasan', 'Informatika', 2021, 3.75),
('12346', 'Budi Santoso', 'Sistem Informasi', 2022, 3.60),
('12347', 'Citra Dewi', 'Teknik Komputer', 2020, 3.85);
Aturan Ketat:
- Karena NIM bertipe VARCHAR, maka seluruh nilai NIM ('12345', '12346', '12347') WAJIB menggunakan tanda kutip. Jika ditulis tanpa tanda kutip (misal: 12345), maka query dianggap tidak valid secara standar SQL dan diberikan nilai maksimum 50 untuk aspek ini.
- Ketiga baris data wajib dimasukkan dengan benar.

4. MEMBACA DATA
Sintaks Standar:
- Query 1: SELECT * FROM mahasiswa;
- Query 2: SELECT * FROM mahasiswa WHERE jurusan = 'Informatika';
- Query 3: SELECT * FROM mahasiswa WHERE ipk > 3.7;
Aturan Ketat:
- Ketiga query SELECT harus tertulis lengkap dengan kata kunci SELECT, FROM, dan WHERE yang valid.

5. MEMPERBARUI DATA
Sintaks Standar: UPDATE mahasiswa SET ipk = 3.8 WHERE nim = '12346';
Aturan Ketat:
- Sintaks dasar UPDATE-SET-WHERE harus terpenuhi dengan benar sesuai data yang diminta.

6. MENGHAPUS DATA
Sintaks Standar: DELETE FROM mahasiswa WHERE nama = 'Citra Dewi';
Aturan Ketat:
- Mahasiswa WAJIB menghapus data berdasarkan Nama sesuai instruksi soal: WHERE nama = 'Citra Dewi'. Jika menghapus berdasarkan NIM (WHERE nim = '12347'), berikan skor maksimal 50 untuk aspek ini karena tidak mengikuti spesifikasi filter soal.

7. MENGUBAH STRUKTUR TABEL
Sintaks Standar:
- Langkah 1: ALTER TABLE mahasiswa ADD tanggal_lahir DATE;
- Langkah 2: Tiga query UPDATE untuk masing-masing mahasiswa.
Aturan Ketat:
- Mahasiswa WAJIB menambahkan kolom tanggal_lahir dan mengupdate nilai tanggal lahir untuk KETIGA mahasiswa secara lengkap (3 query UPDATE). Jika hanya 2 mahasiswa yang diupdate, berikan nilai maksimal 70. Jika hanya 1 mahasiswa, berikan nilai maksimal 40. Jika tidak ada update, berikan nilai 0 untuk sub-aspek update ini.`;

  // 2. Fetch original assignment question
  const { data: origAssign, error: origErr } = await supabase
    .from("assignments")
    .select("question")
    .eq("id", "a9a632e2-8adb-432c-b001-29b95f19f7aa")
    .single();

  if (origErr || !origAssign) {
    console.error("Gagal mengambil data tugas asli:", origErr);
    return;
  }

  // 3. Insert new assignment
  const { data: newAssign, error: insertErr } = await supabase
    .from("assignments")
    .insert({
      title: "Praktikum 1: Konsep DBMS dan Dasar SQL (Strict)",
      course_code: "IF204",
      model: "openai/gpt-oss-120b",
      question: origAssign.question,
      reference_context: strictReferenceContext
    })
    .select("id")
    .single();

  if (insertErr || !newAssign) {
    console.error("Gagal membuat tugas baru:", insertErr);
    return;
  }

  const newAssignmentId = newAssign.id;
  console.log(`Berhasil membuat tugas baru dengan ID: ${newAssignmentId}`);

  // 4. Insert Rubrics
  const strictRubrics = [
    {
      assignment_id: newAssignmentId,
      aspect_name: "Penerapan CREATE DATABASE",
      weight: 10,
      description: "Kebenaran pembuatan database 'universitas' secara tepat."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "Penerapan CREATE TABLE",
      weight: 10,
      description: "Kebenaran pembuatan tabel 'mahasiswa' dengan kolom nim (wajib PK dan VARCHAR), nama, jurusan, angkatan, ipk. Kesalahan nama kolom 'nim' tidak ditoleransi."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "Penerapan INSERT DATA",
      weight: 10,
      description: "Kebenaran query memasukkan ketiga data mahasiswa. Nilai NIM wajib diberi tanda kutip."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "Penerapan SELECT / READ DATA",
      weight: 30,
      description: "Kebenaran logika dan sintaks dari ketiga query pemanggilan data secara lengkap."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "Penerapan UPDATE DATA",
      weight: 10,
      description: "Kebenaran query perubahan IPK mahasiswa dengan NIM '12346' menjadi 3.8."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "Penerapan DELETE DATA",
      weight: 10,
      description: "Kebenaran query penghapusan data mahasiswa dengan nama 'Citra Dewi'. Wajib menggunakan filter WHERE nama = 'Citra Dewi' (penggunaan filter NIM diberi nilai maksimal 50)."
    },
    {
      assignment_id: newAssignmentId,
      aspect_name: "Penerapan ALTER TABLE",
      weight: 20,
      description: "Kebenaran modifikasi struktur tabel (ALTER ADD) dan update tanggal lahir secara lengkap untuk ketiga mahasiswa (wajib 3 update terpisah, jika kurang akan diberi penalti)."
    }
  ];

  const { error: rubricErr } = await supabase.from("rubrics").insert(strictRubrics);
  if (rubricErr) {
    console.error("Gagal menginsert rubrik baru:", rubricErr);
    return;
  }
  console.log("Berhasil membuat rubrik ketat untuk tugas baru.");

  // 5. Copy Submissions
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
