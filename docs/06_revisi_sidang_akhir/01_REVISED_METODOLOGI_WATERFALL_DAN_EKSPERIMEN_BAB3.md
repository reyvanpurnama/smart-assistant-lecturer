# 📄 REVISI BAB III: METODE PENGEMBANGAN SISTEM (WATERFALL SDLC & EKSPERIMEN KOMPARASI)

**File Target:** `docs/06_revisi_sidang_akhir/01_REVISED_METODOLOGI_WATERFALL_DAN_EKSPERIMEN_BAB3.md`  
**Topik:** Penyelarasan Metode SDLC Aplikasi (Waterfall) dan Skema Pengujian AI (Eksperimen Komparasi)  
**Sitasi Acuan:** Pressman & Maxim (2019), Sommerville (2016), Yeung (2025), Chen & Wan (2024).

---

## 📌 LANDASAN SITASI ILMIAH (ALASAN KENAPA PAKAI METODE INI)

1. **Metode Pengembangan Aplikasi (Waterfall Model):**  
   - **Sitasi:** Pressman, R. S., & Maxim, B. R. (2019). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill Education.  
   - **Landasan:** Waterfall dipilih karena perancangan sistem Smart Assistant Lecturer (SAL) berbasis arsitektur *decoupled* (Next.js, Supabase, Groq API) memiliki spesifikasi kebutuhan yang sudah jelas sejak awal analisis, sehingga pembangunan dilakukan secara sekuensial dan terstruktur.

2. **Skema Pengujian Modul AI (Eksperimen Komparasi Skema Penilaian):**  
   - **Sitasi:** Yeung, S. (2025); Chen & Wan (2024); Bhat & Varma (2026).  
   - **Landasan:** Evaluasi modul penilaian AI tidak menggunakan siklus iterasi sistem aplikasi, melainkan menggunakan *Experimental Evaluation Scheme* (A/B Testing) untuk membandingkan performa *Binary Scoring* vs *3-Point Partial Credit Rubric* terhadap *ground truth* dosen.

---

```markdown
================================================================================
[SIAP COPY-PASTE SKRIPSI] - BAB III SUB-BAB 3.1 ALUR PENELITIAN & METODOLOGI
================================================================================

3.1. Alur Penelitian dan Metodologi Pengembangan Sistem

Penelitian ini menggunakan pendekatan penelitian terapan (applied research) dengan mengombinasikan dua metode utama: (1) Waterfall Model (Pressman & Maxim, 2019) sebagai metode pengembangan sistem perangkat lunak (Software Development Life Cycle / SDLC), dan (2) Experimental Evaluation Scheme (Yeung, 2025) sebagai metode pengujian dan komparasi keandalan modul penilaian otomatis berbasis Large Language Model (LLM).

Penggunaan Waterfall Model didasarkan pada sifat perancangan arsitektur sistem decoupled (Next.js, Supabase BaaS, dan Groq API) yang membutuhkan alur eksekusi secara sistematis dan sekuensial. Sementara itu, evaluasi keandalan penilaian AI dilakukan melalui eksperimen komparatif untuk menguji dampak transisi skema penilaian Binary Scoring terhadap 3-Point Partial Credit Rubric berbasis Chain-of-Thought (CoT) (Chen & Wan, 2024).

Tahapan alur penelitian dilaksanakan melalui 5 fase utama sebagai berikut:

1. Analisis Kebutuhan (Requirement Analysis)
   Pada fase awal, dilakukan identifikasi permasalahan operasional terkait beban kerja dan subjektivitas pemeriksaan esai manual dosen melalui penyebaran kuesioner pendahuluan. Selain itu, dihimpun korpus data retrospektif N = 33 dokumen jawaban mahasiswa praktikum basis data beserta kunci jawaban acuan dan rubrik dosen pengampu.

2. Perancangan Sistem (System Design)
   Melakukan pemodelan arsitektur sistem perantara (decoupled middleware), perancangan diagram UML (Use Case Diagram berbasis alur halaman dan 3 Sequence Diagram terpisah), serta perancangan basis data relasional Supabase (Entity Relationship Diagram / ERD) yang mencakup 5 tabel utama (assignments, rubrics, submissions, rubric_scores, dan grading_jobs).

3. Implementasi Sistem (Implementation / Coding)
   Membangun antarmuka pengguna berbasis Next.js (App Router) yang terdiri dari Portal Dosen (/dosen/buat-tugas, /dosen, /dosen/validasi/[id]) dan Portal Mahasiswa (/tugas/[id]). Selain itu, dikembangkan lapisan middleware Node.js untuk mengeksekusi sub-modul text cleansing, prompt assembler modular, dan integrasi inferensi Groq API (GPT-OSS 120B).

4. Pengujian & Eksperimen Komparasi AI (System Testing & Experimental Evaluation)
   Pengujian sistem dibagi menjadi dua bagian: (a) Pengujian Fungsionalitas Aplikasi untuk memastikan fitur upload, ekstraksi teks, dan override nilai dosen berjalan bebas dari kendala teknis, serta (b) Eksperimen Komparasi Modul Penilaian AI untuk mengukur tingkat keselarasan peringkat (Kendall's Tau) dan rata-rata kesalahan fisik skor (Mean Absolute Error / MAE) antara skema Binary Scoring (0/100) dan 3-Point Partial Credit Rubric (0, 50, 100).

5. Pemeliharaan & Finalisasi (Maintenance & Delivery)
   Mendokumentasikan seluruh arsitektur sistem dan memfinalisasi platform Smart Assistant Lecturer (SAL) yang telah disetujui dosen pengampu sebagai asisten penilaian esai otomatis yang transparan dan dapat di-override secara manual.

================================================================================
```
