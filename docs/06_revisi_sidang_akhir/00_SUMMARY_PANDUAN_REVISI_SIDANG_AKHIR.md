# MASTER PANDUAN & REKAPITULASI REVISI SIDANG AKHIR (SAL SKRIPSI)

Folder Utama: docs/06_revisi_sidang_akhir/  
Penyusun: M. Reyvan Purnama (NIM: 220102043)  
Metodologi Resmi: Waterfall Model (SDLC Aplikasi) & Experimental Evaluation Scheme (Pengujian AI)  

---

DAFTAR BERKAS REVISI TERSTRUKTUR & BOX SIAP COPY-PASTE

Seluruh dokumen di folder docs/06_revisi_sidang_akhir/ telah dilengkapi dengan Box [SIAP COPY-PASTE SKRIPSI] agar dapat langsung disalin ke naskah Word skripsi utama:

| No | Nama Berkas | Bab Target | Deskripsi Isi & Box Copy-Paste |
| :---: | :--- | :---: | :--- |
| 1 | 01_REVISED_METODOLOGI_WATERFALL_DAN_EKSPERIMEN_BAB3.md | Bab III.1 & III.4 | Landasan sitasi resmi (Pressman & Maxim 2019, Yeung 2025) dan Naskah Siap Tempel Alur Penelitian Waterfall SDLC + Eksperimen Komparasi AI. |
| 2 | 02_ERD_DATABASE_SUPABASE_BAB3.md | Bab III.3.3 | Naskah Siap Tempel Perancangan ERD Supabase (Mermaid Diagram + Kamus Data 5 Tabel Utama). |
| 3 | 03_UML_USECASE_DAN_3_SEQUENCE_DIAGRAMS_BAB3.md | Bab III.3.1 & III.3.2 | Naskah Siap Tempel Use Case Diagram Halaman (UML Oval 2-kolom kompak) dan 3 Sequence Diagrams Terpisah. |
| 4 | 04_ANALISIS_MENDALAM_MAE_DAN_KENDALLS_TAU_BAB4.md | Bab IV.3, IV.4, IV.5 | Naskah Siap Tempel Perhitungan Step-by-Step Tau-b & MAE serta Pembahasan Kasus Empiris Riil 33 Mahasiswa Supabase (NIM 230102004, 230102033, 230102052, 230102031). |
| 5 | 05_REVISI_DETAIL_DIAGRAM_PROMPT_DAN_CLEANSING_BAB3_BAB4.md | Bab III & Bab IV | Jawaban Lengkap 6 Catatan Sidang Tambahan: (1) Asal-usul P=379, (2) Data Cleansing, (3) Context vs Soal_Esai, (4) Class Diagram vs ERD, (5) Perpindahan Use Case. |
| 6 | 06_REVISI_TABEL_IKHTISAR_PENELITIAN_BAB2.md | Bab II.2 | Naskah Siap Tempel Tabel 2.1 Ikhtisar Penelitian Terdahulu versi 4-Kolom Ringkas (Format Portrait A4, Bebas Landscape, Ber-bullet Point). |

---

CARA MENJAWAB PERTANYAAN DOSEN PENGUJI SAAT ASISTENSI REVISI

1. Pertanyaan: "Ini angka P = 379 pasang, Q = 28, MAE 179.85 dapat dari mana?"  
   Jawaban Reyvan:  
   "Dari N = 33 mahasiswa retrospektif di Supabase, total pasangan kombinasi adalah N(N-1)/2 = 528 pasang. Dari 528 pasangan tersebut, dihitung perbandingan selisih skor Dosen vs AI: 379 pasang sejalan (Concordant / P), 28 pasang berlawanan (Discordant / Q), 71 pasang ties dosen (Tx), 21 pasang ties AI (Ty), dan 29 pasang ties keduanya (Txy). Perhitungan ini dieksekusi secara presisi menggunakan modul scipy.stats.kendalltau."

2. Pertanyaan: "Kenapa elemen CONTEXT dan SOAL_ESAI dipisah di Gambar 3.3?"  
   Jawaban Reyvan:  
   "SOAL_ESAI adalah naskah instrumen pertanyaan mahasiswa, sedangkan CONTEXT adalah acuan Knowledge Grounding (kunci jawaban dosen, modul praktikum, dan batas toleransi variasi sintaksis). Pemisahan header di prompt modular ini wajib hukumnya untuk memitigasi Prompt Ambiguity agar AI tidak membocorkan kunci jawaban ke feedback mahasiswa."

3. Pertanyaan: "Kenapa Tabel 2.1 Ikhtisar Penelitian diubah jadi 4 kolom?"  
   Jawaban Reyvan:  
   "Tabel disederhanakan menjadi 4 kolom ber-bullet point agar dapat dimuat secara proporsional dalam format Portrait A4 tanpa harus memutar halaman menjadi Landscape, dengan tetap mempertahankan seluruh poin inti fokus, metode, hasil utama, dan aspek yang diadopsi dari 6 literatur acuan utama."
