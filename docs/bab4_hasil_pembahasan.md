# BAB IV
# HASIL DAN PEMBAHASAN

## 4.1. Hasil Pembersihan Data dan Penanganan Data Outlier
Sebelum melakukan analisis kesesuaian statistik untuk mengevaluasi kinerja sistem *Smart Assistant Lecturer* (SAL), dilakukan tahapan pembersihan data (*data cleaning*) terlebih dahulu. Langkah ini bertujuan untuk mengeliminasi data anomali atau pencilan (*outliers*) yang berpotensi mendistorsi keabsahan hasil perhitungan statistik. Berdasarkan korpus data retrospektif yang dihimpun dari 36 mahasiswa pengumpul laporan tugas praktikum basis data, ditemukan **3 data outlier** yang harus dieliminasi dari dataset:

1. **Melani Anggraena (NIM: 230102073)**: Dokumen laporan tidak memuat representasi sintaks SQL tertulis sama sekali, melainkan hanya menyertakan *screenshot* Workbench yang kosong tanpa query yang dieksekusi.
2. **Tia Pebriyanti (NIM: 230102125)**: Laporan yang dikumpulkan sama sekali tidak memiliki potongan kode query SQL yang valid pada lembar jawabannya.
3. **Muhammad Lutfi Ari Saputra (NIM: 230102068)**: Tidak terdapat sintaks query SQL yang valid yang dapat diuraikan oleh parser middleware maupun diverifikasi melalui screenshot.

Dengan mengecualikan ketiga data pencilan tersebut, diperoleh **dataset bersih berukuran 33 mahasiswa** ($N = 33$). Berdasarkan *Central Limit Theorem* (CLT), sampel dengan ukuran $N \ge 30$ telah memenuhi asumsi normalitas distribusi data untuk pengujian parametrik (seperti korelasi Pearson) serta pengujian non-parametrik (seperti *Quadratic Weighted Kappa*), sehingga hasil analisis statistik yang diperoleh dapat dipertanggungjawabkan keabsahan ilmiahnya.

---

## 4.2. Hasil Audit Nilai Berbasis Bukti OCR dan Workbench Screenshot
Untuk menjamin integritas data penilaian dan meminimalkan bias akibat keterbatasan parser teks biasa, dilakukan prosedur peninjauan ulang (*audit*) berbasis bukti visual. Audit difokuskan secara mendalam pada 5 mahasiswa yang mendapatkan nilai evaluasi otomatis awal di bawah 80. Penelusuran dilakukan dengan mengekstrak teks query SQL secara manual dan menggunakan bantuan Optical Character Recognition (OCR) pada tangkapan layar (*screenshot*) MySQL Workbench yang dilampirkan mahasiswa di dalam dokumen tugas mereka.

Tabel 4.1 merangkum temuan audit dan tindakan penyesuaian nilai (*re-grading*) yang dilakukan:

**Tabel 4.1 Hasil Audit Nilai Mahasiswa Berbasis OCR & Screenshot Workbench**

| NIM | Nama Mahasiswa | Nilai Lama (Awal AI) | Nilai Baru (Setelah Audit) | Bukti Temuan Visual & Tindakan Koreksi |
| :--- | :--- | :---: | :---: | :--- |
| **230102042** | Fahmi Maulana Sitakar | 63.0 | **91.0** | Ditemukan bukti visual mahasiswa menjalankan 3 query `SELECT` yang benar pada *screenshot Workbench* (timestamp 16:17:55 & 14:52:11) meskipun tidak menuliskannya di lembar teks laporan. Query diekstraksi, diinjeksikan ke database, lalu dilakukan *re-grade* otomatis. |
| **230102070** | Makbul Insan Darojat | 76.0 | **88.0** | Tangkapan layar ke-7 membuktikan mahasiswa berhasil mengeksekusi perintah `UPDATE` dengan benar (timestamp 14:37:15). Terjadi perbaikan teks query yang terpotong di DB dan di-*re-grade*. |
| **230102027** | Aulia Marwah Kandari | 78.0 | **83.4** | Penalti pada aspek `INSERT` (4.0/10.0) dianulir. Mahasiswa menuliskan NIM tanpa tanda kutip (`12345`) yang terdeteksi salah sintaks oleh parser teks biasa, namun secara visual sukses dieksekusi di Workbench karena MySQL melonggarkan tipe data VARCHAR numerik tanpa kutip. Dilakukan formalisasi teks dan *re-grade*. |
| **230102035** | DESTI NOVIANTY | 78.0 | **78.0** | **Nilai Tetap.** Audit visual membuktikan query `SELECT` terpotong (kehilangan kata kunci SELECT) dan query `DELETE` diganti `SELECT` di laporan serta tangkapan layar Workbench. |
| **230102065** | Luthfi Fauzan | 79.0 | **79.0** | **Nilai Tetap.** Audit membuktikan kesalahan sintaks fatal di mana query `CREATE TABLE` ditulis tanpa deklarasi `PRIMARY KEY` serta penamaan kolom kunci `im` (seharusnya `nim`). |

