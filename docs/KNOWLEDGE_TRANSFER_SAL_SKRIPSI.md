# Knowledge Transfer & Transfer Pengetahuan Penelitian SAL (Skripsi)

Dokumen ini disusun sebagai **Master Knowledge Base** yang merangkum seluruh pengetahuan teknis, metodologis, landasan teori, hasil eksperimen, serta arahan Dosen Pembimbing untuk proyek skripsi **Smart Assistant Lecturer (SAL)**. Dokumen ini bertujuan agar sesi AI selanjutnya dapat memahami seluruh konteks proyek secara utuh tanpa ada potensi kesalahan interpretasi.

---

## 1. Identitas Proyek & Tim Penelitian

* **Judul Skripsi**: Pengembangan Smart Assistant Lecturer untuk Analisis Jawaban Esai Otomatis Berbasis LLM (Large Language Model)
* **Peneliti / Mahasiswa**: M Reyvan Purnama (NIM: 220102043)
* **Program Studi / Institusi**: Teknik Informatika, Fakultas Sains dan Teknologi, Universitas Muhammadiyah Bandung
* **Dosen Pembimbing I**: Aila Gema Safitri, S.T., M.T. (NIDN: 0416068505)
* **Dosen Pembimbing II / Kaprodi**: Ririn Suharsih, S.Pd., M.T. (NIDN: 0426108805)

---

## 2. Arsitektur & Teknologi Sistem

* **Framework Web**: Next.js (App Router)
* **Database & Auth**: Supabase PostgreSQL (Backend-as-a-Service)
* **Infrastruktur Inferensi AI**: Groq API Cloud
* **Model LLM Utama**: `openai/gpt-oss-120b` (Open-weight model dengan kapabilitas *variable effort reasoning* & *instruction-following*)
* **Pola Arsitektur**: *Provider-Agnostic Middleware Decoupling* (Claes, 2025) untuk memisahkan kode platform utama dari layanan AI.
* **Strategi Mitigasi Halusinasi**: *Knowledge Grounding* (Ji et al., 2023) untuk mengunci penalaran AI pada dokumen acuan dosen, serta *Chain-of-Thought (CoT) Reasoning* (Stahl et al., 2024; Wang et al., 2022) pada elemen `[TASK]`.
* **Komponen Prompt Modular**: `[ROLE]`, `[TASK]`, `[CRITERIA]`, `[CONTEXT]`, `[SOAL_ESAI]`, `[INPUT_DATA]`, `[OUTPUT_FORMAT]`.

---

## 3. Metodologi Pengembangan & Alur Iterasi Prototyping

Metode pengembangan perangkat lunak yang digunakan adalah **Prototyping Model**. Sesuai arahan Dosen Pembimbing (Bu Ririn), proses pengembangan sistem dibagi menjadi dua iterasi perbaikan utama:

### 🔴 Iterasi 1 (Prototype Awal - Penilaian Biner / Binary Scoring)
* **Skema Rubrik**: *Binary Scoring / All-or-Nothing Rubric* (Skor mentah 0 atau 100 per aspek).
* **Hasil Pengujian ($N = 33$)**:
  * Kendall's Tau ($\tau$) = **0.4400** (Keselarasan sedang).
  * Mean Absolute Error (MAE) = **18.33 Poin** (Error sangat tinggi).
* **Evaluasi Dosen**: Sistem terlalu kaku. Kesalahan minor (seperti kelalaian tanda kutip pada string `'12345'` atau typo kecil) langsung diberi skor 0, yang merugikan mahasiswa. Dosen merekomendasikan perlunya skema penilaian parsial.

### 🟢 Iterasi 2 (Prototype Final - 3-Point Partial Credit Rubric)
* **Landasan Teori Ilmiah**: *3-Point Partial Credit Rubric* (Masters, 1982; Brookhart, 2013) & *3-Class ASAG Ordinal Scoring* (Haller et al., 2022).
* **Skema Rubrik**: Skala bertingkat 3-level (0, 50, 100) pada 10 aspek rubrik berbobot 10%:
  * **Skor 100 (Full Credit / Correct)**: Benar sempurna.
  * **Skor 50 (Partial Credit / Partially Correct)**: Terpenuhi sebagian (typo minor / tanpa screenshot).
  * **Skor 0 (No Credit / Incorrect)**: Salah total / tidak mengumpulkan.
