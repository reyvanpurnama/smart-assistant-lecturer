# Rencana Penyederhanaan UI/UX untuk Sidang Skripsi
*Smart Assistant Lecturer (SAL)*

Dokumen ini berisi rencana perubahan istilah dan visual pada antarmuka aplikasi SAL. Tujuannya adalah menyederhanakan istilah-istilah teknis SaaS (Software-as-a-Service), *machine learning*, dan riset khusus yang terlalu rumit, menjadi istilah sistem informasi akademik standar yang mudah dipahami oleh dosen penguji saat sidang skripsi.

---

## 🖥️ 1. Halaman Utama / Landing Page (`src/app/page.tsx`)
Halaman ini sudah cukup baik, namun ada beberapa istilah kecil yang perlu diselaraskan.

| Elemen UI / Label Asli | Istilah Baru (Sederhana) | Alasan Perubahan |
| :--- | :--- | :--- |
| "...mengunci parameter grounding & kriteria rubrik..." | "...mengelola kunci jawaban, kriteria rubrik, dan memvalidasi nilai..." | Istilah "grounding" terlalu teknis untuk proses bisnis biasa dosen. |
| "Sistem Sidang Skripsi IT" | "Portal Praktikum Mahasiswa" / "Sistem Asisten Dosen" | Mengubah kesan dari "sistem uji coba" menjadi sistem portal akademik riil. |

---

## 🧑‍🏫 2. Dashboard Dosen (`src/app/dosen/page.tsx`)

| Elemen UI / Label Asli | Istilah Baru (Sederhana) | Alasan Perubahan |
| :--- | :--- | :--- |
| **Tombol:** "Ekspor data QWK/Pearson (.csv)" | **Tombol:** "Unduh Rekap Nilai (.csv)" | Dosen penguji atau dosen pengampu secara praktis hanya butuh "Unduh Rekap Nilai", komputasi statistik dilakukan di luar sistem. |
| **Status:** `Graded` | **Status:** `Dinilai AI` | Mempermudah pemahaman bahwa tugas tersebut selesai dinilai oleh sistem. |
| **Status:** `Overridden` | **Status:** `Koreksi Dosen` | Menghilangkan kata serapan bahasa Inggris (*overridden*). |
| **Status:** `Outlier` | **Status:** `Perlu Tinjauan` | Istilah statistika "outlier" diganti dengan istilah operasional dosen. |
| **Alert:** "Dataset ini siap digunakan untuk komputasi QWK dan Pearson di Google Colab." | **Alert:** "Berkas rekap nilai (.csv) berhasil diunduh!" | Menghapus narasi teknis riset dari alur kerja operasional aplikasi dosen. |

---

## 📝 3. Halaman Buat Tugas Dosen (`src/app/dosen/buat-tugas/page.tsx`)

| Elemen UI / Label Asli | Istilah Baru (Sederhana) | Alasan Perubahan |
| :--- | :--- | :--- |
| "Buat Parameter Grounding & Rubrik" | "Buat Soal & Rubrik Penilaian" | Menyelaraskan dengan menu pembuatan tugas kuliah biasa. |
| "Parameter Grounding (Jangkar Kontekstual)" | "Kunci Jawaban & Panduan Toleransi" | Dosen memahami "Kunci Jawaban" jauh lebih cepat dibanding "Grounding". |
| "Model AI Inferencing (Groq Cloud)" | "Model Kecerdasan Buatan (AI)" | Menghilangkan kerumitan infrastruktur teknis (Groq Cloud/Inferencing). |
| "Mitigasi Halusinasi AI" | "Panduan Akurasi AI" | Istilah "halusinasi" adalah jargon AI, lebih aman diganti "akurasi". |
| "Langkah Setup Evaluasi" | "Pengaturan Penilaian Tugas" | Menggunakan istilah akademik standar. |

---

## 🔍 4. Halaman Validasi & Override Nilai (`src/app/dosen/validasi/[id]/page.tsx`)

| Elemen UI / Label Asli | Istilah Baru (Sederhana) | Alasan Perubahan |
| :--- | :--- | :--- |
| "Validasi & Override Nilai" | "Validasi & Koreksi Nilai" | Menghapus istilah teknis "override". |
| "AI Chain-of-Thought (Logs)" | "Log Proses Penalaran AI" / "Alasan Penilaian AI" | Memberikan pemahaman instan tentang transparansi cara AI menilai. |
| "AI Reason/Feedback" | "Penjelasan AI" | Sederhana dan langsung pada intinya. |
| "AI Evaluated" | "Nilai Sistem AI" | Istilah status yang lebih informatif. |
| "Overridden (Dosen)" | "Hasil Koreksi Dosen" | Mengonfirmasi otoritas manual dosen. |
| **Tombol:** "Reset ke AI" | **Tombol:** "Gunakan Nilai AI" | Mempermudah dosen mengembalikan skor ke hitungan awal sistem. |
| **Tombol:** "Simpan & Sahkan Nilai" | **Tombol:** "Simpan Nilai" | Lebih bersih dan fokus pada penyimpanan data. |

---

## 🧑‍🎓 5. Portal Pengumpulan Mahasiswa (`src/app/mahasiswa/page.tsx`)

| Elemen UI / Label Asli | Istilah Baru (Sederhana) | Alasan Perubahan |
| :--- | :--- | :--- |
| **Tombol:** "Kirim & Nilai Jawaban dengan AI" | **Tombol:** "Kumpulkan Jawaban" | Mahasiswa secara psikologis mengumpulkan tugas, penilaian AI terjadi di latar belakang. |
| "Mengevaluasi Jawaban dengan AI..." | "Mengirim & Menilai Jawaban..." | Proses loading yang lebih natural bagi mahasiswa. |

---

## 📊 6. Halaman Umpan Balik Mahasiswa (`src/app/mahasiswa/hasil/[id]/page.tsx`)

| Elemen UI / Label Asli | Istilah Baru (Sederhana) | Alasan Perubahan |
| :--- | :--- | :--- |
| "AI Evaluator Sedang Bekerja" | "Sistem Sedang Memeriksa Jawaban" | Mengurangi kesan "AI-centric" menjadi "System-centric". |
| **Loading 3:** "Mencocokkan jawaban dengan Modul Grounding..." | **Loading 3:** "Mencocokkan dengan Kunci Jawaban..." | Istilah yang ramah pengguna. |
| **Loading 4:** "Menjalankan inferensi kognitif..." | **Loading 4:** "Menganalisis Logika Jawaban..." | Menyembunyikan kerumitan model AI. |
| **Loading 5:** "Mem-parsing output kriteria & memvalidasi skor..." | **Loading 5:** "Menghitung Nilai Akhir..." | Istilah yang lebih umum. |
| "Skor AI Kumulatif" | "Nilai Akhir AI" | Mengganti "kumulatif" (yang kurang tepat karena ini tugas tunggal) menjadi "Nilai Akhir". |
| "...override nilai akhir sebelum disahkan ke portal KRS." | "...koreksi nilai akhir jika terdeteksi kesalahan pembacaan kode." | Menghapus kata "KRS" (terlalu jauh untuk skala tugas praktikum tunggal). |

---

## 🛠️ Langkah Integrasi Selanjutnya:
Apakah rencana pemetaan kata/istilah di atas sudah sesuai dengan keinginan Anda? 

Jika **Setuju**, saya akan mulai mengaplikasikan perubahan teks ini ke berkas-berkas halaman frontend di workspace secara bertahap. Mohon konfirmasi atau berikan masukan jika ada istilah yang kurang pas!
