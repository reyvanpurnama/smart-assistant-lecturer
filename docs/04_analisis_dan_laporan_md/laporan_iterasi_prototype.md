# Laporan Iterasi Perbaikan Prototype Sistem (Metode Prototyping)

Dokumen ini berisi rangkuman alur **Iterasi Perbaikan Prototype** untuk penyusunan Bab III & Bab IV Naskah Skripsi sesuai arahan Dosen Pembimbing.

---

## 1. Tabel Perbandingan Hasil Iterasi Prototype

| Tahap Prototype | Deskripsi Logika & Fitur Sistem | Kendall's Tau ($\tau$) | MAE (Error Poin) | Evaluasi & Tindak Lanjut Perbaikan |
| :--- | :--- | :---: | :---: | :--- |
| **Iterasi 1 (Prototype Awal)** | • Prompt Biner (Skor 0 atau 100)<br>• Form Input & Upload Dasar | 0.4400 | 18.33 Poin | **Terlalu Kaku**: Terjadi penalti nilai 0 untuk kesalahan typo kecil. Dosen menyarankan penilaian parsial. |
| **Iterasi 2 (Prototype Final)** | • Prompt Bertingkat Trinary (0, 50, 100)<br>• Form Preset Template Trinary UI<br>• Dashboard Validasi & Override Dosen | **`0.7724`** | **`5.45 Poin`** | **DISETUJUI DOSEN**: Keselarasan peringkat naik **+75.5%** dan kesalahan poin turun **-70.3%**. Nilai bulat bersih. |

---

## 2. File Visualisasi Grafik Iterasi

Gambar grafik resolusi tinggi siap tempel untuk Bab IV Naskah Skripsi & Slide Sidang:
* Path File Gambar: `docs/grafik_iterasi_prototype.png`

---

## 3. Pembahasan Draf Paragraf untuk Bab IV Skripsi

> *"Pengembangan sistem Smart Assistant Lecturer (SAL) mengikuti metode Prototyping yang melalui dua tahap iterasi perbaikan utama. Pada Iterasi 1 (Prototype Awal), sistem menggunakan logika penilaian biner (0 atau 100) yang menghasilkan selisih kesalahan cukup tinggi (MAE = 18.33 poin) dan keselarasan sedang (Kendall's Tau = 0.4400) akibat tidak adanya toleransi atas kesalahan minor. Berdasarkan evaluasi tersebut, dilakukan perbaikan pada Iterasi 2 (Prototype Final) dengan mengimplementasikan skema penilaian bertingkat Trinary (0, 50, 100), template preset soal pada antarmuka dosen, serta fitur koreksi manual. Hasil pengujian pada Iterasi 2 menunjukkan peningkatan keselarasan peringkat sebesar +75.5% (Kendall's Tau = 0.7724) serta penurunan tingkat kesalahan sebesar -70.3% (MAE = 5.45 poin), sehingga prototype versi 2 disetujui sebagai sistem final."*
