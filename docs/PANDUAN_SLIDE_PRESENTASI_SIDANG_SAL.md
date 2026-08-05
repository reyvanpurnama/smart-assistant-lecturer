# PANDUAN STRUKTUR SLIDE PRESENTASI & SCRIPT SKRIPSI (SIDANG AKHIR 7 AGUSTUS)

**Judul Skripsi:** PENGEMBANGAN SMART ASSISTANT LECTURER UNTUK ANALISIS JAWABAN ESAI OTOMATIS BERBASIS LLM (LARGE LANGUAGE MODEL)  
**Penyusun:** M. Reyvan Purnama (NIM: 220102043)  
**Pembimbing I:** Aila Gema Safitri, S.T., M.T.  
**Pembimbing II:** Ririn Suharsih, S.Pd., M.T.  

---

## 🎯 PANDUAN ALUR DRAFT EKSEMPLAR & STRUKTUR SLIDE PRESENTASI (LENGKAP SITASI FOOTER)

Dokumen ini memuat alur slide, script pidato, serta **SITASI FOOTER (Ketik Kecil di Bagian Bawah Slide Canva)** agar Anda bisa langsung menyebutkan acuan jurnal ilmiah secara meyakinkan saat menjawab pertanyaan penguji.

---

### 🖥️ SLIDE 1: JUDUL & IDENTITAS PENELITIAN
**Tampilan Visual Slide:**
* **Judul Utama:** Pengembangan Smart Assistant Lecturer untuk Analisis Jawaban Esai Otomatis Berbasis LLM (Large Language Model)
* **Sub-Judul / 4 Pilar Novelty:** *Integrasi Decoupling Middleware, Modular CoT Prompting, 3-Point Partial Credit, & Knowledge Grounding GPT-OSS 120B*
* **Nama & NIM:** M Reyvan Purnama (220102043)
* **Program Studi:** Teknik Informatika, Universitas Muhammadiyah Bandung (2026)
* **Dosen Pembimbing:** Aila Gema Safitri, S.T., M.T. & Ririn Suharsih, S.Pd., M.T.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Claes (2025); Stahl et al. (2024); Chen & Wan (2024); Ji et al. (2023); Agarwal et al. (2025)`

🎙️ **Script Omongan Bicara Reyvan (30 detik):**
> *"Assalamu’alaikum Warahmatullahi Wabarakatuh. Selamat pagi Bapak dan Ibu Dosen Penguji serta Dosen Pembimbing. Terima kasih atas kesempatan yang diberikan. Pada hari ini, saya M Reyvan Purnama akan mempresentasikan hasil penelitian tugas akhir saya yang berjudul 'Pengembangan Smart Assistant Lecturer untuk Analisis Jawaban Esai Otomatis Berbasis Large Language Model'."*

---

### 🖥️ SLIDE 2: LATAR BELAKANG & STAKEHOLDER PAIN POINTS
**Tampilan Visual Slide:**
* **Masalah Evaluasi Manual:** Time-consuming, kelelahan kognitif (*evaluator fatigue*), variabilitas subjektivitas penilaian esai/pseudocode.
* **Hasil Kuesioner Pendahuluan (5 Dosen Teknik Informatika UMB):**
  * 🔴 **100% Dosen:** Terkendala variasi alur logika algoritma/SQL mahasiswa & kelelahan kognitif.
  * 🔴 **80% Dosen:** Terbebani penelusuran alur logika secara manual (*dry-run*).
  * 🔴 **80% Dosen:** Khawatir risiko halusinasi AI (*hallucination*).
  * 🟢 **100% Dosen:** Bersedia mengadopsi AI jika kendali rubrik tetap di tangan dosen & justifikasi transparan.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Bloxham et al. (2020); Kasneci et al. (2023); Haller et al. (2022); Ji et al. (2023)`

🎙️ **Script Omongan Bicara Reyvan (1 menit):**
> *"Penelitian ini dilatarbelakangi oleh beban koreksi esai manual yang dihadapi dosen. Berdasarkan studi pendahuluan kami terhadap 5 dosen pemrograman di UMB, 100% dosen sepakat bahwa pengoreksian esai dan query SQL secara manual memicu kelelahan kognitif (Bloxham et al., 2020). Mayoritas dosen mengkhawatirkan risiko halusinasi AI (Ji et al., 2023), namun 100% dosen bersedia mengadopsi asisten AI asalkan kendali rubrik tetap berada sepenuhnya di tangan dosen dan sistem mampu memberikan justifikasi nilai yang transparan."*

