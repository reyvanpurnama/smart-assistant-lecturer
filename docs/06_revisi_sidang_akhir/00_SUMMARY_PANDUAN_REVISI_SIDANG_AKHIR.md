# 📚 MASTER PANDUAN & REKAPITULASI REVISI SIDANG AKHIR (SAL SKRIPSI)

**Folder Utama:** `docs/06_revisi_sidang_akhir/`  
**Penyusun:** M. Reyvan Purnama (NIM: 220102043)  
**Metodologi Resmi:** Waterfall Model (SDLC Aplikasi) & Experimental Evaluation Scheme (Pengujian AI)  

---

## 📂 DAFTAR BERKAS REVISI TERSTRUKTUR & BOX SIAP COPY-PASTE

Seluruh dokumen di folder `docs/06_revisi_sidang_akhir/` telah dilengkapi dengan **Box `[SIAP COPY-PASTE SKRIPSI]`** agar dapat langsung disalin ke naskah Word skripsi utama:

| No | Nama Berkas | Bab Target | Deskripsi Isi & Box Copy-Paste |
| :---: | :--- | :---: | :--- |
| 1 | [`01_REVISED_METODOLOGI_WATERFALL_DAN_EKSPERIMEN_BAB3.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/01_REVISED_METODOLOGI_WATERFALL_DAN_EKSPERIMEN_BAB3.md) | **Bab III.1** | Landasan sitasi resmi (Pressman & Maxim 2019, Sommerville 2016, Yeung 2025) dan Naskah Siap Tempel Alur Penelitian Waterfall SDLC + Eksperimen Komparasi AI. |
| 2 | [`02_ERD_DATABASE_SUPABASE_BAB3.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/02_ERD_DATABASE_SUPABASE_BAB3.md) | **Bab III.3.3** | Naskah Siap Tempel Perancangan ERD Supabase (Mermaid Diagram + Kamus Data 5 Tabel Utama). |
| 3 | [`03_UML_USECASE_DAN_3_SEQUENCE_DIAGRAMS_BAB3.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/03_UML_USECASE_DAN_3_SEQUENCE_DIAGRAMS_BAB3.md) | **Bab III.3.1 & III.3.2** | Naskah Siap Tempel Use Case Diagram Halaman dan 3 Sequence Diagrams Terpisah (Dosen Buat Tugas, Mahasiswa Submit AI, Dosen Validasi/Override). |
| 4 | [`04_ANALISIS_MENDALAM_MAE_DAN_KENDALLS_TAU_BAB4.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/04_ANALISIS_MENDALAM_MAE_DAN_KENDALLS_TAU_BAB4.md) | **Bab IV.3, IV.4, IV.5** | Naskah Siap Tempel Perhitungan Step-by-Step Tau-b & MAE serta Pembahasan 3 Faktor Utama Penyebab Perubahan Performa Signifikan dari Binary ke Partial Credit. |

---

## 🎯 CARA MENJAWAB PERTANYAAN DOSEN PENGUJI SAAT ASISTENSI REVISI

1. **Pertanyaan:** *"Metode SDLC-nya kemarin kan diprotes, sekarang pakai apa?"*  
   **Jawaban Reyvan:**  
   > *"Untuk pengembangan aplikasi web SAL-nya kami menggunakan **Waterfall Model** (Pressman & Maxim, 2019), Pak/Bu. Karena spesifikasi kebutuhan sistem decoupled kami (Next.js, Supabase, Groq API) sudah terdefinisi secara sistematis dari analisis kebutuhan hingga implementasi."*

2. **Pertanyaan:** *"Terus perubahan Binary ke 3-Point Partial Credit itu masuknya ke mana?"*  
   **Jawaban Reyvan:**  
   > *"Itu masuk ke **Experimental Evaluation Scheme** di bagian Pengujian Modul AI (Yeung, 2025; Chen & Wan, 2024), Pak/Bu. Kami melakukan A/B Testing eksperimen komparasi untuk mengukur sejauh mana skema rubrik parsial memitigasi catastrophic penalty pada jawaban mahasiswa."*

3. **Pertanyaan:** *"Kenapa dari biner ke partial credit MAE-nya bisa turun drastis dan Kendall's Tau-nya bisa naik tinggi?"*  
   **Jawaban Reyvan:**  
   > *"Skema biner memicu catastrophic penalty (kesalahan minor/typo langsung diberi skor 0), sehingga nilai AI anjlok dan mengacak urutan peringkat mahasiswa. Dengan 3-Point Partial Credit + CoT, AI memberikan skor parsial 50 poin pada logika yang benar, sehingga selisih error fisik MAE berkurang drastis dari 18.33 ke 5.45 poin, dan urutan peringkat sejalan dengan dosen (Kendall's Tau naik dari 0.4400 ke 0.7724)."*
