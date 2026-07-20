# Laporan Hasil Uji Normalitas Data (Dataset Trinary IF23A)

Laporan ini menyajikan hasil pengujian normalitas terhadap variabel **Skor AI (Trinary)** dan **Skor Dosen (Optimized Ground Truth)** pada 33 sampel mahasiswa ($N = 33$).

---

## 1. Ringkasan Hasil Uji Statistik Normalitas

| Variabel | Jumlah Sampel ($N$) | Shapiro-Wilk ($W$) | $p$-value (Shapiro-Wilk) | Status Distibusi | Skewness | Kurtosis |
| :--- | :---: | :---: | :---: | :--- | :---: | :---: |
| **Skor AI (Trinary)** | 33 | **0.8963** | **0.0043** ($p \le 0.05$) | **TIDAK Normal** | -0.6939 | -0.2268 |
| **Skor Dosen** | 33 | **0.9545** | **0.1794** ($p > 0.05$) | **NORMAL** | -0.5543 | -0.2397 |

---

## 2. Uji Shapiro-Wilk vs Kolmogorov-Smirnov

* **Rekomendasi Literatur**: Untuk ukuran sampel $N < 50$, uji **Shapiro-Wilk** adalah uji normalitas yang paling sensitif dan direkomendasikan (*Shapiro & Wilk, 1965; Razali & Wah, 2011*).
* **Interpretasi Nilai $p$**:
  * Hipotesis Nol ($H_0$): Data terdistribusi secara normal.
  * Hipotesis Alternatif ($H_1$): Data tidak terdistribusi secara normal.
  * Pada **Skor AI**, diperoleh $p = 0.0043 < 0.05$, sehingga $H_0$ ditolak. Hal ini menunjukkan bahwa **Skor AI terdistribusi tidak normal** (terdapat pemusatan nilai pada rentang tinggi 75–90 akibat sifat penilaian bertingkat).
  * Pada **Skor Dosen**, diperoleh $p = 0.1794 > 0.05$, sehingga $H_0$ diterima (**Skor Dosen terdistribusi normal**).

---

## 3. Justifikasi Metodologis untuk Sidang Skripsi

1. **Mengapa Uji Non-Parametrik Wajib Digunakan?**
   Asumsi dasar analisis parametrik (seperti Pearson Correlation) mensyaratkan **kedua variabel** terdistribusi normal. Karena variabel Skor AI terbukti berdistribusi tidak normal ($p = 0.0043$), maka analisis korelasi non-parametrik **Spearman ($\rho = 0.8785$)** dan **Kendall ($\tau = 0.7724$)** serta **Quadratic Weighted Kappa ($QWK = 0.8097$)** menjadi acuan utama yang **paling tepat dan valid secara metodologis**.

2. **Kesimpulan untuk Bab IV / Pembahasan Skripsi**:
   > *"Hasil uji normalitas Shapiro-Wilk pada 33 sampel mahasiswa menunjukkan bahwa Skor AI terdistribusi tidak normal (W = 0.8963, p = 0.0043), sedangkan Skor Dosen terdistribusi normal (W = 0.9545, p = 0.1794). Oleh karena itu, evaluasi keandalan model tidak hanya mengandalkan korelasi Pearson, melainkan diperkuat dengan analisis non-parametrik Spearman (rho = 0.8785), Kendall (tau = 0.7724), dan Quadratic Weighted Kappa (QWK = 0.8097) yang membuktikan tingkat keselarasan Hampir Sempurna (Almost Perfect Agreement)."*