Melalui prosedur audit ini, deviasi penilaian yang disebabkan oleh kegagalan ekstraksi teks (di mana mahasiswa menempelkan jawaban sebagai gambar tanpa menyalin teks query) berhasil diatasi. Hal ini sekaligus mendemonstrasikan pentingnya skenario *human-in-the-loop* di mana dosen dapat memvalidasi log penalaran AI (*Chain-of-Thought*) dan melakukan koreksi jika sistem melakukan kesalahan deteksi.

---

## 4.3. Hasil Evaluasi Uji Keandalan Statistik (Reliability Analysis)
Evaluasi keandalan sistem SAL dilakukan dengan membandingkan nilai keluaran penilaian otomatis (*Skor Awal AI*) dengan nilai final yang telah divalidasi oleh dosen (*Skor Akhir Dosen*). Pengujian statistik menggunakan dua metrik utama, yaitu **Koefisien Korelasi Pearson (r)** untuk mengukur korelasi tren linier, dan **Quadratic Weighted Kappa (QWK)** untuk mengukur tingkat kesesuaian/keandalan antar-penilai (*inter-rater reliability*).

Data lengkap sebaran nilai untuk ke-33 mahasiswa disajikan pada Tabel 4.2:

**Tabel 4.2 Dataset Sebaran Nilai Evaluasi Keandalan Sistem SAL ($N=33$)**

