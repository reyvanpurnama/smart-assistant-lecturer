# Smart Assistant Lecturer (SAL) - Development & Audit Summary

Dokumen ini merangkum seluruh pencapaian, perbaikan database, audit data mahasiswa berbasis bukti OCR, serta arsitektur prompt grading engine pada proyek **Smart Assistant Lecturer (SAL)**. Dokumentasi ini ditujukan sebagai panduan kontekstual bagi pengembang atau agen AI berikutnya.

---

## 📋 1. Status Akhir Dataset & Data Cleaning

Untuk kebutuhan keandalan data statistik pada Bab 4 Skripsi, pembersihan data (*data cleaning*) dilakukan untuk menyingkirkan *outliers* / anomali data:

1. **Mahasiswa yang Dihapus dari Dataset (Outliers):**
   * **Melani Anggraena (230102073)**: Tidak menyertakan sintaks SQL (hanya screenshot kosong).
   * **Tia Pebriyanti (230102125)**: Tidak menyertakan sintaks SQL (hanya screenshot kosong).
   * **Muhammad Lutfi Ari Saputra (230102068)**: Tidak memiliki representasi kode SQL yang valid.
2. **Ukuran Dataset Akhir:** **33 mahasiswa** yang terbukti memiliki jawaban tertulis atau tangkapan layar query yang valid.

---

## 🔍 2. Hasil Audit Nilai Mahasiswa (Berdasarkan Bukti OCR)

Audit mendalam dilakukan terhadap mahasiswa dengan nilai di bawah 80 dengan mencocokkan teks jawaban dengan laporan ekstraksi OCR dari screenshot Workbench mereka:

| NIM | Nama Mahasiswa | Nilai Lama | Nilai Baru | Bukti Temuan OCR & Tindakan |
| :--- | :--- | :---: | :---: | :--- |
| **230102042** | Fahmi Maulana Sitakar | 63 | **91.0** | Terbukti menjalankan 3 query `SELECT` pada screenshot Workbench (16:17:55 & 14:52:11). Query diinjeksi ke DB dan di-regrade. |
| **230102070** | Makbul Insan Darojat | 76 | **88.0** | Terbukti menjalankan query `UPDATE` pada screenshot 7 Workbench (14:37:15). Teks query diperbaiki di DB dan di-regrade. |
| **230102027** | Aulia Marwah Kandari | 78 | **83.4** | Penalti `INSERT` (4/10) dihapus karena query tanpa kutip pada NIM (`12345`) tetap sukses di MySQL. Teks diformalkan dan di-regrade. |
| **230102035** | DESTI NOVIANTY | 78 | **78.0** | Nilai tetap karena penulisan query `SELECT` terpotong (tanpa kata kunci SELECT) dan query `DELETE` diganti `SELECT` di laporan serta Workbench. |
| **230102065** | Luthfi Fauzan | 79 | **79.0** | Nilai tetap karena kesalahan sintaks fatal (`CREATE TABLE` tanpa PRIMARY KEY & kolom `im` bukan `nim`). |

---

## 💾 3. Perbaikan Database & Optimasi Supabase

Untuk menanggulangi pembatasan akses RLS (*Row-Level Security*) Supabase saat dijalankan dari script lokal, SQL berikut telah dieksekusi di Supabase SQL Editor:

1. **Penambahan Policy RLS Baru:**
   * Membuka akses `DELETE` untuk tabel `submissions`.
   * Membuka akses `UPDATE` dan `DELETE` untuk tabel `rubric_scores`.
2. **Pembersihan Data Duplikat (`rubric_scores`):**
   Penyebab duplikasi data rubrik saat re-grading berulang diselesaikan secara instan menggunakan query CTE berikut:
   ```sql
   DELETE FROM public.rubric_scores 
   WHERE id IN (
       SELECT id 
       FROM (
           SELECT id, 
                  ROW_NUMBER() OVER (PARTITION BY submission_id, aspect_name ORDER BY id) as rn
           FROM public.rubric_scores
       ) t 
       WHERE t.rn > 1
   );
   ```

---

## 🧠 4. Arsitektur Prompt Modular Grading Engine

Penilaian menggunakan pendekatan **Structured Prompting** dan **Chain-of-Thought (CoT)** yang tersusun atas modul-modul berikut:

1. **Role Module (`### [ROLE]`)**: Menetapkan peran AI sebagai asisten dosen yang adil dan teliti.
2. **Task Module (`### [TASK]`)**: Langkah-langkah evaluasi logika, komparasi data, penilaian per aspek (skala 0-100), dan skor holistik.
3. **Academic Context Module (`### Area Context Grounding`)**:
   * `[CRITERIA]`: Kriteria rubrik dan bobot % dinamis.
   * `[CONTEXT]`: **Ground Truth + Aturan Toleransi** (tipe data setara, case-insensitivity, opsionalitas titik koma, filter fleksibel).
   * `[SOAL_ESAI]`: Soal ujian asli.
4. **Input Data Module (`### [INPUT_DATA]`)**: Jawaban teks mahasiswa (hasil sinkronisasi OCR).
5. **Output Format Module (`### [OUTPUT_FORMAT]`)**: Validasi output ketat wajib berupa JSON untuk parsing otomatis ke database.

---

## 🚀 5. Panduan Penggunaan Script Lokal

* **Menjalankan Re-grading:**
  ```bash
  npx tsx scratch/grade_all_submissions.ts
  ```
  *(Catatan: Script ini secara otomatis mendeteksi mahasiswa yang kolom `ai_score`-nya bernilai `null` dan melakukan pemanggilan API LLM dengan jeda/delay 30 detik untuk menghindari Rate Limit).*
