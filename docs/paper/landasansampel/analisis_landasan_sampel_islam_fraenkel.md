# 📖 ANALISIS RINGKASAN PAPER LANDASAN SAMPEL N = 33 (ISLAM 2018 & FRAENKEL 2019)

> **Tujuan Dokumen:** Menyediakan ringkasan eksekutif, kutipan langsung, dan poin tangkisan ilmiah untuk mempertahankan kecukupan ukuran sampel retrospektif $N = 33$ mahasiswa pada Sidang Skripsi Smart Assistant Lecturer (SAL).

---

## 1. 📄 PAPER 1: MOHAMMAD RAFIQUL ISLAM (2018)
* **Judul Paper:** *Sample Size and Its Role in Central Limit Theorem (CLT)*
* **Jurnal:** Computational and Applied Mathematics Journal, 4(1), 1-7.
* **Sitasi Resmi:** `Islam, M. R. (2018). Sample Size and Its Role in Central Limit Theorem (CLT). Computational and Applied Mathematics Journal, 4(1), 1-7.`

### 💡 Poin Utama & Kutipan Kunci:
1. **Aturan Dasar Central Limit Theorem (CLT):**
   > *"One of the simplest versions of the theorem says that if $X$ is a random sample of size $n$ (say, $n$ larger than 30) from an infinite population... then the sample mean approaches a normal distribution."* (Hal. 5-6)
2. **Standard Rule of Thumb ($N \ge 30$):**
   > *"It is often suggested that a sample size of 30 will produce an approximately normal sampling distribution for the sample mean from a non-normal parent distribution."* (Hal. 6)
3. **Kecukupan Estimasi Parameter:**
   > *"If $\sigma$ is not available, one could take a preliminary sample size, $n \ge 30$ to provide an estimate of $\sigma$."* (Hal. 3)

### 🎯 Implementasi Pada Skripsi SAL ($N = 33$):
* Jumlah sampel $N = 33$ mahasiswa pada penelitian retrospektif SAL telah melampaui ambang batas $N = 30$.
* Berdasarkan CLT, rata-rata deviasi fisik (MAE = 5.45) dan korelasi hirarki ($\tau_b = 0.7724$) dari 33 sampel ini secara statistik sah untuk menggambarkan estimasi performa inferensi AI pada populasi mahasiswa dengan tipe soal sejenis.

---

## 2. 📘 PAPER 2: JACK R. FRAENKEL, NORMAN E. WALLEN, & HELEN H. HYUN (2019)
* **Judul Buku/Paper:** *How to Design and Evaluate Research in Education* (10th ed.).
* **Penerbit:** McGraw-Hill Education.
* **Sitasi Resmi:** `Fraenkel, J. R., Wallen, N. E., & Hyun, H. H. (2019). How to Design and Evaluate Research in Education (10th ed.). McGraw-Hill Education.`

### 💡 Poin Utama & Kutipan Kunci:
1. **Ambang Batas Minimum Sampel Penelitian Pendidikan:**
   * Fraenkel et al. (2019, Bab 6 *Sampling*, Hal. 102) merekomendasikan bahwa untuk studi korelasional atau evaluasi instrumen kuasi-eksperimental, jumlah sampel **minimum 30 subjek** dianggap dapat diterima secara metodologis (*minimum acceptable sample size = 30*).
2. **Penggunaan Intact Class (Kelas Utuh / Retrospektif):**
   * Dalam penelitian pendidikan/praktikum, pengujian sering kali menggunakan sampel kelompok utuh (*intact classroom*) yang terdaftar dalam satu semester. Sampel 1 kelas praktikum ($N = 33$) memberikan keabsahan ekologis (*ecological validity*) karena mencerminkan variabilitas riil mahasiswa yang menempuh mata kuliah tersebut.

---

## 🛡️ Naskah Jawaban Tangkisan Reyvan Saat Sidang (Q&A Defense):

🗣️ **Penguji:** *"Kenapa sampel evaluasi kamu cuma 33 mahasiswa? Apakah 33 data ini cukup secara statistik untuk mengambil kesimpulan?"*

> 🎙️ **Jawaban Tangkisan Reyvan (45-60 Detik):**  
> *"Terima kasih atas pertanyaannya Bapak/Ibu Penguji. Penggunaan sampel $N = 33$ mahasiswa pada penelitian ini sangat sah dan kuat secara metodologis ilmiah berdasarkan dua landasan utama:*
> 
> *Pertama, secara statistik inferensial, merujuk pada **Central Limit Theorem (CLT) oleh Islam (2018)**, batas sampel $N \ge 30$ adalah ambang batas standar di mana distribusi rerata sampel mulai konvergen mendekati distribusi normal, sehingga estimasi metrik seperti MAE dan Kendall's Tau-b dapat dipercaya secara inferensial.*
> 
> *Kedua, dari sudut pandang metodologi penelitian pendidikan menurut **Fraenkel et al. (2019)**, untuk evaluasi instrumen kuasi-eksperimental maupun retrospektif berbasis kelas utuh (intact class), sampel minimum 30 subjek sudah memenuhi syarat kelayakan. Dengan $N = 33$ jawaban esai SQL mahasiswa riil kelas IF23A, data ini sudah memberikan variabilitas yang representatif untuk menguji ketepatan penilaian middleware SAL."*
