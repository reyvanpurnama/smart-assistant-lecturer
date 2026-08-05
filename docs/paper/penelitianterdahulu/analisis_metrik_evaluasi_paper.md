# Analisis & Justifikasi Metrik Evaluasi: SAL (Kendall's Tau & MAE) vs Paper Terdahulu (QWK)

Dokumen ini disusun untuk memberikan **justifikasi teoretis dan matematis yang kuat pada sidang akhir** mengenai alasan mengapa sistem **Smart Assistant Lecturer (SAL)** menggunakan kombinasi metrik **Kendall's Tau ($\tau$)** dan **Mean Absolute Error (MAE)**, alih-alih mengikuti kebiasaan paper terdahulu yang mayoritas memakai **Quadratic Weighted Kappa (QWK)**.

---

## 1. Ringkasan Metrik pada Paper Terdahulu

| No | Paper / Peneliti | Metrik Utama yang Dipakai | Alasan/Karakteristik Penelitian |
|----|------------------|---------------------------|----------------------------------|
| 1 | **Mizumoto & Eguchi (2023)** | QWK, Exact/Adjacent Agreement, Pearson $r$ | Esai panjang skala interval luas (0-5 / 0-100), dataset besar (*large corpus*). |
| 2 | **Pack, Barrett, & Escalante (2024)** | QWK, Exact/Adjacent Agreement | Penilaian esai bahasa inggris bertingkat pada skala ordinal luas. |
| 3 | **Stahl et al. (2024)** | QWK, **MAE**, RMSE, $F_1$-Score | Penilaian esai pendek dengan kombinasi error numerik (MAE) dan kesepakatan ordinal. |
| 4 | **Haller et al. (2022/2024)** | QWK, Accuracy, $F_1$-Score, RMSE | Dataset benchmark publik berskala besar (SciEntsBank, ASAP-SAS). |
| 5 | **Chen & Wan (2024)** | SMD, Exact Match, $F_1$-Score, QWK | Penilaian rubrik multi-item berbasis binary vectors (1/0). |

---

## 2. Perbandingan Komparatif Metrik: QWK vs Kendall's Tau ($\tau$) & MAE

### A. Quadratic Weighted Kappa (QWK) — *Keterbatasan pada SAL*
* **Cara Kerja:** Mengukur kesepakatan ordinal dengan penalti kuadrat *dikurangi faktor kebetulan (chance agreement)*.
* **Kelemahan/Kelemahan Utama QWK pada Kasus SAL:**
  1. **Kappa Paradox (Sensitif terhadap Imbalansi Data):** QWK sangat rentan terhadap *marginal distribution bias*. Jika mayoritas mahasiswa mendapatkan nilai tinggi (misal 0.5 dan 1.0), QWK akan **anjlok drastis** secara artifisial meskipun tingkat kesepakatan riil antara dosen dan AI sangat tinggi.
  2. **Penalti Kuadrat Terlalu Ekstrem:** QWK memadratkan selisih nilai ($e^2$). Pada skema 3-point partial credit (0, 0.5, 1.0), selisih 0.5 poin dihukum seolah-olah kesalahan kategorikal penuh, padahal secara pedagogis selisih tersebut adalah variasi pemahaman parsial.
  3. **Membutuhkan Ukuran Sampel Sangat Besar:** QWK membutuhkan ribuan sampel data agar estimasi tabel matriks kontingensi stabil.

---

### B. Kendall's Tau ($\tau$) — *Keunggulan untuk SAL*
* **Cara Kerja:** Metrik non-parametrik yang mengukur **korelasi urutan (concordance vs discordance pairs)** antar dua evaluator ordinal.
* **Mengapa Sangat Tepat untuk SAL?**
  1. **Tahan terhadap Distribusi Data Non-Normal:** Jawaban nilai mahasiswa praktikum/kelas nyata sering kali tidak berdistribusi normal. Kendall's Tau tidak mengasumsikan distribusi normal.
  2. **Evaluasi Konsistensi Ranking/Monotonis:** Kendall's Tau membuktikan bahwa jika dosen memberikan nilai Mahasiswa A > Mahasiswa B, AI SAL juga secara konsisten mengurutkan Mahasiswa A > Mahasiswa B.
  3. **Lebih Stabil pada Ukuran Sampel Kelas (N terbatas):** Sangat ideal dan akurat untuk mengevaluasi data pengujian skala praktikum per kelas (tens to hundreds of responses).

---

### C. Mean Absolute Error (MAE) — *Keunggulan untuk SAL*
* **Cara Kerja:** Menghitung **rata-rata selisih mutlak secara eksplisit** dalam skala skor asli (0.00 hingga 1.00).
* **Mengapa Sangat Tepat untuk SAL?**
  1. **Interpretabilitas Langsung secara Pedagogis:** Nilai MAE memiliki satuan langsung yang dapat dipahami dosen. Contoh: Jika MAE = **0.05**, artinya rata-rata selisih nilai yang diberikan AI dibanding dosen hanya sebesar **0.05 poin** pada skala 1.0.
  2. **Linier & Transparan (Tidak Manipulatif):** MAE tidak menyembunyikan kesalahan di balik statistik "chance-adjusted" Kappa yang rumit, melainkan memperlihatkan simpangan riil nilai mahasiswa secara objektif.

---

## 3. BAHAN JAWABAN SIDANG (Justifikasi Kenapa SAL Tidak Pakai QWK)

> **Pertanyaan Dosen Penguji:**  
> *"Kenapa kamu menggunakan Kendall's Tau ($\tau$) dan MAE, sedangkan mayoritas paper terdahulu (Mizumoto, Pack, Haller) menggunakan Quadratic Weighted Kappa (QWK)?"*

> **Jawaban Bertahan (Defense Script):**  
> *"Terima kasih atas pertanyaannya Bapak/Ibu Penguji. Pemilihan **Kendall's Tau ($\tau$)** dan **MAE** dilakukan secara terukur berdasarkan sifat skema penilaian dan skala data pada penelitian ini:*  
>  
> 1. **Penggunaan MAE (Mean Absolute Error):** Karena SAL mengadopsi skema *3-Point Partial Credit* (skala 0, 0.5, 1.0), MAE memberikan tingkat **interpretabilitas pedagogis secara langsung**. MAE menunjukkan persis berapa rata-rata simpangan nilai numerik AI terhadap dosen tanpa distorsi kuadratik seperti pada QWK.  
> 2. **Penggunaan Kendall's Tau ($\tau$):** QWK memiliki keterbatasan berupa *Kappa Paradox*, yaitu nilai QWK akan turun drastis secara artifisial jika terjadi ketimpangan distribusi nilai (*class imbalance*) pada data kelas. Sebaliknya, **Kendall's Tau ($\tau$)** adalah tes korelasi kualitatif ordinal non-parametrik yang terbukti lebih stabil dan presisi dalam mengukur konsistensi pemeringkatan (*concordance*) antara AI dan dosen pada data evaluasi tingkat praktikum.  
> 3. *Peneliti seperti **Stahl et al. (2024)** juga memanfaatkan MAE sebagai metrik error numerik utama dalam evaluasi esai pendek berbasis CoT.*"
