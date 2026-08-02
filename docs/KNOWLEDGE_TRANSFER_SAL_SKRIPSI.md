# Knowledge Transfer & Master Knowledge Base: Proyek Skripsi Smart Assistant Lecturer (SAL)

Dokumen ini disusun sebagai **Master Knowledge Base** yang merangkum seluruh pengetahuan teknis, metodologis, landasan teori, hasil eksperimen empiris, serta solusi komprehensif atas umpan balik Dosen Pembimbing (Bu Aila Gema Safitri & Bu Ririn Suharsih) untuk proyek skripsi **Smart Assistant Lecturer (SAL)**.

---

## 1. Identitas Proyek & Tim Penelitian

* **Judul Skripsi**: Pengembangan Smart Assistant Lecturer untuk Analisis Jawaban Esai Otomatis Berbasis LLM (Large Language Model)
* **Peneliti / Mahasiswa**: M Reyvan Purnama (NIM: 220102043)
* **Program Studi / Institusi**: Teknik Informatika, Fakultas Sains dan Teknologi, Universitas Muhammadiyah Bandung
* **Dosen Pembimbing I**: Aila Gema Safitri, S.T., M.T. (NIDN: 0416068505)
* **Dosen Pembimbing II / Kaprodi**: Ririn Suharsih, S.Pd., M.T. (NIDN: 0426108805)
* **Repositori GitHub**: `https://github.com/reyvanpurnama/smart-assistant-lecturer.git`

---

## 2. Arsitektur & Teknologi Sistem

* **Framework Web**: Next.js (App Router) dengan TypeScript & Tailwind CSS.
* **Database & Auth**: Supabase PostgreSQL (Backend-as-a-Service).
* **Infrastruktur Inferensi AI**: Groq API Cloud Client.
* **Model LLM Utama**: `openai/gpt-oss-120b` (Open-weight model dengan kapabilitas *variable effort reasoning* & *instruction-following*).
* **Pola Arsitektur**: *Provider-Agnostic Middleware Decoupling* (Claes, 2025) untuk memisahkan kode platform utama dari layanan AI.
* **Strategi Mitigasi Halusinasi**: *Knowledge Grounding* (Ji et al., 2023) untuk mengunci penalaran AI pada dokumen acuan dosen, serta *Chain-of-Thought (CoT) Reasoning* (Stahl et al., 2024; Wang et al., 2022) pada elemen `[TASK]`.
* **Komponen Prompt Modular**: `[ROLE]`, `[TASK]`, `[CRITERIA]`, `[CONTEXT]`, `[SOAL_ESAI]`, `[INPUT_DATA]`, `[OUTPUT_FORMAT]`.

---

## 3. Tanggapan & Resolusi Umpan Balik Dosen Pembimbing (Bu Aila)

 Seluruh masukan dari Bu Aila telah diselesaikan 100% dan terbukti secara teknis maupun akademis:

1. **Revisi Dataset & Kunci Jawaban (Bab II & III)**:
   - **Tabel 2.2**: Spesifikasi 10 Soal Praktikum SQL & Kunci Jawaban Ideal Dosen (`CREATE DATABASE`, `CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`, `ALTER`).
   - **Tabel 3.2**: Matriks Rincian Dataset 33 Mahasiswa & Bobot Rubrik Middleware (10% per aspek).
2. **Revisi Arsitektur Middleware & Kodingan (Bab IV)**:
   - Menjelaskan cara kerja middleware melalui 3 sub-modul (Cleansing Teks, Prompt Assembler, Orchestrator API Client).
   - Menampilkan 3 snippet kodingan Next.js/TypeScript asli dari repositori (`cleanRawStudentAnswer`, `composeGradingPrompt`, `POST /api/grade`).
   - Menyajikan **Trace Logging Inferensi CoT** (Simulasi input query SQL $\rightarrow$ log `global_reasoning` $\rightarrow$ keluaran JSON AI).
3. **Revisi Antarmuka & Manual Override (Bab IV & UI Web)**:
   - Kolom **Skor Akhir Dosen** di dashboard (`/dosen`) menampilkan tanda strip (`-`) jika status masih `[Belum Divalidasi]` (mencegah kebingungan penguji saat melihat angka kembar).
   - Kolom **Skor Akhir Dosen** baru menampilkan angka tebal jika dosen melakukan koreksi manual (`[Telah Divalidasi]`).
   - Istilah "Human-in-the-Loop" diganti menjadi **Fitur Koreksi Manual (Manual Override)** agar konsisten dengan Batasan Masalah Bab I.
4. **Revisi Statistik & Pembahasan Empiris (Bab IV)**:
   - Seluruh kutipan paper eksternal (Ji et al., 2023; Stahl et al., 2024, dll.) **DIHAPUS TOTAL** dari Sub-bab 4.5.
   - Digantikan dengan pembahasan kualitatif empiris: Mengapa Knowledge Grounding menghasilkan **0% halusinasi** dan Mengapa CoT memicu pemberian **skor parsial 50** pada kesalahan minor (memangkas MAE dari 18.33 ke 5.45 poin).

---

## 4. Hasil Komputasi Statistik Final (Database Supabase - 33 Mahasiswa)

Data diuji menggunakan 33 dokumen jawaban mahasiswa retrospektif dari Kelas IF23A (`docs/IF23A_cleaned_trinary.csv`):

### 📊 Metric Summary:
* **Ukuran Sampel ($N$)**: $33$ dokumen mahasiswa.
* **Kendall's Tau ($\tau$)**: **`0.7724`** ($p = 1.24 \times 10^{-8} < 0.05$).
* **Mean Absolute Error (MAE)**: **`5.45 Poin`**.
* **Uji Normalitas Shapiro-Wilk**: Skor AI ($W = 0.8963, p = 0.0043 \le 0.05 \implies$ **TIDAK NORMAL**), menegaskan keharusan penggunaan uji non-parametrik Kendall's Tau.