---

### 🖥️ SLIDE 3: RUMUSAN MASALAH & TUJUAN PENELITIAN
**Tampilan Visual Slide:**
* **Rumusan Masalah:**
  1. Bagaimana mengotomatisasi evaluasi esai/SQL berbasis LLM dengan kendali rubrik penuh di tangan dosen serta memitigasi halusinasi AI?
  2. Sejauh mana tingkat keselarasan peringkat (*rank agreement*) dan presisi skor AI terhadap penilaian manual dosen?
* **Tujuan Penelitian:**
  1. Merancang arsitektur *provider-agnostic middleware* berbasis *Knowledge Grounding* dan *Chain-of-Thought (CoT)*.
  2. Mengevaluasi keandalan sistem menggunakan statistik non-parametrik **Kendall's Tau-b ($\tau_b$)** dan **Mean Absolute Error (MAE)**.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Claes (2025); Yeung (2025); Bhat & Varma (2026)`

🎙️ **Script Omongan Bicara Reyvan (45 detik):**
> *"Dari latar belakang tersebut, rumusan masalah penelitian ini berfokus pada dua hal: Pertama, bagaimana merancang middleware untuk mengendalikan LLM agar bebas halusinasi dan ramah rubrik dosen (Claes, 2025). Kedua, bagaimana mengukur tingkat keselarasan penilaian AI dibanding penilaian manual dosen menggunakan metrik Kendall's Tau-b dan MAE (Yeung, 2025; Bhat & Varma, 2026)."*

---

### 🖥️ SLIDE 3.5: BATASAN MASALAH & RUANG LINGKUP PENELITIAN
**Tampilan Visual Slide:**
* 🎯 **Ruang Lingkup Kasus Uji:** Dibatasi pada pengujian esai **Logika Pemrograman Basis Data (SQL)** pada Mata Kuliah Basis Data Lanjut (IF204), mencakup 10 operasi DDL/DML.
* 👥 **Dataset Retrospektif:** 33 Dokumen Jawaban Mahasiswa Kelas IF23A Angkatan 2023.
* 🤖 **Teknologi AI & Infras:** Model Open-Weight **GPT-OSS 120B** via **Groq API Cloud** (Low Latency).
* 🌐 **Bahasa & Input Data:** Khusus Bahasa Indonesia, berkas digital (.pdf, .docx, .txt).
* 📊 **Ruang Lingkup Evaluasi:** Uji teknis keselarasan peringkat ($\tau_b$) dan deviasi selisih fisik (MAE) terhadap *Ground Truth* dosen.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Fraenkel et al. (2019); Islam (2018); Agarwal et al. (2025); Groq (2026)`

🎙️ **Script Omongan Bicara Reyvan (45 detik):**
> *"Untuk menjaga fokus pengujian, penelitian ini dibatasi pada evaluasi esai logika pemrograman SQL mata kuliah Basis Data Lanjut (IF204). Data yang dievaluasi berupa 33 dokumen jawaban retrospektif mahasiswa yang diproses menggunakan model open-weight GPT-OSS 120B via Groq API, dengan fokus utama mengukur keselarasan peringkat dan deviasi skor terhadap nilai dosen."*

---

### 🖥️ SLIDE 4: ARSITEKTUR MIDDLEWARE & KNOWLEDGE GROUNDING
**Tampilan Visual Slide:**
* **Diagram Arsitektur (Prinsip Decoupling):**
  `User (Next.js UI) <---> Supabase BaaS <---> SAL Middleware <---> Groq API (GPT-OSS 120B)`
* **Struktur Prompt Modular (5 Kompartemen):**
  * `[ROLE]`: Persona Asisten Penilai Cerdas.
  * `[TASK]`: Instruksi Evaluasi & Chain-of-Thought (CoT) Reasoning.
  * `[CONTEXT]`: Naskah Soal acuan (*Knowledge Grounding*).
  * `[CRITERIA]`: Parameter Rubrik & Toleransi Logika Dosen.
  * `[OUTPUT FORMAT]`: Constraint Structured JSON.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Claes (2025); Stahl et al. (2024); Pack et al. (2024); Zhao et al. (2023)`

