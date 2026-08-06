# Analisis & Justifikasi Metrik Evaluasi: SAL (Kendall's Tau-b & MAE) vs Paper Terdahulu (QWK & Pearson)

Dokumen ini disusun untuk memberikan **justifikasi teoretis dan matematis yang kuat pada sidang akhir** mengenai alasan mengapa sistem **Smart Assistant Lecturer (SAL)** mengombinasikan metrik **Kendall's Tau-b ($\tau_b$)** dan **Mean Absolute Error (MAE)**, alih-alih mengikuti kebiasaan paper terdahulu yang mayoritas memakai **Quadratic Weighted Kappa (QWK)** atau Pearson $r$.

---

## 1. Ringkasan Metrik pada Paper Terdahulu & Literatur Acuan

| No | Paper / Peneliti | Metrik Utama yang Dipakai | Alasan / Karakteristik Penelitian |
|----|------------------|---------------------------|----------------------------------|
| 1 | **Bhat & Varma (2026)** | **Kendall's Tau-b ($\tau_b$)** | Penilaian *LLM-as-a-Judge* atributif bertingkat dengan penanganan *ties* (nilai kembar). |
| 2 | **Yeung (2025)** | **MAE**, RMSE | Evaluasi presisi deviasi fisik poin numerik AI vs manusia pada *short answer grading*. |
| 3 | **Akoglu (2018)** | **Kendall's Tau-b ($\tau_b$)** | Panduan standar koefisien korelasi data ordinal non-parametrik bertingkat. |
| 4 | **Mizumoto & Eguchi (2023)** | QWK, Exact/Adjacent Agreement, Pearson $r$ | Esai panjang skala interval luas (0-5 / 0-100), dataset besar (*large corpus*). |
| 5 | **Pack, Barrett, & Escalante (2024)** | QWK, Exact/Adjacent Agreement | Penilaian esai Bahasa Inggris bertingkat pada skala ordinal luas. |
| 6 | **Stahl et al. (2024)** | QWK, **MAE**, RMSE, $F_1$-Score | Penilaian esai pendek dengan kombinasi error numerik (MAE) dan kesepakatan ordinal. |
| 7 | **Haller et al. (2022/2024)** | QWK, Accuracy, $F_1$-Score, RMSE | Dataset benchmark publik berskala besar (SciEntsBank, ASAP-SAS). |

---

## 2. Perbandingan Komparatif Metrik: Mengapa Kendall's Tau-b & MAE?

### A. Quadratic Weighted Kappa (QWK) — *Keterbatasan pada SAL*
* **Cara Kerja:** Mengukur kesepakatan ordinal dengan penalti kuadrat *dikurangi faktor kebetulan (chance agreement)*.
* **Kelemahan Utama QWK pada Penelitian SAL:**
  1. **Kappa Paradox (Bias Imbalansi Data):** QWK sangat rentan terhadap *marginal distribution bias*. Jika mayoritas mahasiswa mendapatkan nilai tinggi (misal 50 dan 100), QWK akan **anjlok drastis** secara artifisial meskipun tingkat kesepakatan riil antara dosen dan AI sangat tinggi.
  2. **Penalti Kuadrat Terlalu Ekstrem:** QWK memadratkan selisih nilai ($e^2$). Pada skema *3-Point Partial Credit* (0, 50, 100), selisih 50 poin dihukum seolah-olah kesalahan kategorikal penuh, padahal secara pedagogis selisih tersebut adalah variasi pemahaman parsial (*partial credit*).
  3. **Membutuhkan Ukuran Sampel Sangat Besar:** QWK membutuhkan ribuan sampel data agar matriks kontingensi stabil.

---

### B. Kendall's Tau-b ($\tau_b$) — *Keunggulan Utama untuk SAL*
* **Cara Kerja:** Metrik non-parametrik yang mengukur **korelasi hirarki urutan (concordant vs discordant pairs)** antar dua evaluator dengan mengoreksi faktor nilai kembar (*ties*).
* **Mengapa Sangat Tepat untuk SAL? (Bhat & Varma, 2026; Akoglu, 2018):**
  1. **Koreksi Nilai Kembar (Ties Correction):** Data skor 33 mahasiswa memiliki **71 pasang nilai kembar (ties)** pada skor dosen. Kendall's Tau-b mengoreksi rumusnya dengan penyebut $\sqrt{(P + Q + T_x)(P + Q + T_y)}$ sehingga hasilnya ($0.7724$) murni menggambarkan keselarasan hirarki.
  2. **Tahan terhadap Distribusi Data Non-Normal:** Jawaban nilai mahasiswa praktikum tidak berdistribusi normal. Kendall's Tau-b tidak memerlukan asumsi distribusi normal linier.
  3. **Presisi pada Data Skala Ordinal Bertingkat:** Membuktikan bahwa jika dosen memberi nilai Mahasiswa A > Mahasiswa B, AI SAL juga secara konsisten mengurutkan Mahasiswa A > Mahasiswa B.

---

