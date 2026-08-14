# REVISI BAB II: TABEL IKHTISAR PENELITIAN TERDAHULU (FORMAT PORTRAIT A4)

File Target: docs/06_revisi_sidang_akhir/06_REVISI_TABEL_IKHTISAR_PENELITIAN_BAB2.md  
Topik: Perapihan Tabel 2.1 Ikhtisar Penelitian Terdahulu agar Muat di Halaman Portrait A4 (Tanpa Perlu Landscape)  
Ekstraksi Data: Diekstrak langsung dari berkas ringkasan paper di docs/paper/penelitianterdahulu/  

---

PENGATURAN STRUKTUR TABEL PORTRAIT (4 KOLOM RINGKAS)

Guna memastikan Tabel 2.1 tidak melebar ke samping dan tidak memerlukan halaman Landscape (format tegak Portrait A4 tetap rapi), jumlah kolom disederhanakan menjadi 4 kolom dengan bobot ringkasan poin tingkat tinggi (high-density bullet points):

1. Kolom 1 - No. (Lebar 5%)
2. Kolom 2 - Peneliti & Tahun (Lebar 20%)
3. Kolom 3 - Fokus & Metodologi Utama (Lebar 40%)
4. Kolom 4 - Hasil Utama & Aspek yang Diadopsi pada System SAL (Lebar 35%)

---

================================================================================
[SIAP COPY-PASTE SKRIPSI] - BAB II TABEL 2.1 IKHTISAR PENELITIAN TERDAHULU
================================================================================

Tabel 2.1 Ikhtisar Penelitian Terdahulu

| No. | Peneliti & Tahun | Fokus & Metodologi Utama | Hasil Utama & Aspek yang Diadopsi pada SAL |
| :---: | :--- | :--- | :--- |
| 1 | **Mizumoto & Eguchi (2023)** | • Objek: 12.100 esai TOEFL11.<br/>• Model: GPT-3 (`text-davinci-003`) zero-shot.<br/>• Rubrik: IELTS Task 2 descriptors (skala 0–9). | • **Hasil:** *Adjacent agreement* 89,15% & QWK 0,682.<br/>• **Diadopsi:** Metodologi evaluasi komparatif skor AI terhadap *human rater* (*ground truth* dosen). |
| 2 | **Pack, Barrett, & Escalante (2024)** | • Objek: 119 esai tes penempatan ESL.<br/>• Model: PaLM 2, Claude 2, GPT-3.5, GPT-4.<br/>• Uji: Longitudinal lintas waktu 134 hari (T1 vs T2). | • **Hasil:** Model *closed-source* fluktuatif & rentan halusinasi seiring *update* vendor.<br/>• **Diadopsi:** Justifikasi penggunaan model *open-weight* & struktur *prompt* modular (`[ROLE]`, `[CONTEXT]`). |
| 3 | **Stahl et al. (2024)** | • Objek: 12.980 esai ASAP Dataset.<br/>• Model: Mistral-7B & Llama-2-13B.<br/>• Strategi: Persona & *Chain-of-Thought* (CoT). | • **Hasil:** *Joint scoring & feedback* berbasis CoT meningkatkan QWK hingga 0,553.<br/>• **Diadopsi:** Perakitan *prompt-template* modular berbasis instruksi *Chain-of-Thought* (CoT) *reasoning*. |
| 4 | **Haller et al. (2022/2024)** | • Objek: Survei metode *Automated Short Answer Grading* (ASAG) dari statistik ke Transformer. | • **Hasil:** ASAG berfokus pada semantik jawaban pendek & rubrik parsial.<br/>• **Diadopsi:** Landasan teoretis taksonomi ASAG & skema *partial credit scoring*. |
| 5 | **Claes (2025)** | • Objek: Integrasi LLM pada platform *autograder* INGInious.<br/>• Arsitektur: *Decoupled Middleware* (Mediator Pattern). | • **Hasil:** *Decoupling* memisahkan platform dari API vendor & tingkatkan *resubmission* +15,1%.<br/>• **Diadopsi:** Arsitektur *provider-agnostic middleware* berbasis *decoupling* (Next.js & Supabase). |
| 6 | **Chen & Wan (2024)** | • Objek: Penjelasan penalaran mahasiswa fisika.<br/>• Model: GPT-4o & GPT-3.5.<br/>• Metode: Rubrik *multi-item partial credit*. | • **Hasil:** *Graded partial credit* mencapai akurasi setara manusia (70%–80% *agreement*).<br/>• **Diadopsi:** Skema *3-Point Partial Credit Rubric* (skor 0, 50, 100) untuk kebenaran parsial. |

================================================================================
