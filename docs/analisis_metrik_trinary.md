# Analisis Komparatif Metrik Penilaian AI: Menemukan Strategi Terbaik (Relaxed vs Strict vs Binary vs Trinary)

Dokumen ini menyajikan perbandingan komprehensif dari empat strategi penilaian otomatis menggunakan model `openai/gpt-oss-120b` dibandingkan dengan skor manual dosen pada dataset 33 mahasiswa.

---

## 1. Tabel Komparasi Metrik Statistik

| Strategi Penilaian | Pearson ($r$) | Spearman ($\rho$) | Kendall ($\tau$) | Mean Absolute Error (MAE) | Pembulatan Nilai | Karakteristik Hasil |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Relaxed (Toleran)** | 0.0637 | 0.0781 | 0.0692 | 8.88 | Desimal / Bebas | AI memaafkan hampir seluruh kesalahan; nilai menumpuk di angka tinggi (80-100). |
| **Strict (Ketat)** | -0.0688 | -0.0208 | -0.0168 | 19.67 | Desimal Pecahan | Nilai dikurangi secara gradasi desimal halus untuk setiap tipe kesalahan. |
| **Binary (0 / 100)** | -0.1562 | -0.1072 | -0.1046 | 29.55 | Kelipatan 5 / 10 | Penilaian mutlak per aspek (hanya 0 atau 100). Typo kecil langsung meruntuhkan nilai mahasiswa ke angka 10-30. |
| **Trinary (0 / 50 / 100)** | **0.8842** | **0.8785** | **0.7724** | **5.45** | **Kelipatan 5 / 10 (Bulat)** | **Penilaian parsial 3 tingkat (salah, typo/sebagian, sempurna). Menjaga variansi nilai tetap sehat dan logis.** |

---

## 2. Mengapa Trinary Menjadi Strategi Terbaik (Best Approach)?

### A. Adanya Nilai Parsial (Toleransi Typo Secara Proporsional)
Pada model **Binary**, kesalahan ejaan terkecil (seperti menulis ejaan variabel `im` bukan `nim`) langsung dinilai **0** pada aspek rubrik bersangkutan, memotong nilai mahasiswa hingga puluhan poin secara ekstrem.
Model **Trinary** memecahkan masalah ini dengan skema tiga tingkat:
* **100**: Kriteria terpenuhi sempurna.
* **50**: Logika kode benar, namun terdapat kesalahan minor seperti ejaan typo, kurang tanda kutip, atau tidak melampirkan screenshot.
* **0**: Tidak mengerjakan atau logika salah total.

### B. Variansi Nilai yang Sehat
* Pada metode **Relaxed**, nilai mahasiswa menumpuk di angka 80-100 karena AI terlampau toleran.
* Pada metode **Binary**, nilai anjlok ke angka ekstrem (banyak yang mendapat 10 s.d 40).
* Pada metode **Trinary**, sebaran nilai terdistribusi secara normal di rentang **50 s.d 100**, yang sangat mencerminkan kondisi riil di kelas akademis.

### C. Pembulatan Bersih Tanpa Desimal
Dengan 10 aspek penilaian masing-masing berbobot 10%, seluruh nilai akhir yang dihasilkan terjamin berupa **bilangan bulat bersih** kelipatan 5 atau 10 (tidak ada nilai desimal seperti `85.1` atau `79.9`), sesuai dengan rubrik standar yang diinginkan oleh dosen pembimbing Anda.

---

## 3. Rangkuman Narasi untuk Sidang Skripsi

Anda dapat menggunakan tabel dan poin di bawah ini sebagai bahan slide presentasi / naskah argumen sidang:

* **Pernyataan Masalah**: Penilaian otomatis basis data SQL seringkali menghadapi dilema antara terlalu toleran (nilai menumpuk tinggi) atau terlalu kaku (nilai mahasiswa terjun bebas akibat typo kecil).
* **Solusi**: Penerapan rubrik bertingkat tiga tingkat (Trinary: 0, 50, 100) memberikan titik tengah terbaik dengan mengizinkan pemberian skor parsial (50%) untuk kesalahan minor.
* **Pembuktian Statistik**: Evaluasi menggunakan metode Trinary membuktikan keselarasan yang sangat tinggi terhadap subjektivitas dosen dengan koefisien korelasi Pearson $r = 0.8842$ dan Spearman $\rho = 0.8785$, dengan tingkat kesalahan rata-rata (MAE) terkecil sebesar 5.45 poin.