🎙️ **Script Omongan Bicara Reyvan (1 menit):**
> *"Untuk memecahkan masalah halusinasi, kami mengimplementasikan arsitektur provider-agnostic middleware yang memisahkan logika aplikasi dari layanan AI (Claes, 2025). Middleware merangkai instruksi ke dalam 5 struktur prompt modular (Stahl et al., 2024). Teknik Knowledge Grounding diterapkan dengan menyuntikkan dokumen acuan dosen pada elemen CONTEXT dan CRITERIA, sehingga penalaran AI terkunci kaku dan tidak mengutip informasi di luar materi perkuliahan."*

---

### 🖥️ SLIDE 5: METODOLOGI PENELITIAN & ITERASI PROTOTYPING
**Tampilan Visual Slide:**
* **Model Pengembangan:** Prototyping Model (5 Tahap).
* **Dataset Retrospektif:** $N = 33$ dokumen jawaban mahasiswa Kelas IF23A (Mata Kuliah Basis Data Lanjut IF204).
* **Pengujian 2 Iterasi Utama:**
  * 🔴 **Iterasi 1 (Baseline):** *Binary Scoring* (Skor 0 atau 100).
  * 🟢 **Iterasi 2 (Refinement):** *3-Point Partial Credit Rubric* (Skor 0, 50, 100) + *Chain-of-Thought (CoT)*.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Maryani et al. (2022); Masters (1982); Chen & Wan (2024); Haller et al. (2022)`

🎙️ **Script Omongan Bicara Reyvan (45 detik):**
> *"Metode penelitian mengadopsi Prototyping Model (Maryani et al., 2022) menggunakan dataset retrospektif 33 mahasiswa. Pengujian dilakukan melalui dua iterasi utama: Iterasi 1 sebagai baseline menggunakan penilaian biner kaku (0/100), dan Iterasi 2 sebagai penyempurnaan menggunakan skema 3-Point Partial Credit (0, 50, 100) yang dipadukan dengan Chain-of-Thought reasoning (Chen & Wan, 2024)."*

---

### 🖥️ SLIDE 6: HASIL KOMPARASI ITERASI PROTOTYPING (TABEL UTAMA)
**Tampilan Visual Slide:**
* **Tabel Perbandingan Performa (Tabel 4.2):**

| Tahap Prototype | Skema Rubrik | Kendall's Tau ($\tau_b$) | MAE (Poin) | Evaluasi / Dampak |
| :--- | :--- | :---: | :---: | :--- |
| **Iterasi 1 (Baseline)** | Binary Scoring (0/100) | 0.4400 | 18.33 | Terlalu kaku pada kesalahan minor |
| **Iterasi 2 (Final)** | 3-Point Partial Credit | **0.7724** | **5.45** | **Disetujui Dosen: Keselarasan Tinggi & Error Terkecil** |
| **Perubahan Performa** | **Transisi Skema** | **+75.5% (Meningkat)** | **-70.3% (Mereduksi)** | **Signifikan secara statistik** |

* **Grafik Visual:** Tampilkan grafik batang perbandingan Tau-b (naik dari 0.44 ke 0.77) dan MAE (turun dari 18.33 ke 5.45).

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Yeung (2025); Bhat & Varma (2026); Akoglu (2018)`

🎙️ **Script Omongan Bicara Reyvan (1 menit 15 detik):**
> *"Berikut adalah hasil komparasi kuantitatif antar-iterasi. Pada Iterasi 1 (Binary Scoring), sistem bersikap terlampau kaku menghukum kesalahan tipografi minor dengan skor 0, sehingga menghasilkan MAE tinggi sebesar 18.33 poin. Setelah disempurnakan pada Iterasi 2 dengan 3-Point Partial Credit Rubric, tingkat korelasi peringkat Kendall's Tau-b melonjak +75.5% dari 0.4400 menjadi 0.7724 (keselarasan hirarki logika sangat kuat), serta kesalahan fisik MAE berhasil dipangkas -70.3% menjadi 5.45 poin (Yeung, 2025; Bhat & Varma, 2026)."*

---