* **Hasil Pengujian Final ($N = 33$)**:
  * Kendall's Tau ($\tau$) = **`0.7724`** (*Strong Rank Correlation*, meningkat **+75.5%** dari Iterasi 1).
  * Mean Absolute Error (MAE) = **`5.45 Poin`** (Sangat presisi, error berkurang **-70.3%** dari Iterasi 1).
* **Dampak & Status**: Hasil nilai berupa bilangan bulat bersih (kelipatan 5 atau 10: 75, 80, 85, 90, 95, 100). **Prototype Versi 2 disetujui oleh Dosen Pembimbing sebagai sistem final**.

---

## 4. Arahan Khusus Dosen Pembimbing (Bu Ririn)

1. **Metrik Evaluasi Utama**:
   HANYA menggunakan **Kendall's Tau ($\tau$)** untuk mengukur keselarasan peringkat (*rank correlation*) dan **Mean Absolute Error (MAE)** untuk mengukur rata-rata deviasi fisik skor poin.
2. **Penyajian Rubrik di Naskah Skripsi**:
   HANYA menampilkan **1 Tabel Rubrik**, yaitu **Rubrik 3-Point Partial Credit (Trinary 0/50/100)** di Bab III & Bab IV. Rubrik strategi lain tidak perlu dituliskan di naskah.
3. **Penyajian Iterasi Prototyping**:
   Wajib menampilkan alur **Iterasi Perbaikan System/Prototype** (Iterasi 1: Binary Scoring vs Iterasi 2: 3-Point Partial Credit Rubric) di Bab III dan Bab IV sebagai bukti penerapan metode Prototyping.

---

## 5. Hasil Pengujian Statistik & Uji Normalitas

* **Jumlah Sampel**: $N = 33$ sampel retrospektif mahasiswa praktikum SQL (IF23A).
* **Uji Normalitas Shapiro-Wilk**:
  * Skor AI: $W = 0.8963, p = 0.0043 \le 0.05 \implies$ **Berdistribusi TIDAK Normal**.
  * Skor Dosen: $W = 0.9545, p = 0.1794 > 0.05 \implies$ **Berdistribusi NORMAL**.
* **Justifikasi Metodologis**: Penggunaan uji non-parametrik **Kendall's Tau ($\tau = 0.7724$)** adalah wajib dan sah secara metodologi karena variabel Skor AI terbukti tidak berdistribusi normal.

---

## 6. Inventaris Berkas Kunci Repositori

1. **Draft Naskah Proposal/Skripsi (Bab I - III)**:
   `docs/draft-otwsidang.txt`
2. **Draft Naskah Bab IV (Hasil dan Pembahasan)**:
   `docs/bab4_hasil_dan_pembahasan.txt`
3. **Dataset Ground Truth Terstandar**:
   `docs/IF23A_cleaned_trinary.csv`
4. **Gambar Grafik Iterasi Prototyping (Siap Tempel / Colab)**:
   `docs/grafik_iterasi_prototype.png`
5. **Skrip Pembuat Grafik (Google Colab Compatible)**:
   `scratch/generate_charts_iterasi.py`
6. **Skrip Uji Normalitas Shapiro-Wilk**:
   `scratch/test_normality.py`

---

## 7. Catatan Penting untuk AI Selanjutnya

* **Jangan Mengubah Metrik**: Metrik resmi proyek ini adalah **Kendall's Tau ($\tau$)** dan **MAE**. Jangan menambah Pearson, Spearman, atau QWK kecuali diminta secara spesifik oleh user.
* **Gunakan Istilah Resmi Akademik**:
  * Gunakan istilah **Binary Scoring** untuk Iterasi 1.
  * Gunakan istilah **3-Point Partial Credit Rubric (Trinary Evaluation)** untuk Iterasi 2.
* **Status Aplikasi Web**: Aplikasi web di repositori ini sudah 100% stabil, sinkron dengan database Supabase, dan siap untuk demo live saat sidang.
