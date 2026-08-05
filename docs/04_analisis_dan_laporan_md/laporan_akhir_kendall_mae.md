# Ringkasan Hasil Evaluasi Khusus: Kendall's Tau (τ) & MAE (Mean Absolute Error)

Laporan ini menyajikan hasil komparasi terstandar empat strategi evaluasi asisten dosen AI (*Relaxed, Binary, Strict, Trinary*) yang difokuskan pada dua metrik utama sesuai arahan Dosen Pembimbing:
1. **Kendall's Tau ($\tau$)**: Mengukur tingkat keselarasan peringkat (*rank correlation*) non-parametrik antara AI dan Dosen.
2. **Mean Absolute Error (MAE)**: Mengukur rata-rata selisih mutlak poin antara nilai AI dan Dosen.

---

## 1. Tabel Komparasi Resmi (Focus Metrics)

| Strategi Penilaian | Kendall's Tau ($\tau$) | MAE (Error Poin) | Interpretasi & Performansi |
| :--- | :---: | :---: | :--- |
| **Relaxed (Toleran)** | 0.4132 | 11.69 | Keselarasan Cukup, Selisih Nilai 11.69 Poin |
| **Binary (0 / 100)** | 0.4400 | 18.33 | Error Paling Tinggi (Rata-rata salah 18.33 Poin) |
| **Strict (Ketat Desimal)** | 0.4925 | 9.66 | Keselarasan Sedang, Selisih Nilai 9.66 Poin |
| **Trinary (0 / 50 / 100)** | **`0.7724`** | **`5.45`** | **PERFORMA TERBAIK: Tau Tinggi (0.7724) & MAE Terkecil (5.45 Poin)** |

---

## 2. Grafik Hasil Perbandingan (Visualisasi Bab IV / Slide Sidang)

File gambar grafik resolusi tinggi telah di-generate dan tersimpan di:
`docs/grafik_kendall_mae.png`

---

## 3. Pembahasan Metodologis untuk Bab IV Skripsi

1. **Analisis Kendall's Tau ($\tau$)**:
   * Metode **Trinary** mencapai $\tau = 0.7724$. Hal ini membuktikan bahwa urutan/peringkat kemampuan mahasiswa yang dihasilkan oleh AI sangat sejalan (konsisten tinggi) dengan urutan penilaian manual oleh dosen.
   * Metode **Binary** ($\tau = 0.4400$) dan **Relaxed** ($\tau = 0.4132$) jauh lebih rendah karena tidak mampu membedakan tingkat pemahaman parsial mahasiswa secara presisi.

2. **Analisis Mean Absolute Error (MAE)**:
   * Metode **Trinary** menghasilkan $MAE = 5.45$ poin. Ini berarti rata-rata deviasi nilai AI dari Dosen hanya sekitar **5 poin** (setara selisih setengah sub-aspek), yang sangat akurat untuk skala nilai 0–100.
   * Metode **Binary** menghasilkan error tertinggi $MAE = 18.33$ poin karena pendekatan serba "semua atau tidak sama sekali" (0 atau 100) terlalu ekstrem.

---

## 4. Draf Paragraf Kesimpulan untuk Naskah Skripsi

> *"Berdasarkan hasil pengujian terstandar menggunakan metrik Kendall's Tau ($\tau$) dan Mean Absolute Error (MAE), strategi penilaian Trinary (0, 50, 100) terbukti menjadi metode paling optimal dalam mengevaluasi jawaban esai praktikum SQL. Strategi Trinary menghasilkan tingkat keselarasan peringkat tertinggi ($\tau = 0.7724$) serta tingkat kesalahan rata-rata terkecil ($MAE = 5.45$ poin), mengungguli strategi Relaxed ($\tau = 0.4132, MAE = 11.69$), Binary ($\tau = 0.4400, MAE = 18.33$), dan Strict ($\tau = 0.4925, MAE = 9.66$)."*