### 🖥️ SLIDE 7: KASUS EMPIRIS & PEMBUKTIAN KETEPATAN (SIDE-BY-SIDE)
**Tampilan Visual Slide:**
* **Contoh Kasus Perbaikan Ekstrem:**
  * 📌 **Mahasiswa NIM 230102004 (Abdurrahman Lunny Irham):**
    * Skor Dosen ($y$): **85.00**
    * AI Binary (Iterasi 1): **20.00** ❌ (Error 65 poin akibat penalti biner kaku)
    * AI Trinary (Iterasi 2): **85.00** ✅ (**Presisi Sempurna / Error 0.00!**)
  * 📌 **Mahasiswa NIM 230102033 (Daren Saffana Darmawan):**
    * Skor Dosen ($y$): **90.00**
    * AI Binary (Iterasi 1): **10.00** ❌ (Error 80 poin)
    * AI Trinary (Iterasi 2): **85.00** ✅ (Error terkendali 5 poin)

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Chen & Wan (2024); Masters (1982); Haller et al. (2022)`

🎙️ **Script Omongan Bicara Reyvan (1 menit):**
> *"Dampak nyata dari transisi ini dapat dilihat pada kasus mahasiswa NIM 230102004. Pada Iterasi 1, mahasiswa ini mendapat nilai AI 20.00 padahal nilai asli dosen 85.00 karena typo minor. Pada Iterasi 2, penalaran CoT dan kredit parsial (skor 50) memungkinkan AI mengenali bahwa logika algoritma mahasiswa sudah 80% benar (Masters, 1982; Chen & Wan, 2024), sehingga nilai keluaran AI presisi sempurna senilai 85.00."*

---

### 🖥️ SLIDE 8: METODOLOGI KOMPUTASI STATISTIK (STEP-BY-STEP)
**Tampilan Visual Slide:**
* **Rumus Kendall's Tau-b:**
  $$\tau_b = \frac{P - Q}{\sqrt{(P + Q + T_x)(P + Q + T_y)}}$$
  * Total Pasangan ($\binom{33}{2} = 528$), $P = 379$, $Q = 28$, $T_x = 71$, $T_y = 21$.
  * Hasil: $\tau_b = \frac{351}{452.309} = \mathbf{0.7724}$.
* **Rumus Mean Absolute Error (MAE):**
  $$\text{MAE} = \frac{1}{N} \sum_{i=1}^{N} |y_i - \hat{y}_i| = \frac{179.85}{33} = \mathbf{5.45 \text{ poin}}$$

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Bhat & Varma (2026); Yeung (2025); Akoglu (2018)`

🎙️ **Script Omongan Bicara Reyvan (45 detik):**
> *"Komputasi statistik dilakukan secara tepat mengoreksi faktor nilai kembar (ties) menggunakan rumus Kendall's Tau-b (Bhat & Varma, 2026). Dari total 528 kombinasi pasangan, didapatkan 379 pasangan concordant (sejalan) yang menghasilkan nilai Kendall's Tau-b sebesar 0.7724. Sedangkan total akumulasi selisih mutlak 33 mahasiswa sebesar 179.85 poin menghasilkan nilai MAE akhir sebesar 5.45 poin (Yeung, 2025)."*

---

### 🖥️ SLIDE 8.5: MATRIKS PENELITIAN TERDAHULU & SINTESIS NOVELTY
**Tampilan Visual Slide:**
* **Tabel Matriks Penelitian Terdahulu & Aspek yang Diadopsi (Tabel 2.1 Final):**