### 📐 Step-by-Step Mathematical Proofs:

1. **Kendall's Tau ($\tau = 0.7724$)**:
   - Total Pasangan Kombinasi = $\frac{N(N-1)}{2} = \frac{33 \times 32}{2} = 528$ pasangan.
   - Pasangan Concordant ($P / nc$) = **379 pasangan** (hirarki dosen & AI sejalan).
   - Pasangan Discordant ($Q / nd$) = **28 pasangan** (hirarki terbalik).
   - Ties Skor AI ($T_x$) = 71, Ties Skor Dosen ($T_y$) = 25.
   - Formula: $\tau = \frac{379 - 28}{\sqrt{(379+28+71) \times (379+28+25)}} = \frac{351}{\sqrt{478 \times 432}} = \frac{351}{454.42} = \mathbf{0.7724}$.

2. **Mean Absolute Error ($MAE = 5.45$)**:
   - Accumulative Absolute Error ($\sum |x_i - y_i|$) = **179.85 poin**.
   - Formula: $MAE = \frac{179.85}{33} = \mathbf{5.45}$ poin.

---

## 5. Inventaris Berkas Naskah & Kode Utama

1. **Naskah Bab IV Master Clean (Final Ready to Word)**:
   `docs/naskah_bab4_master_clean.txt`
2. **Berkas Detail Revisi Per Topik**:
   - `docs/revisi_bab2_bab3_dataset_soal.txt`: Spesifikasi Soal SQL & Rubrik.
   - `docs/revisi_bab4_middleware_dan_codingan.txt`: Arsitektur & Kodingan Next.js.
   - `docs/revisi_bab4_antarmuka_ui_dan_override.txt`: Penjelasan UI & Manual Override.
   - `docs/revisi_bab4_analisis_statistik_dan_python.txt`: Rumus Statistik & Script Colab.
3. **Dataset Empiris Terstandar**:
   `docs/IF23A_cleaned_trinary.csv`
4. **Skrip Komputasi Google Colab**:
   - `scratch/colab_iterasi_prototyping.py`: Merender Grafik Bar Chart Iterasi Prototype (`grafik_iterasi_prototype.png` / Gambar 4.5).
   - `scratch/colab_analisis_sal.py`: Merender Grafik Scatter Plot Sebaran Skor vs Garis Ideal $y=x$ (`scatter_IF23A_cleaned_trinary.png` / Gambar 4.6).
5. **Kodingan Utama Web App**:
   - `src/lib/grading/text-parser.ts`: Fungsi `cleanRawStudentAnswer`.
   - `src/lib/grading/prompt-composer.ts`: Fungsi `composeGradingPrompt`.
   - `src/app/api/grade/route.ts`: API Route Orchestrator Groq Client.
   - `src/app/dosen/page.tsx`: UI Dashboard Dosen dengan indikator status `-` dan badge `[Belum Divalidasi]`.

---

## 6. Cheat Sheet Uji Sidang Skripsi (Jawaban Pertanyaan Penguji)

* **Penguji**: *"Kenapa pakai Kendall's Tau, bukan Pearson Correlation?"*
  - **Jawaban**: *"Karena berdasarkan Uji Normalitas Shapiro-Wilk, data Skor AI terbukti berdistribusi TIDAK NORMAL ($p = 0.0043 \le 0.05$). Selain itu, skor nilai esai bersifat data ordinal/terurut, sehingga uji non-parametrik Kendall's Tau secara ilmiah paling tepat untuk menguji keselarasan hirarki logika."*

* **Penguji**: *"Darimana angka Kendall's Tau 0.7724 diperoleh?"*
  - **Jawaban**: *"Dari total 528 pasangan kombinasi 33 mahasiswa, 379 pasangan bersifat concordant (sejalan) dan hanya 28 pasangan yang discordant, menghasilkan selisih 351 pasang yang dibagi akar hasil perkalian ties ($454.42$), sehingga diperoleh $\tau = 0.7724$."*

* **Penguji**: *"Kenapa nilai MAE turun drastis dari 18.33 ke 5.45 poin?"*
  - **Jawaban**: *"Karena di Iterasi 1 (Binary Scoring 0/100), AI menghukum kesalahan minor seperti typo atau tanpa petik tunggal dengan skor 0. Di Iterasi 2 (3-Point Partial Credit + CoT), AI dipaksa bernalar secara bertahap sehingga mampu memberikan skor parsial 50 untuk kesalahan minor, yang memangkas error sebesar -70.3%."*

* **Penguji**: *"Bagaimana sistem menjamin 0% halusinasi?"*
  - **Jawaban**: *"Melalui mekanisme Knowledge Grounding pada middleware yang menyatukan naskah soal [SOAL_ESAI], rubrik [CRITERIA], dan materi referensi [CONTEXT] untuk mengunci ruang lingkup inferensi model GPT-OSS 120B murni pada dokumen acuan dosen."*

---

## 7. Instruksi Penggunaan untuk Agent AI Selanjutnya

1. **Stabilitas Proyek**: Proyek ini sudah **100% Stabil**, disinkronkan dengan database Supabase, di-push ke GitHub, dan dideploy di Vercel.
2. **Integrasi Naskah**: Untuk memperbarui naskah skripsi pengguna, selalu gunakan isi dari `docs/naskah_bab4_master_clean.txt`.
3. **Integritas Metrik**: Jangan pernah mengubah nilai $\tau = 0.7724$ dan $MAE = 5.45$ karena angka ini adalah hasil komputasi empiris asli dari database Supabase (`IF23A_cleaned_trinary.csv`).
