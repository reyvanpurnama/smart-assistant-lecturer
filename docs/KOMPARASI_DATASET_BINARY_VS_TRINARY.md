# MATRIKS KOMPARASI EVALUASI JAWABAN MAHASISWA: ITERASI 1 (BINARY) VS ITERASI 2 (3-POINT PARTIAL CREDIT)

Dokumen ini berisi rekapitulasi data komparasi penilaian otomatis Smart Assistant Lecturer (SAL) pada 33 dokumen jawaban mahasiswa retrospektif (Kelas IF23A - Mata Kuliah Basis Data Lanjut IF204). Dokumen ini disiapkan sebagai acuan cepat dan bahan presentasi sidang skripsi.

---

## 📊 1. Ringkasan Perbandingan Performa Utama

| Metrik Evaluasi | Iterasi 1 (Binary Scoring 0/100) | Iterasi 2 (3-Point Partial Credit 0/50/100) | Persentase Perubahan | Keterangan Evaluasi |
| :--- | :---: | :---: | :---: | :--- |
| **Mean Absolute Error (MAE)** | **18.33 poin** | **5.45 poin** | **-70.3% (Turun Drastis)** | Deviasi kesalahan fisik skor AI berkurang jauh mendekati nilai dosen |
| **Kendall's Tau-b ($\tau_b$)** | **0.4400** | **0.7724** | **+75.5% (Naik Signifikan)** | Keselarasan hirarki peringkat logika AI terhadap dosen menjadi sangat kuat |
| **Skema Rubrik** | Terlampau Kaku (0 / 100) | Akomodatif Parsial (0 / 50 / 100) | + Chain-of-Thought (CoT) | Typos/kelalaian minor diakomodasi skor parsial (skor 50) |

---

## 📋 2. Matriks Komparasi 33 Mahasiswa Retrospektif (Side-by-Side)

Berikut adalah data perbandingan langsung skor aktual dosen (Ground Truth) terhadap keluaran AI di Iterasi 1 (Binary) dan Iterasi 2 (Trinary Partial Credit):

