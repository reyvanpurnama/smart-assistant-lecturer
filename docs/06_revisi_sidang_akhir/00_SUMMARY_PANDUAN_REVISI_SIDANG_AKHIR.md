# 📚 MASTER PANDUAN & REKAPITULASI REVISI SIDANG AKHIR (SAL SKRIPSI)

**Folder Utama:** `docs/06_revisi_sidang_akhir/`  
**Penyusun:** M. Reyvan Purnama (NIM: 220102043)  
**Status:** Terstruktur & Siap Integrasi ke Naskah Skripsi Utuh  

---

## 📂 DAFTAR BERKAS REVISI TERSTRUKTUR

Folder `docs/06_revisi_sidang_akhir/` telah memuat seluruh dokumen penyelesaian revisi sesuai catatan dosen penguji:

| No | Nama Berkas | Bab Target | Deskripsi Ringkas Isi Berkas |
| :---: | :--- | :---: | :--- |
| 1 | [`01_DISKUSI_DAN_REVISED_METODOLOGI_PROTOTYPING_BAB3.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/01_DISKUSI_DAN_REVISED_METODOLOGI_PROTOTYPING_BAB3.md) | **Bab III** | Analysis masukan penguji mengenai Prototyping, solusi *Dual-Layer Prototyping* (Sistem vs Engine Middleware), dan teks naskah revisi Sub-bab 3.1. |
| 2 | [`02_ERD_DATABASE_SUPABASE_BAB3.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/02_ERD_DATABASE_SUPABASE_BAB3.md) | **Bab III** | Perancangan ERD lengkap Supabase dalam format Mermaid diagram, rincian 5 tabel (`assignments`, `rubrics`, `submissions`, `rubric_scores`, `grading_jobs`), kamus data, dan relasi. |
| 3 | [`03_UML_USECASE_DAN_3_SEQUENCE_DIAGRAMS_BAB3.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/03_UML_USECASE_DAN_3_SEQUENCE_DIAGRAMS_BAB3.md) | **Bab III** | Use Case Diagram berbasis rute halaman (`/dosen`, `/dosen/buat-tugas`, `/dosen/validasi/[id]`, `/tugas/[id]`) dan 3 Sequence Diagrams terpisah (Dosen, Mahasiswa, Dosen Override). |
| 4 | [`04_ANALISIS_MENDALAM_MAE_DAN_KENDALLS_TAU_BAB4.md`](file:///home/tanesheva/Documents/Backup_Mint_CachyOS/SKRIPSI/project/sal/docs/06_revisi_sidang_akhir/04_ANALISIS_MENDALAM_MAE_DAN_KENDALLS_TAU_BAB4.md) | **Bab IV** | Pembahasan mendalam faktor ilmiah kenapa perubahan dari Binary ke 3-Point Partial Credit berpengaruh drastis (+75.5% Tau, -70.3% MAE), fenomena *catastrophic penalty*, dan komputasi step-by-step. |

---

## 🎯 PANDUAN SINGKAT PENGGUNAAN & CARA JAWAB DOSEN PENGUJI

1. **Untuk Revisi Prototyping (Bab 3):**
   - Gunakan penjelasan **Dual-Layer Prototyping** di Berkas `01`.
   - *Penjelasan ke Dosen:* "Sistem SAL adalah AI-native system. Layer 1 prototyping pada infrastruktur UI/BaaS, sedangkan Layer 2 prototyping pada engine middleware prompt assembler & rubrik."

2. **Untuk ERD Supabase (Bab 3):**
   - Salin Mermaid Diagram & Kamus Data 5 tabel di Berkas `02` ke Sub-bab 3.3 Perancangan Sistem.

3. **Untuk Use Case & 3 Sequence Diagrams (Bab 3):**
   - Gunakan Use Case Diagram berbasis alur per halaman dan 3 Sequence Diagram terpisah di Berkas `03` (Dosen Buat Tugas, Mahasiswa Submit AI Grading, Dosen Validasi & Override).

4. **Untuk Analisis MAE & Kendall's Tau (Bab 4):**
   - Gunakan pembahasan mendalam di Berkas `04` untuk memperkuat Sub-bab 4.4 & 4.5.
   - *Penjelasan ke Dosen:* "Binary Scoring memicu *catastrophic penalty* (kesalahan minor diberi 0) sehingga MAE melonjak 18.33 dan urutan peringkat teracak. 3-Point Partial Credit + CoT memfasilitasi kebenaran parsial 50 poin, sehingga MAE turun drastis ke 5.45 dan Kendall's Tau naik ke 0.7724."
