# BAB IV
# HASIL DAN PEMBAHASAN

## 4.1. Implementasi Antarmuka Sistem
Sistem *Smart Assistant Lecturer* (SAL) diimplementasikan berbasis web menggunakan framework Next.js, Supabase BaaS (*Backend-as-a-Service*), dan Groq API dengan model `openai/gpt-oss-120b`. Lapisan middleware bertindak sebagai pengorkestrasi instruksi dosen, rubrik penilaian, dan konteks jawaban mahasiswa secara terstruktur.

Berikut adalah antarmuka utama sistem yang dikembangkan:
1. **Antarmuka Pembuatan Tugas (`/dosen/buat-tugas`)**: Digunakan oleh dosen untuk mengisi soal esai, dokumen acuan materi (*knowledge grounding context*), serta pengaturan 10 aspek rubrik penilaian berbobot 10%.
2. **Antarmuka Dashboard Dosen (`/dosen`)**: Menampilkan rekapitulasi nilai mahasiswa serta indikator status koreksi ("Dinilai AI" dan "Koreksi Dosen").
3. **Antarmuka Validasi dan Koreksi Dosen (`/dosen/validasi/[id]`)**: Menampilkan rincian jawaban mahasiswa, skor per aspek rubrik, justifikasi *Chain-of-Thought* (CoT), serta fitur penyuntingan skor manual (*override*).
4. **Antarmuka Portal Mahasiswa (`/tugas/[id]`)**: Digunakan mahasiswa untuk mengunggah dokumen jawaban (`.pdf`, `.docx`, `.txt`) dan melihat umpan balik otomatis dari sistem.

---

## 4.2. Hasil Iterasi Perbaikan Prototype Sistem
Pengembangan sistem mengikuti metode **Prototyping** yang dilaksanakan melalui dua tahap iterasi perbaikan utama untuk memastikan keluaran penilaian AI selaras dengan standar dosen pengampu.

### 4.2.1. Iterasi 1 (Prototype Awal - Penilaian Biner / Binary Scoring)
Pada Iterasi 1, sistem menerapkan skema penilaian biner (0 atau 100) untuk setiap aspek rubrik.
* **Hasil Pengujian Statistik**:
  * Kendall's Tau ($\tau$) : **0.4400**
  * Mean Absolute Error (MAE) : **18.33 Poin**
* **Evaluasi Dosen**:
  Pengujian pada 33 dokumen jawaban mahasiswa menghasilkan kesalahan yang tinggi (MAE = 18.33 poin) karena AI memberikan skor 0 untuk kesalahan minor seperti kesalahan tanda kutip atau tipografi (*typo*). Dosen merekomendasikan perlunya skema penilaian parsial untuk menampung jawaban yang secara logika benar namun memiliki kesalahan kecil.

### 4.2.2. Iterasi 2 (Prototype Final - Penilaian Kredit Parsial 3-Tingkat / 3-Point Partial Credit Rubric)
Pada Iterasi 2, logika penilaian diperbarui mengadopsi prinsip *3-Point Partial Credit Rubric* (Masters, 1982; Haller et al., 2022). Skema ini membagi penilaian ke dalam tiga tingkatan skor (0, 50, 100) pada 10 aspek rubrik berbobot 10%.

1. **Aturan Skor Mentah (Raw Score)**:
   * **Skor 100 (*Full Credit*)**: Terpenuhi secara sempurna tanpa kesalahan.
   * **Skor 50 (*Partial Credit*)**: Terpenuhi sebagian (terdapat *typo* minor, kelalaian tanda kutip, atau tanpa bukti *screenshot*).
   * **Skor 0 (*No Credit*)**: Salah total, tidak lengkap, atau tidak mengumpulkan.
2. **Hasil Pengujian Statistik Final**:
   * Kendall's Tau ($\tau$) : **`0.7724`** (*Strong Rank Correlation*)
   * Mean Absolute Error (MAE) : **`5.45 Poin`**
3. **Dampak Perbaikan**:
   Penerapan skema *3-Point Partial Credit Rubric* pada Iterasi 2 berhasil meningkatkan keselarasan peringkat sebesar **+75.5%** (Kendall's Tau naik dari 0.4400 menjadi 0.7724) dan menurunkan rata-rata kesalahan skor sebesar **-70.3%** (MAE turun dari 18.33 poin menjadi 5.45 poin). Seluruh skor akhir berupa bilangan bulat bersih (kelipatan 5 atau 10). Prototype Versi 2 disetujui sebagai sistem final.

**Tabel 4.1 Perbandingan Hasil Iterasi Perbaikan Prototype**

| Tahap Prototype | Metode Penilaian | Kendall's Tau ($\tau$) | MAE (Poin) | Evaluasi Dosen |
| :--- | :--- | :---: | :---: | :--- |
| **Iterasi 1 (Awal)** | Binary Scoring (0 / 100) | 0.4400 | 18.33 | Terlalu kaku pada kesalahan minor. |
| **Iterasi 2 (Final)** | 3-Point Partial Credit | **0.7724** | **5.45** | **DISETUJUI**: Keselarasan tinggi & error terkecil. |

---

## 4.3. Analisis Statistik dan Keandalan AI
Pengujian dilakukan pada 33 sampel dokumen jawaban praktikum basis data SQL retrospektif mahasiswa Program Studi Teknik Informatika Universitas Muhammadiyah Bandung dengan membandingkan skor AI terhadap skor dosen pengampu (*ground truth*).

### 4.3.1. Analisis Keselarasan Peringkat (Kendall's Tau Correlation Coefficient $\tau$)
Diperoleh nilai Kendall's Tau sebesar $\tau = 0.7724$, yang mengindikasikan tingkat keselarasan peringkat yang sangat kuat. Hal ini membuktikan bahwa logika penalaran model `openai/gpt-oss-120b` melalui middleware mampu meniru urutan prioritas penilaian dosen secara konsisten.

### 4.3.2. Analisis Kesalahan Skor (Mean Absolute Error / MAE)
Diperoleh nilai MAE sebesar 5.45 poin. Hal ini menunjukkan bahwa rata-rata deviasi nilai AI dari dosen hanya meleset sebesar 5.45 poin pada skala 0–100 (setara deviasi 5%), yang membuktikan presisi tinggi sistem sebagai asisten koreksi.

### 4.3.3. Evaluasi Knowledge Grounding dan Chain-of-Thought (CoT)
Rendahnya kesalahan (MAE = 5.45) dan tingginya keselarasan ($\tau = 0.7724$) didukung oleh dua fungsi utama middleware:
1. **Knowledge Grounding**: Mengunci penalaran AI pada dokumen referensi materi dan rubrik dosen untuk memitigasi halusinasi (Ji et al., 2023).
2. **Chain-of-Thought (CoT)**: Memicu AI untuk menyusun justifikasi rasional secara bertahap sebelum mengeluarkan keputusan skor akhir (Stahl et al., 2024).

---

## 4.4. Pembahasan dan Implikasi Hasil
Penerapan arsitektur *provider-agnostic middleware* yang dikombinasikan dengan *3-Point Partial Credit Rubric* terbukti efektif memangkas waktu koreksi dan mereduksi beban kelelahan kognitif dosen. Fitur validasi dan penyuntingan manual (*override*) memastikan bahwa otoritas nilai akhir tetap berada secara mutlak di tangan dosen pengampu.