| No | Peneliti & Referensi Jurnal | Hasil Utama Penelitian | Aspek Kunci yang Diadopsi / Kontribusi pada SAL |
| :-: | :--- | :--- | :--- |
| 1 | **Pack, Barrett, & Escalante (2024)** | Evaluasi LLM *closed-source* rentan fluktuatif & instabil akibat pembaruan vendor sepihak. | **Justifikasi Pemilihan Model Open-Weight (GPT-OSS 120B)** via Groq API untuk menjamin konsistensi evaluasi. |
| 2 | **Claes (2025)** | Arsitektur *provider-agnostic middleware* berbasis *decoupling* memisahkan platform dari API AI. | **Pola Arsitektur Decoupling Middleware** untuk mengisolasi logika sistem dari layanan inferensi LLM. |
| 3 | **Stahl et al. (2024)** | Prompting modular (*Persona* & *CoT*) terbukti meningkatkan akurasi skoring jika AI dipicu bernalar dulu. | **Struktur Prompt Modular & Chain-of-Thought (CoT)** untuk mengekstrak log penalaran sebelum skor dirilis. |
| 4 | **Chen & Wan (2024)** | Skema *partial credit rubric* & CoT mencapai akurasi evaluasi esai setara penilai manusia. | **Skema 3-Point Partial Credit Rubric (0, 50, 100)** untuk mengakomodasi kebenaran logika parsial. |
| 5 | **Ji et al. (2023); Agarwal (2025)** | Implementasi *Knowledge Grounding* mengunci penalaran LLM pada konteks acuan untuk memitigasi halusinasi. | **Mekanisme Knowledge Grounding** yang mengunci penalaran GPT-OSS 120B pada dokumen acuan dosen. |
| 6 | **Yeung (2025); Bhat & Varma (2026)** | Evaluasi AWE/AES mutakhir bergantung pada korelasi hirarki (*Kendall Tau-b*) dan deviasi fisik (*MAE*). | **Metrik Evaluasi Kuantitatif (Kendall Tau-b & MAE)** untuk menguji presisi keselarasan skor terhadap dosen. |

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Pack et al. (2024); Claes (2025); Stahl et al. (2024); Chen & Wan (2024); Ji et al. (2023); Yeung (2025); Bhat & Varma (2026)`

🎙️ **Script Omongan Bicara Reyvan (1 menit):**
> *"Berdasarkan tinjauan penelitian terdahulu pada tabel ini, mayoritas studi mengevaluasi LLM komersial closed-source secara langsung (tightly coupled) yang menurut Pack, Barrett, & Escalante (2024) sangat rentan fluktuatif akibat pembaruan vendor. Penelitian ini menjawab celah riset tersebut dengan mengadopsi model open-weight GPT-OSS 120B dan menyatukan 5 keunggulan studi dunia: decoupling middleware dari Claes (2025), CoT prompting dari Stahl et al. (2024), kredit parsial dari Chen & Wan (2024), serta Knowledge Grounding dari Ji et al. (2023) yang divalidasi dengan Kendall Tau-b dan MAE (Yeung, 2025; Bhat & Varma, 2026)."*

---

### 🖥️ SLIDE 9: IMPLEMENTASI ANTARMUKA SISTEM (UI DEMO)
**Tampilan Visual Slide:**
* **Tampilan 4 Layar Utama:**
  1. Halaman Manajemen Rubrik Dosen (`/dosen/buat-tugas`).
  2. Dashboard Penilaian Dosen (`/dosen`).
  3. Halaman Validasi & Override Nilai (`/dosen/validasi/[id]`).
  4. Portal Penilaian Mahasiswa (`/tugas/[id]`).

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Claes (2025); Pack et al. (2024)`

🎙️ **Script Omongan Bicara Reyvan (45 detik):**
> *"Berikut adalah implementasi antarmuka Smart Assistant Lecturer berbasis Next.js. Dosen memiliki kendali penuh untuk membuat tugas dan merancang rubrik. Sistem juga menyediakan fitur 'Override Nilai Manual' pada halaman validasi dosen, sehingga dosen dapat memantau log reasoning AI sekaligus mengubah skor AI secara langsung jika diperlukan (human-in-the-loop)."*

---

### 🖥️ SLIDE 10: PEMBAHASAN EMPIRIS GROUNDING & CHAIN-OF-THOUGHT
**Tampilan Visual Slide:**
* **Mitigasi Halusinasi (Knowledge Grounding):** 
  * 0 Kasus halusinasi di luar skema database `universitas` pada 33 sampel pengujian.
