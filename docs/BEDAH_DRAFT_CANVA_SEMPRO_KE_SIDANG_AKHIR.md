# BEDAH SLIDE CANVA SEMPRO KE SLIDE SIDANG AKHIR (REVISI PPT)

Dokumen ini memetakan perbandingan **Slide Sempro (Lama)** vs **Slide Sidang Akhir (Baru)** berdasarkan file `docs/pptsempro`. Gunakan panduan ini untuk mengedit slide Canva Anda dengan cepat untuk sidang tanggal 7 Agustus!

---

## 🛑 HAL-HAL YANG WAJIB DIHAPUS TOTAL (EXPLICIT DELETIONS)

1. ❌ **Hapus Metrik QWK (Quadratic Weighted Kappa) & Pearson Correlation**:
   * *Alasan:* QWK diperuntukkan bagi esai teks panjang (panjang kata ratusan) dan Pearson rentan terhadap asumsi kecembungan linier. Pada evaluasi esai logika/SQL bertingkat, metrik standar AWE/AES mutakhir adalah **Kendall's Tau-b ($\tau_b$)** (keselarasan hirarki peringkat data ordinal kembar) dan **Mean Absolute Error (MAE)** (deviasi selisih fisik poin).
2. ❌ **Hapus Frasa "Rencana Pengujian" / "Google Colab Python"**:
   * *Alasan:* Ini sidang akhir (hasil), bukan proposal. Pengujian dilakukan langsung berbasis data retrospektif $N=33$ yang tercatat otomatis di database Supabase middleware SAL.
3. ❌ **Hapus Kata-kata Rencana Masa Depan ("Akan dikembangkan", "Rencana 4 Bulan")**:
   * *Alasan:* Ubah kalimat ke bentuk **hasil kerja nyata yang sudah selesai dilaksanakan**.

---

## 🔄 PEMETAAAN SLIDE DEMI SLIDE (OLD CANVA SEMPRO ➡️ NEW SIDANG AKHIR)

### 📌 Slide 1: Judul Utama
* **Sempro Lama:** Judul & Identitas
* **Sidang Akhir Baru:** **PERTAHANKAN**, tambahkan sub-judul:
  * *"Arsitektur Provider-Agnostic Middleware & 3-Point Partial Credit Rubric"*
  * Tambahkan nama Dosen Pembimbing I (Aila Gema Safitri, S.T., M.T.) & Pembimbing II (Ririn Suharsih, S.Pd., M.T.).

### 📌 Slide 2 & 3: Latar Belakang & Dilema Adopsi AI
* **Sempro Lama:** Hanya teori umum Bloxham et al., 2020 & Kasneci et al., 2023.
* **Sidang Akhir Baru:** **UPDATE** dengan memasukkan **Data Empiris Kuesioner 5 Dosen UMB**:
  * 🔴 **100% Dosen:** Mengalami kelelahan kognitif saat mengoreksi esai/SQL manual.
  * 🔴 **80% Dosen:** Khawatir risiko halusinasi AI.
  * 🟢 **100% Dosen:** Bersedia pakai AI jika kendali rubrik dikunci di tangan dosen.

### 📌 Slide 4: Rumusan Masalah & Tujuan
* **Sempro Lama:** Menggunakan frasa umum "metrik statistik relevan".
* **Sidang Akhir Baru:** **UPDATE** secara eksplisit sebutkan metriknya:
  * Tujuan 2: *"Mengevaluasi keandalan sistem menggunakan statistik non-parametrik **Kendall's Tau-b ($\tau_b$)** dan **Mean Absolute Error (MAE)**."*

### 📌 Slide 5: Batasan Masalah
* **Sempro Lama:** Menyebut "QWK dan Pearson" & "30-50 data".
* **Sidang Akhir Baru:** **REVISI TOTAL**:
  * Ubah Metrik: **Kendall's Tau-b ($\tau_b$) dan Mean Absolute Error (MAE)**.
  * Ukuran Sampel: **Dataset Retrospektif $N = 33$ Mahasiswa Kelas IF23A (Mata Kuliah Basis Data Lanjut IF204)**.