| No | NIM | Nama Mahasiswa | Skor Dosen ($y$) | AI Binary ($\hat{y}_1$) | Selisih Binary $|y - \hat{y}_1|$ | AI Trinary ($\hat{y}_2$) | Selisih Trinary $|y - \hat{y}_2|$ | Status Perbaikan |
| :-: | :-: | :--- | :-: | :-: | :-: | :-: | :-: | :--- |
| 1 | 200102027 | ALLIF FADHLAN ARIIDHI | 85.00 | 95.00 | 10.00 | 90.00 | 5.00 | Error berkurang 50% |
| 2 | 230102003 | Abdullah Nurhadi Krishnamurti | 55.00 | 35.00 | 20.00 | 65.00 | 10.00 | Error berkurang 50% |
| 3 | 230102004 | Abdurrahman Lunny Irham | 85.00 | 20.00 | 65.00 | 85.00 | 0.00 | Presisi Sempurna (Error turun 65 poin) |
| 4 | 230102005 | Achmad Mahdi Adyan | 85.00 | 95.00 | 10.00 | 90.00 | 5.00 | Error berkurang 50% |
| 5 | 230102012 | Ahnaf Musyaffa | 90.00 | 75.00 | 15.00 | 80.00 | 10.00 | Error berkurang |
| 6 | 230102013 | Aisyiyah Zahra Hariah Attin | 75.00 | 40.00 | 35.00 | 70.00 | 5.00 | Error turun dari 35 ke 5 poin |
| 7 | 230102022 | ANGGA PAJRI PADILAH | 90.00 | 85.00 | 5.00 | 85.00 | 5.00 | Stabil |
| 8 | 230102025 | Arfian Setiawan | 90.00 | 85.00 | 5.00 | 90.00 | 0.00 | Presisi Sempurna |
| 9 | 230102027 | Aulia Marwah Kandari | 65.00 | 55.00 | 10.00 | 75.00 | 10.00 | Stabil |
| 10 | 230102031 | Dafffa Aqyla Riyadi | 80.00 | 50.00 | 30.00 | 80.00 | 0.00 | Presisi Sempurna (Error turun 30 poin) |
| 11 | 230102032 | Darel Saffana Darmawan | 70.00 | 75.00 | 5.00 | 80.00 | 10.00 | Terkendali |
| 12 | 230102033 | Daren Saffana Darmawan | 90.00 | 10.00 | 80.00 | 85.00 | 5.00 | Error drastis turun dari 80 ke 5 poin |
| 13 | 230102034 | Decky Registian Lesmana | 95.00 | 85.00 | 10.00 | 90.00 | 5.00 | Error berkurang 50% |
| 14 | 230102035 | DESTI NOVIANTY | 95.00 | 70.00 | 25.00 | 90.00 | 5.00 | Error turun dari 25 ke 5 poin |
| 15 | 230102036 | Fariz Rizal Subayu L. H. | 75.00 | 40.00 | 35.00 | 70.00 | 5.00 | Error turun dari 35 ke 5 poin |
| 16 | 230102038 | Diky Darmawan | 80.00 | 75.00 | 5.00 | 85.00 | 5.00 | Stabil |
| 17 | 230102041 | Fachri Fatrian Nugraha | 90.00 | 75.00 | 15.00 | 85.00 | 5.00 | Error berkurang |
| 18 | 230102042 | Fahmi Maulana Sitakar | 80.00 | 65.00 | 15.00 | 80.00 | 0.00 | Presisi Sempurna |
| 19 | 230102049 | Fauzi Maulana Akbar | 75.00 | 75.00 | 0.00 | 80.00 | 5.00 | Terkendali |
| 20 | 230102051 | Fina Faradilla | 85.00 | 75.00 | 10.00 | 80.00 | 5.00 | Error berkurang 50% |
| 21 | 230102052 | Gita Rohimawati | 80.00 | 40.00 | 40.00 | 80.00 | 0.00 | Presisi Sempurna (Error turun 40 poin) |
| 22 | 230102056 | Hawa Aufa | 75.00 | 50.00 | 25.00 | 70.00 | 5.00 | Error turun dari 25 ke 5 poin |
| 23 | 230102065 | Luthfi Fauzan | 50.00 | 35.00 | 15.00 | 60.00 | 10.00 | Error berkurang |
| 24 | 230102070 | Makbul Insan Darojat | 70.00 | 75.00 | 5.00 | 75.00 | 5.00 | Stabil |
| 25 | 230102081 | Muhammad Akmal Hidayatulloh | 100.00 | 85.00 | 15.00 | 90.00 | 10.00 | Error berkurang |
| 26 | 230102084 | Muhammad Faathir Al Mukhrij | 100.00 | 85.00 | 15.00 | 90.00 | 10.00 | Error berkurang |
| 27 | 230102086 | Muhammad Fathi Ulumuddin | 65.00 | 55.00 | 10.00 | 75.00 | 10.00 | Stabil |
| 28 | 230102090 | Muhammad Ilyas Satria Fauzan | 95.00 | 85.00 | 10.00 | 90.00 | 5.00 | Error berkurang 50% |
| 29 | 230102092 | Muhammad Nawa Bayhaqi | 80.00 | 55.00 | 25.00 | 80.00 | 0.00 | Presisi Sempurna (Error turun 25 poin) |
| 30 | 230102100 | Naufal Akbar Muhadzzib | 90.00 | 85.00 | 5.00 | 85.00 | 5.00 | Stabil |
| 31 | 230102111 | Raihan Hafidz Putra | 95.00 | 85.00 | 10.00 | 90.00 | 5.00 | Error berkurang 50% |
| 32 | 230102115 | REGINA ULIMA PRASISTA AURA | 65.00 | 45.00 | 20.00 | 70.00 | 5.00 | Error turun dari 20 ke 5 poin |
| 33 | 230102123 | Sultan Fadhilah Hilmiqashmal | 70.00 | 75.00 | 5.00 | 80.00 | 10.00 | Terkendali |

---

## 🔍 3. Contoh Kasus Empiris Perubahan Ekstrem (Bahan Diskusi Presentasi)

Beberapa contoh nyata jawaban mahasiswa yang membuktikan keberhasilan transisi ke 3-Point Partial Credit Rubric:

1. **Kasus 1: NIM 230102004 (Abdurrahman Lunny Irham)**
   * **Skor Dosen:** 85.00
   * **Skor AI Binary (Iterasi 1):** 20.00 (Deviasi ekstrem **65.00 poin**)
   * **Skor AI Trinary (Iterasi 2):** 85.00 (Deviasi **0.00 poin / Presisi Sempurna**)
   * **Penyebab:** Pada Iterasi 1, mahasiswa membuat beberapa typo minor pada klausa `WHERE`. AI Biner langsung memberikan nilai 0 pada 6 aspek. Pada Iterasi 2, AI menggunakan CoT dan memberikan Partial Credit (skor 50) pada aspek yang logikanya 80% benar, sehingga nilainya klop sempurna dengan dosen (85.00).

2. **Kasus 2: NIM 230102033 (Daren Saffana Darmawan)**
   * **Skor Dosen:** 90.00
   * **Skor AI Binary (Iterasi 1):** 10.00 (Deviasi ekstrem **80.00 poin**)
   * **Skor AI Trinary (Iterasi 2):** 85.00 (Deviasi hanya **5.00 poin**)
   * **Penyebab:** Kesalahan format kuotasi string pada sintaks `INSERT INTO` dihukum nilai 0 total pada Iterasi 1. Pada Iterasi 2, AI mengakomodasi kebenaran klausa DDL/DML lainnya secara adil.
