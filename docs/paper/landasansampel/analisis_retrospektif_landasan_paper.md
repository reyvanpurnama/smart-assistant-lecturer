# Landasan Metodologis Penggunaan Data Retrospektif (Archival Evaluation Design)

Dokumen ini disusun sebagai **justifikasi akademis dan metodologis** untuk menjawab pertanyaan dosen penguji sidang mengenai penggunaan **data retrospektif (33 dokumen jawaban mahasiswa dari arsip praktikum masa lalu)** pada proyek Smart Assistant Lecturer (SAL).

---

## 1. Literatur Peneliti Terdahulu yang Menggunakan Data Retrospektif

Penggunaan dataset retrospektif (*archival student responses*) adalah **standar metodologi internasional** dalam evaluasi sistem *Automated Short Answer Grading* (ASAG) dan *Automated Essay Scoring* (AES):

| No | Paper / Peneliti | Pendekatan Evaluasi | Alasan Penggunaan Data Retrospektif |
|----|------------------|---------------------|-------------------------------------|
| 1 | **Dzikovska et al. (2013)** *(SemEval-2013 Task 7)* | Retrospective Student Responses | Dataset benchmark utama (SciEntsBank & Beetle) yang diambil dari arsip jawaban esai mahasiswa tahun-tahun sebelumnya. |
| 2 | **Haller et al. (2022)** | Systematic Survey of ASAG Benchmarks | Menegaskan bahwa mayoritas dataset evaluasi AI (seperti ASAP-SAS) menggunakan data retrospektif untuk menjamin *ground truth* yang stabil. |
| 3 | **Gao et al. (2024)** | Automatic Assessment Systematic Review | Menjelaskan bahwa evaluasi retrospektif mencegah bias eksperimental dan menjamin keabsahan ekologis (*ecological validity*). |

---

## 2. Dua Alasan Utama Mengapa Data Retrospektif Lebih Unggul Secara Metodologis

### A. Mencegah *Hawthorne Effect* (Bias Perilaku Subjek)
Jika pengujian dilakukan secara *live* pada kelas yang sedang berjalan, mahasiswa akan menyadari bahwa jawaban mereka sedang dinilai oleh sistem AI eksperimental. Hal ini dapat menimbulkan **Hawthorne Effect** (perubahan perilaku/gaya menulis mahasiswa karena merasa diawasi). Data retrospektif mencerminkan cara berpikir dan gaya penulisan murni mahasiswa pada kondisi ujian nyata.

### B. Menjamin *Gold-Standard Ground Truth* yang Stabil
Nilai asli dosen pada data retrospektif adalah nilai final akademis yang sah tanpa terpengaruh oleh eksperimen sistem AI. Hal ini menjadikan skor dosen sebagai acuan *ground truth* yang murni objektif.

---

## 3. SCRIPT TANGKISAN SIDANG (Paling Gampang Dihafal)

🗣️ **Penguji:** *"Kenapa pakai data retrospektif (arsip nilai lama)? Apakah ada landasan papernya?"*

> 🎙️ **Jawaban Tangkisan Reyvan:**  
> *"Terima kasih Bapak/Ibu Penguji. Penggunaan data retrospektif (33 arsip jawaban mahasiswa) mengadopsi standar evaluasi sistem Automated Short Answer Grading dari **Dzikovska et al. (2013)** pada benchmark SemEval-2013 serta riset **Gao et al. (2024)**.*  
>  
> *Secara metodologis, data retrospektif memiliki dua keunggulan krusial:*  
> *1. **Memiliki Keabsahan Ekologis (Ecological Validity):** Mengeliminasi **Hawthorne Effect**, di mana gaya penulisan mahasiswa pada data retrospektif adalah murni tanpa bias pengetahuan bahwa jawaban mereka akan diuji oleh sistem AI.*  
> *2. **Stabilitas Ground Truth Dosen:** Nilai asli dosen pada arsip tersebut merupakan nilai mutlak yang sah secara akademis untuk diuji presisinya terhadap keluaran AI."*