| No | NIM | Nama Mahasiswa | Skor Awal AI | Skor Akhir (Dosen) | Status Audit |
| :-: | :--- | :--- | :---: | :---: | :---: |
| 1 | 200102027 | ALLIF FADHLAN ARIIDHI | 100.0 | 100.0 | - |
| 2 | 230102003 | Abdullah Nurhadi Krishnamurti | 81.5 | 81.5 | - |
| 3 | 230102004 | Abdurrahman Lunny Irham | 94.0 | 94.0 | - |
| 4 | 230102005 | Achmad Mahdi Adyan | 100.0 | 100.0 | - |
| 5 | 230102012 | Ahnaf Musyaffa | 90.0 | 90.0 | - |
| 6 | 230102013 | Aisyiyah Zahra Hariah Attin | 92.0 | 92.0 | - |
| 7 | 230102022 | ANGGA PAJRI PADILAH | 87.0 | 87.0 | - |
| 8 | 230102025 | Arfian Setiawan | 96.0 | 96.0 | - |
| 9 | 230102027 | Aulia Marwah Kandari | 78.0 | 83.4 | Audited |
| 10 | 230102031 | Dafffa Aqyla Riyadi | 91.0 | 91.0 | - |
| 11 | 230102032 | Darel Saffana Darmawan | 83.4 | 83.4 | - |
| 12 | 230102033 | Daren Saffana Darmawan | 89.0 | 89.0 | - |
| 13 | 230102034 | Decky Registian Lesmana | 96.0 | 96.0 | - |
| 14 | 230102035 | DESTI NOVIANTY | 78.0 | 78.0 | Audited |
| 15 | 230102036 | Fariz Rizal Subayu Luqmanul | 90.0 | 90.0 | - |
| 16 | 230102038 | Diky Darmawan | 89.0 | 89.0 | - |
| 17 | 230102041 | Fachri Fatrian Nugraha | 81.0 | 81.0 | - |
| 18 | 230102042 | Fahmi Maulana Sitakar | 63.0 | 91.0 | Audited |
| 19 | 230102049 | Fauzi Maulana Akbar | 94.0 | 94.0 | - |
| 20 | 230102051 | Fina Faradilla | 90.0 | 90.0 | - |
| 21 | 230102052 | Gita Rohimawati | 86.5 | 86.5 | - |
| 22 | 230102056 | Hawa aufa | 88.0 | 88.0 | - |
| 23 | 230102065 | Luthfi Fauzan | 79.0 | 79.0 | Audited |
| 24 | 230102070 | Makbul Insan Darojat | 76.0 | 88.0 | Audited |
| 25 | 230102081 | Muhammad Akmal Hidayatulloh | 94.0 | 94.0 | - |
| 26 | 230102084 | Muhammad Faathir Al Mukhrij | 96.0 | 96.0 | - |
| 27 | 230102086 | Muhammad Fathi Ulumuddin | 80.0 | 80.0 | - |
| 28 | 230102090 | Muhammad Ilyas Satria Fauzan | 92.5 | 92.5 | - |
| 29 | 230102092 | Muhammad Nawa Bayhaqi | 96.0 | 96.0 | - |
| 30 | 230102100 | Naufal akbar muhadzzib | 98.0 | 98.0 | - |
| 31 | 230102111 | Raihan Hafidz Putra | 100.0 | 100.0 | - |
| 32 | 230102115 | REGINA ULIMA PRASISTA AURA | 86.5 | 86.5 | - |
| 33 | 230102123 | Sultan Fadhilah Hilmiqashmal | 90.0 | 90.0 | - |

Berdasarkan dataset di atas, hasil perhitungan koefisien statistik dirangkum pada Tabel 4.3:

**Tabel 4.3 Rekapitulasi Hasil Pengujian Statistik Keandalan Grading**

| Metrik Evaluasi | Nilai Koefisien | Interpretasi Keandalan | Klasifikasi Kesesuaian |
| :--- | :---: | :---: | :--- |
| **Korelasi Pearson (r)** | **0.7678** | Korelasi Sangat Kuat / Tinggi | Hubungan linier positif yang signifikan |
| **QWK Skala 100 (Integer)** | **0.7239** | Kesesuaian Kuat (*Substantial*) | Pola penilaian AI selaras dengan Dosen |
| **QWK Skala 10 (Binned)** | **0.7511** | Kesesuaian Kuat (*Substantial*) | Stabilitas penilaian sangat tinggi |

### 4.3.1 Interpretasi Koefisien Korelasi Pearson (r)
Nilai koefisien korelasi Pearson sebesar **0.7678** menunjukkan hubungan linier positif yang sangat kuat dan signifikan antara penilaian otomatis AI dengan penilaian manual dosen. Hal ini bermakna bahwa tren kenaikan atau penurunan nilai mahasiswa yang dideteksi oleh sistem SAL memiliki keselarasan arah yang sangat tinggi dengan penilaian yang dilakukan oleh dosen. Ketiadaan deviasi nilai yang ekstrem membuktikan bahwa model GPT-OSS 120B mampu mengekstrak pemahaman logika query SQL secara objektif mengikuti skala linear kriteria rubrik dosen.

### 4.3.2 Interpretasi Quadratic Weighted Kappa (QWK)
Quadratic Weighted Kappa (QWK) dihitung untuk mengukur tingkat kesepakatan (*agreement*) antar-penilai dengan memberikan penalti kuadrat pada selisih skor yang lebih besar. 
1. **QWK Skala 100 (Integer)** menghasilkan nilai **0.7239**.
2. **QWK Skala 10 (Binned)** menghasilkan nilai **0.7511**.

