# 📄 REVISI BAB III: DISKUSI & REVISED METODOLOGI PROTOTYPING

**File Target:** `docs/06_revisi_sidang_akhir/01_DISKUSI_DAN_REVISED_METODOLOGI_PROTOTYPING_BAB3.md`  
**Topik:** Penyelarasan Metode Prototyping (Sistem vs Engine Penilaian AI)  
**Catatan Penguji:** *"Prototyping tidak jelas (karena iterasi yang binary ke 3-point partial credit itu bukan termasuk iterasi sistem). Bagusnya diganti / diperjelas."*

---

## 💡 DISKUSI & ANALISIS KRITIS MASUKAN PENGUJI

### Mengapa Penguji Mempertanyakan Hal Ini?
Dalam rekayasa perangkat lunak konvensional (misal: Pressman / Sommerville), **System Prototyping** berfokus pada iterasi antarmuka (UI/UX), penambahan fitur fisik, atau perubahan alur navigasi aplikasi. 

Ketika penguji membaca bahwa **Iterasi 1 = Binary Scoring (0/100)** dan **Iterasi 2 = 3-Point Partial Credit (0, 50, 100)**, penguji menganggap:
> *"Ini kan perubahan aturan rubrik / logika prompt LLM, bukan perubahan fitur sistem aplikasi Next.js/Supabase-nya."*

---

## 🎯 2 OPSI SOLUSI STRATEGIS UNTUK NARASI BAB III

### OPSI 1 (DIREKOMENDASIKAN): Dual-Layer Prototyping (Sistem & Middleware AI Engine)
Kita **tidak perlu mengganti total nama metode Prototyping**, melainkan mempertegas bahwa pada perangkat lunak berbasis AI (AI-Native Application), *prototyping* dilakukan pada 2 lapisan berjenjang (*Dual-Layer*):
1. **Layer 1 (System Infrastructure Prototyping):** Membangun fisik antarmuka Next.js, basis data Supabase, API route, serta mekanisme upload file.
2. **Layer 2 (Middleware Grading Engine Prototyping):** Mengiterasi *sub-modul prompt assembler* dan skema rubrik pada middleware.

---

### OPSI 2: Penyesuaian Tahapan Prototyping Menjadi Single-Cycle System + Prompt Experimentation
Membuat tahapan Prototyping murni berfokus pada siklus pembentukan aplikasi SAL (Arsitektur Middleware, Portal Dosen, Portal Mahasiswa), sedangkan komparasi Binary vs Partial Credit ditempatkan sebagai **Eksperimen Evaluasi Modul Penilaian AI** di Bab IV.

---

## ✍️ TEKS REVISI BAB III (SIAP PAKAI - OPSI 1)

Berikut adalah rancangan narasi Sub-bab 3.1 yang sudah disempurnakan dan bebas dari celah pertanyaan penguji:

```markdown
### 3.1. Alur Penelitian (Metodologi Prototyping Dual-Layer)

Penelitian ini menggunakan metode pengembangan sistem berbasis Prototyping (Maryani et al., 2022) yang disesuaikan untuk aplikasi berbasis kecerdasan buatan (AI-Native System). Dalam pengembangan Smart Assistant Lecturer (SAL), siklus prototyping dilaksanakan pada dua lapisan utama: (1) Lapisan Infrastruktur Sistem (UI/UX Next.js & Supabase BaaS) dan (2) Lapisan Engine Middleware Penilaian AI.

Proses prototyping dilaksanakan melalui tahapan berurutan sebagai berikut:

1. Pengumpulan Kebutuhan (Requirement Gathering)
   - Mengidentifikasi kendala evaluasi esai manual dosen melalui penyebaran kuesioner pendahuluan.
   - Mengumpulkan korpus data retrospektif N = 33 dokumen jawaban mahasiswa praktikum basis data beserta kunci jawaban dan rubrik dosen pengampu.

2. Perancangan Cepat (Quick Design)
   - Merancang arsitektur sistem decoupled (Next.js, Supabase, Groq API).
   - Memodelkan Use Case Diagram (berdasarkan alur halaman /dosen dan /mahasiswa), Sequence Diagrams terpisah, dan Entity Relationship Diagram (ERD) Supabase.

3. Pembangunan Prototype (Construction of Prototype)
   - Tahap A (Infrastruktur Aplikasi): Membangun portal pembuatan tugas (/dosen/buat-tugas), portal mahasiswa (/tugas/[id]), dan portal validasi nilai (/dosen/validasi/[id]).
   - Tahap B (Engine Middleware Iterasi 1 - Baseline Binary): Mengimplementasikan sub-modul prompt assembler sederhana berbasis Binary Scoring (0/100) untuk menguji respon dasar model GPT-OSS 120B.

4. Evaluasi & Refinement Middleware (Evaluation & Refinement Engine - Iterasi 2)
   - Evaluasi Dosen: Dosen mengevaluasi bahwa skema biner pada Iterasi 1 terlampau kaku terhadap kesalahan minor (MAE tinggi).
   - Perbaikan Engine: Melakukan refactoring pada sub-modul middleware dengan mengintegrasikan 3-Point Partial Credit Rubric (skor 0, 50, 100) dan instruksi Chain-of-Thought (CoT). Refinement ini berhasil memfasilitasi penalaran logika parsial mahasiswa.

5. Finalisasi & Pengujian Sistem (Final System Delivery)
   - Mengunci arsitektur middleware final dan mempublikasikan sistem SAL yang siap digunakan dosen untuk melakukan validasi serta override nilai secara transparan.
```

---

## 📌 KEUNGGULAN NARASI REVISI INI SAAT DITANYA DOSEN:
- Apabila penguji bertanya lagi: *"Kenapa iterasi biner ke partial credit masuk prototyping?"*
- **Jawaban Reyvan:**  
  > *"Pada sistem AI-native seperti SAL, core value dari aplikasi terletak pada middleware engine-nya, Pak/Bu. Prototyping yang kami lakukan adalah Dual-Layer Prototyping: Layer 1 memastikan fisik UI dan Supabase berjalan lancar, sedangkan Layer 2 mengiterasi sub-modul prompt assembler pada middleware untuk memastikan logika grading AI selaras dengan intuisi dosen."*