* **Transparansi Evaluasi (Chain-of-Thought):**
  * LLM mengekstrak log `global_reasoning` sebelum mengembalikan skor JSON, mencegah *hasty grading*.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Ji et al. (2023); Zhao et al. (2023); Stahl et al. (2024); Claes (2025)`

🎙️ **Script Omongan Bicara Reyvan (45 detik):**
> *"Secara empiris, penelitian ini mengonfirmasi bahwa Knowledge Grounding pada middleware berhasil memitigasi halusinasi total (Ji et al., 2023), di mana 0 kasus keluaran di luar naskah soal ditemukan. Selain itu, Chain-of-Thought reasoning memberikan transparansi bagi dosen untuk memverifikasi alasan logis di balik setiap pemberian nilai AI (Stahl et al., 2024)."*

---

### 🖥️ SLIDE 11: KESIMPULAN & SARAN
**Tampilan Visual Slide:**
* **Kesimpulan:**
  1. Arsitektur provider-agnostic middleware berbasis Knowledge Grounding, CoT, dan 3-Point Partial Credit berhasil dibangun dan mampu mengunci AI bebas halusinasi.
  2. Sistem terbukti memiliki keandalan sangat tinggi ($\tau_b = 0.7724$) dan presisi deviasi fisik terendah ($\text{MAE} = 5.45 \text{ poin}$).
* **Saran:**
  1. Pengembangan dukungan dokumen masukan berbasis Multimodal / Optical Character Recognition (OCR) untuk lembar tulisan tangan.
  2. Perluasan uji coba pada rumpun mata kuliah logika lain seperti Struktur Data dan Pemrograman Berorientasi Objek.

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Yeung (2025); Bhat & Varma (2026)`

🎙️ **Script Omongan Bicara Reyvan (45 detik):**
> *"Kesimpulannya, arsitektur Smart Assistant Lecturer berbasis middleware dan 3-point partial credit berhasil dibuktikan secara ilmiah mampu menghasilkan penilaian esai otomatis yang presisi, bebas halusinasi, serta selaras dengan standar penilaian dosen. Untuk penelitian selanjutnya, disarankan pengembangan dukungan OCR tulisan tangan serta perluasan pada mata kuliah logika lainnya."*

---

### 🖥️ SLIDE 12: PENUTUP & DEMO APLIKASI
**Tampilan Visual Slide:**
* **Teks:** Terima Kasih - Session Q&A (Tanya Jawab)
* **Logo UMB & Kontak:** M Reyvan Purnama (220102043)
* *Ready for Live Demo System.*

📌 **Footer Sitasi Kunci (Tulis Kecil di Bawah Slide):**
`Smart Assistant Lecturer (SAL) - Universitas Muhammadiyah Bandung (2026)`

---

## 🛡️ TANDATANGAN & TANGKISAN DEFENSIF SAAT TANYA JAWAB (Q&A)

1. **Penguji:** *"Mana tabel komparasi biner lengkap di naskah draf kamu?"*
   * **Jawaban Reyvan:** *"Terima kasih atas masukannya Bapak/Ibu. Tabel komparasi lengkap antar-iterasi beserta matriks 33 mahasiswa retrospektif telah kami cantumkan pada Tabel 4.2 di Presentasi hari ini dan telah kami lampirkan secara utuh pada berkas Lampiran 2 revisi final."*
2. **Penguji:** *"Kenapa kamu gak pakai Shapiro-Wilk uji normalitas?"*
   * **Jawaban Reyvan:** *"Sesuai dengan acuan metodologi penilaian LLM Judge mutakhir (Yeung, 2025; Bhat & Varma, 2026), evaluasi kuantitatif difokuskan langsung pada metrik korelasi hirarki peringkat Kendall's Tau-b dan deviasi fisik MAE. Kendall's Tau-b merupakan statistik non-parametrik yang memang diperuntukkan bagi data skala ordinal bertingkat tanpa memerlukan asumsi distribusi normal."*
3. **Penguji:** *"Di Bab I kamu sebutkan batasan masalahnya esai logika pemrograman dasar, tapi kenapa kasus pengujiannya spesifik SQL?"*
   * **Jawaban Reyvan:** *"Terima kasih atas pertanyaannya Ibu/Bapak. Payung besar riset ini dirancang untuk esai logika pemrograman di ilmu komputer. Pada penelitian ini, sintaks perintah SQL pada Mata Kuliah Basis Data Lanjut dipilih sebagai instrumen kasus uji spesifik (case study) yang ideal, karena sintaks SQL merepresentasikan kombinasi logika DDL/DML, klausa penyaringan data (WHERE), tipe data, dan manipulasi struktur relasional yang membutuhkan ketelitian penalaran tinggi."*