### C. Mean Absolute Error (MAE) — *Keunggulan Utama untuk SAL*
* **Cara Kerja:** Menghitung **rata-rata selisih mutlak fisik secara linier** dalam poin skor asli (0.00 hingga 100.00).
* **Mengapa Sangat Tepat untuk SAL? (Yeung, 2025):**
  1. **Interpretabilitas Langsung secara Pedagogis:** Nilai MAE memiliki satuan poin langsung yang mudah dipahami dosen. MAE = **5.45 poin** berarti rata-rata selisih fisik skor AI dibanding dosen hanya 5.45 poin pada skala 100.
  2. **Linier & Transparan:** MAE tidak membesarkan kesalahan secara kuadratik seperti RMSE dan tidak menyembunyikan kesalahan di balik statistik "chance-adjusted" Kappa yang rumit.

---

## 3. BAHAN JAWABAN SIDANG (Defense Script Tangkisan Dosen Kritis)

### SKENARIO A: Perbandingan Metrik (QWK/Pearson vs Kendall's Tau-b & MAE)
🗣️ **Penguji:** *"Kenapa kamu menggunakan Kendall's Tau-b dan MAE, sedangkan mayoritas paper terdahulu (Mizumoto, Pack, Haller) menggunakan Quadratic Weighted Kappa (QWK) atau Pearson r?"*

> 🎙️ **Jawaban Bertahan Reyvan (60 Detik):**  
> *"Terima kasih atas pertanyaannya Bapak/Ibu Penguji. Pemilihan **Kendall's Tau-b ($\tau_b$)** dan **MAE** dilakukan secara sangat terukur berdasarkan sifat data dan skema penilaian 3-Point Partial Credit:*  
>  
> *1. **Alasan Penggunaan Kendall's Tau-b ($\tau_b$):** Sesuai acuan mutakhir **Bhat & Varma (2026)** serta **Akoglu (2018)**, Kendall's Tau-b adalah tes korelasi non-parametrik yang mampu mengoreksi faktor nilai kembar (ties). Pada data 33 mahasiswa kami, terdapat 71 pasang nilai kembar pada skor dosen. Jika menggunakan Pearson atau QWK, timbul kendala **Kappa Paradox**, di mana nilai korelasi bisa anjlok artifisial akibat imbalansi distribusi nilai. Tau-b membuktikan keselarasan hirarki peringkat AI vs dosen sebesar 0.7724 secara objektif.*  
> 
> *2. **Alasan Penggunaan MAE (Yeung, 2025):** MAE mengukur deviasi fisik skor secara linier ($|y - \hat{y}|$) tanpa memberi penalti kuadratik yang berlebihan. Nilai MAE sebesar 5.45 poin memberikan **interpretabilitas pedagogis langsung** bagi dosen pengampu.*  
> 
> *Peneliti seperti **Stahl et al. (2024)** juga memanfaatkan MAE sebagai metrik deviasi fisik utama pada penilaian esai bertahap berbasis CoT."*

---

### SKENARIO B: Pemilihan Metrik Secara A-Priori (Sebelum Eksperimen Dijalankan)
🗣️ **Penguji:** *"Metrik ini kan sudah kamu tentukan secara a-priori di Bab 1. Waktu Seminar Proposal kamu belum tahu hasil datanya kan? Kenapa sejak Bab 1 kamu sudah bisa yakin bahwa Kendall's Tau-b dan MAE adalah metrik yang paling cocok, padahal kamu belum tahu ada ties atau bagaimana distribusi datanya?"*

> 🎙️ **Jawaban Bertahan Reyvan (Secara Metodologis & Logis):**  
> *"Pertanyaan yang sangat jeli Bapak/Ibu Penguji. Penentuan metrik secara **a-priori** di Bab 1 tidak didasarkan pada 'menebak' hasil data, melainkan berpijak pada **dua prinsip perancangan metodologis (by design)**:*  
>  
> *1. **Karakteristik Domain Penilaian Dosen (Kenyataan Ordinal & Kemungkinan Ties):** Secara teoritis di bidang kependidikan, penilaian esai/praktikum pada populasi 30+ mahasiswa pasti memiliki skor yang diskrit dan berulang (ordinal bertingkat). Dosen secara ilmiah hampir dipastikan akan memberikan angka yang sama pada beberapa mahasiswa. Oleh karena itu, sejak perancangan Bab 1, kami secara sengaja memilih **Kendall's Tau-b** (bukan Kendall's Tau-a atau Pearson) karena rumusnya dari awal memang dirancang khusus untuk mengantisipasi *ties* (skor kembar) pada sampel data ordinal.*  
> 
> *2. **Pendekatan Evaluasi Dua Dimensi yang Saling Melengkapi (Multi-Dimensional Metric):** Sejak awal perancangan, kami membutuhkan dua metrik independen untuk mengevaluasi dua dimensi kualitas AI yang berbeda:*  
>    * *Dimensi 1 (Konsistensi Peringkat Relatif):* Diukur oleh **Kendall's Tau-b** untuk memastikan AI tidak membolak-balikkan peringkat mahasiswa yang kompeten vs yang kurang kompeten.  
>    * *Dimensi 2 (Presisi Deviasi Fisik Skor):* Diukur oleh **MAE** agar besarnya selisih poin fisik AI terhadap dosen dapat diinterpretasikan secara transparan dalam skala 0-100 poin.*  
> 
> *Jadi, fakta bahwa ditemukannya 71 pasang ties saat data dikumpulkan di Bab 4 semakin memvalidasi bahwa asumsi a-priori yang kami rancang di Bab 1 sudah sangat tepat secara ilmiah."*