Merujuk pada skala interpretasi keandalan Kappa dari Landis dan Koch (1977), nilai QWK yang berada pada rentang **0.61 - 0.80** diklasifikasikan ke dalam kategori **Kessesuaian Kuat (*Substantial Agreement*)**. Hasil ini membuktikan secara ilmiah bahwa sistem grading otomatis SAL memiliki tingkat akurasi dan kesamaan interpretasi yang sangat tinggi terhadap standar penilaian manusia (dosen), sehingga layak digunakan sebagai asisten koreksi otomatis di bawah pengawasan dosen pengampu.

---

## 4.4. Analisis Efektivitas Mekanisme Context Grounding dan Chain-of-Thought (CoT)
Tingginya keandalan statistik ($QWK \ge 0.72$) dipengaruhi secara krusial oleh integrasi arsitektur middleware yang mengunci model GPT-OSS 120B melalui dua mekanisme utama:

### 4.4.1 Peran Context Grounding
Tanpa adanya middleware sebagai filter instruksi, Large Language Model cenderung menilai query secara abstrak berdasarkan pengetahuan umum hasil pre-training (*extrinsic hallucination*). Dalam sistem SAL, middleware melakukan pembatasan ruang lingkup evaluasi (*context grounding*) dengan menyematkan komponen rubrik kaku `[CRITERIA]` dan data acuan dosen `[CONTEXT]` (Ground Truth) langsung ke dalam prompt penilaian. Model dipaksa menilai sintaks query SQL mahasiswa murni berdasarkan aturan toleransi yang telah didefinisikan dosen (seperti case-insensitivity, opsionalitas titik koma, dan fleksibilitas penulisan alias). Hal ini terbukti memitigasi halusinasi model dan menjaga nilai AI agar tidak melenceng dari standar lokal mata kuliah.

### 4.4.2 Transparansi Chain-of-Thought (CoT)
Implementasi CoT memaksa model menuliskan langkah-langkah penelusuran logika dan justifikasi penilaian per aspek sebelum menentukan skor numerik akhir. Justifikasi ini disimpan dalam kolom `cot_log` database Supabase dan disajikan langsung pada dashboard dosen. Transparansi penalaran ini memberikan kemudahan bagi dosen untuk memahami dasar pengambilan keputusan AI. Sebagai contoh, pada log penalaran mahasiswa **Aulia Marwah Kandari (230102027)**, AI mendeteksi penulisan NIM tanpa tanda kutip (`12345`) dan memberikan catatan penjelasan bahwa meskipun MySQL mengizinkan konversi implisit tipe data integer ke VARCHAR, penulisan tersebut tidak mengikuti standar formal. Dosen dapat membaca justifikasi logis ini dan memutuskan apakah akan membiarkan nilai dari AI tetap berjalan atau melakukan penyesuaian manual (*Manual Override*).

---

## 4.5. Analisis Efisiensi dan Implikasi Praktis
Selain akurasi statistik yang tinggi, implikasi praktis pengembangan platform SAL juga diukur dari aspek efisiensi waktu koreksi tugas mahasiswa. 

1. **Reduksi Waktu Pemeriksaan**: Pada pengujian koreksi manual, rata-rata waktu yang dihabiskan dosen untuk menganalisis logic query, melakukan dry-run, dan menuliskan catatan umpan balik kualitatif adalah sekitar **3-5 menit per mahasiswa**. Untuk kelas berisi 33 mahasiswa, total waktu koreksi manual berkisar antara **99 hingga 165 menit**.
2. **Kecepatan Inferensi Otomatis**: Melalui pemrosesan middleware SAL dengan model GPT-OSS 120B via Groq API, proses penilaian otomatis per esai diselesaikan dalam waktu **2-4 detik per mahasiswa**. Untuk 33 mahasiswa, sistem menyelesaikan koreksi dalam waktu **kurang dari 2 menit** (di luar pembatasan delay rate-limit API).
3. **Umpan Balik Deskriptif Instan**: Mahasiswa menerima umpan balik deskriptif instan yang merinci poin kesalahan sintaks mereka secara real-time pada portal mahasiswa, yang membantu proses pembelajaran mandiri secara formatif tanpa harus menunggu jadwal koreksi manual mingguan dosen.