### 📌 Slide 6, 7, 8: Tinjauan Pustaka & Research Gap
* **Sempro Lama:** Menyebut novelty terintegrasi QWK & Pearson.
* **Sidang Akhir Baru:** **UPDATE** pada Slide Novelty:
  * Integrasi 4 Poin: (1) Decoupling Middleware (Claes, 2025), (2) Prompt Modular CoT (Stahl et al., 2024), (3) 3-Point Partial Credit Rubric (Chen & Wan, 2024), (4) Knowledge Grounding GPT-OSS 120B divalidasi dengan **Kendall's Tau-b & MAE** (Yeung, 2025; Bhat & Varma, 2026).

### 📌 Slide 9: AI Core Stack & Technology
* **Sempro Lama:** Landasan Teknologi Next.js, Supabase, Groq API.
* **Sidang Akhir Baru:** **PERTAHANKAN** (Visualnya bagus untuk menjelaskan arsitektur fisik).

### 📌 Slide 10, 11, 12: Arsitektur Middleware & Context Grounding
* **Sempro Lama:** Diagram arsitektur & prompt modular.
* **Sidang Akhir Baru:** **PERTAHANKAN**, perjelas 5 kompartemen prompt modular: `[ROLE]`, `[TASK]`, `[CONTEXT]`, `[CRITERIA]`, `[OUTPUT FORMAT]`.

### 📌 Slide 13: Rencana Pengujian (SEM PRO) ➡️ BUKAN RENCANA LAGI! (GANTI DENGAN SLIDE HASIL PENGUJIAN)
* 🛑 **HAPUS TOTAL Slide 13 Sempro (QWK & Pearson Google Colab)!**
* 🆕 **GANTI DENGAN SLIDE 13 BARU: HASIL PERBANDINGAN ITERASI 1 VS ITERASI 2**:
  * Tampilkan Tabel Komparasi Utama:
    * **Iterasi 1 (Binary 0/100):** $\tau_b = 0.4400$ | $\text{MAE} = 18.33 \text{ poin}$.
    * **Iterasi 2 (Trinary 0/50/100):** $\tau_b = \mathbf{0.7724}$ | $\text{MAE} = \mathbf{5.45 \text{ poin}}$.
  * Highlight dampak: Kendall Tau naik **+75.5%** & MAE turun **-70.3%**.

### 🆕 SLIDE TAMBAHAN WAJIB UNTUK SIDANG AKHIR (SEBELUMNYA BELUM ADA DI SEMPRO):

1. **SLIDE BARU 14: KASUS EMPIRIS PEMBUKTIAN KETEPATAN (SIDE-BY-SIDE)**
   * Kasus **NIM 230102004 (Abdurrahman Lunny Irham)**:
     * Dosen: **85.00** | Binary AI: **20.00** ❌ | Trinary AI: **85.00** ✅ (**Presisi Sempurna!**).
   * Menjelaskan kenapa Binary Scoring gagal dan 3-Point Partial Credit berhasil.

2. **SLIDE BARU 15: DEMO TAMPILAN ANTARMUKA APLIKASI (UI SCREENSHOTS)**
   * Screenshot Halaman Dosen (`/dosen/buat-tugas`), Dashboard, & Feature Override Nilai Manual (`/dosen/validasi/[id]`).

3. **SLIDE BARU 16: KESIMPULAN & SARAN**
   * Poin kesimpulan sesuai Bab V skripsi.

4. **SLIDE BARU 17: PENUTUP & DEMO LIVE**
   * Ucapan terima kasih & Q&A.

---

## ⚡ CHECKLIST EDIT DI CANVA PENERAPAN HARI INI:

- [ ] Buka Canva PPT Sempro Anda.
- [ ] Cari & Hapus semua tulisan `"QWK"` dan `"Pearson"`, ganti dengan `"Kendall's Tau-b"` dan `"MAE"`.
- [ ] Hapus slide Rencana Pengujian Colab (Slide 13).
- [ ] Tambahkan Slide **Tabel Hasil Iterasi 1 vs Iterasi 2** (Slide 13 Baru).
- [ ] Tambahkan Slide **Contoh Kasus Mahasiswa NIM 230102004** (Slide 14 Baru).
- [ ] Tambahkan Slide **Screenshot UI Sistem SAL** (Slide 15 Baru).
- [ ] Tambahkan Slide **Kesimpulan & Saran** (Slide 16 Baru).
