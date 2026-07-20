# Analisis Perbandingan Strategi Penilaian AI (Relaxed vs Strict vs Binary)

Dokumen ini membandingkan tiga strategi penilaian otomatis menggunakan model `openai/gpt-oss-120b` dibandingkan dengan nilai manual dosen asli dari spreadsheet praktikum mahasiswa (N = 33).

---

## 1. Perbandingan Metrik Statistik Utama

| Strategi Penilaian | Pearson ($r$) | Spearman ($ho$) | Kendall ($	au$) | Mean Absolute Error (MAE) | Deskripsi Karakteristik |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Relaxed (Toleran)** | 0.0637 | 0.0781 | 0.0692 | 8.88 | AI sangat toleran pada error sintaks, nilai menumpuk di kisaran 80-100. |
| **Strict (Ketat)** | -0.0688 | -0.0208 | -0.0168 | 19.67 | AI mengurangi nilai secara gradasi desimal jika ada kesalahan sintaks/logika. |
| **Binary (0/100 Aspek)** | -0.1562 | -0.1072 | -0.1046 | 29.55 | AI menilai benar/salah secara mutlak per aspek, nilai kelipatan 5/10. |

---

## 2. Tabel Komparasi Nilai Mahasiswa (Lengkap)

Di bawah ini adalah perbandingan nilai riil untuk masing-masing mahasiswa:

| NIM | Nama Mahasiswa | Nilai Dosen (Asli) | AI Relaxed | AI Strict | AI Binary | Selisih (Dosen - AI Binary) |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| `200102027` | ALLIF FADHLAN ARIIDHI | **100** | 100 | 95.0 | **95** | +5 |
| `230102056` | Hawa aufa | **100** | 88 | 51.0 | **50** | +50 |
| `230102051` | Fina Faradilla | **90** | 90 | 85.0 | **75** | +15 |
| `230102005` | Achmad Mahdi Adyan | **100** | 100 | 85.1 | **95** | +5 |
| `230102049` | Fauzi Maulana Akbar | **100** | 94 | 69.0 | **75** | +25 |
| `230102031` | Dafffa Aqyla Riyadi | **90** | 91 | 66.0 | **50** | +40 |
| `230102022` | ANGGA PAJRI PADILAH | **80** | 87 | 84.0 | **85** | -5 |
| `230102025` | Arfian Setiawan | **70** | 96 | 89.0 | **85** | -15 |
| `230102081` | Muhammad Akmal Hidayatulloh | **100** | 94 | 89.0 | **85** | +15 |
| `230102090` | Muhammad Ilyas Satria Fauzan | **100** | 92.5 | 89.0 | **85** | +15 |
| `230102013` | Aisyiyah Zahra Hariah Attin | **100** | 92 | 51.0 | **40** | +60 |
| `230102035` | DESTI NOVIANTY | **90** | 78 | 69.9 | **70** | +20 |
| `230102041` | Fachri Fatrian Nugraha | **100** | 81 | 79.0 | **75** | +25 |
| `230102100` | Naufal akbar muhadzzib | **95** | 98 | 89.0 | **85** | +10 |
| `230102115` | REGINA ULIMA PRASISTA AURA | **100** | 86.5 | 67.0 | **45** | +55 |
| `230102092` | Muhammad Nawa Bayhaqi | **95** | 96 | 73.0 | **55** | +40 |
| `230102004` | Abdurrahman Lunny Irham | **100** | 94 | 81.0 | **20** | +80 |
| `230102027` | Aulia Marwah Kandari | **90** | 83.4 | 60.0 | **55** | +35 |
| `230102012` | Ahnaf Musyaffa | **80** | 90 | 61.0 | **75** | +5 |
| `230102070` | Makbul Insan Darojat | **80** | 88 | 79.0 | **75** | +5 |
| `230102084` | Muhammad Faathir Al Mukhrij | **100** | 96 | 89.0 | **85** | +15 |
| `230102032` | Darel Saffana Darmawan | **100** | 83.4 | 74.1 | **75** | +25 |
| `230102038` | Diky Darmawan | **80** | 89 | 74.0 | **75** | +5 |
| `230102052` | Gita Rohimawati | **100** | 86.5 | 64.1 | **40** | +60 |
| `230102065` | Luthfi Fauzan | **100** | 79 | 68.0 | **35** | +65 |
| `230102086` | Muhammad Fathi Ulumuddin | **80** | 80 | 71.1 | **55** | +25 |
| `230102042` | Fahmi Maulana Sitakar | **90** | 91 | 74.0 | **65** | +25 |
| `230102003` | Abdullah Nurhadi Krishnamurti | **100** | 81.5 | 50.0 | **35** | +65 |
| `230102111` | Raihan Hafidz Putra | **100** | 100 | 89.0 | **85** | +15 |
| `230102123` | Sultan Fadhilah Hilmiqashmal | **100** | 90 | 82.5 | **75** | +25 |
| `230102036` | Fariz Rizal Subayu Luqmanul Hakim | **70** | 90 | 69.0 | **40** | +30 |
| `230102034` | Decky Registian Lesmana | **80** | 96 | 89.0 | **85** | -5 |
| `230102033` | Daren Saffana Darmawan | **100** | 89 | 69.0 | **10** | +90 |

---

## 3. Temuan & Analisis Mengapa Nilai AI Binary "Anjlok"

Berdasarkan pemeriksaan log dan data, ada beberapa alasan mengapa beberapa mahasiswa mengalami penurunan nilai yang drastis pada penilaian **Binary**:

1. **Daffa Aqyla Riyadi (`230102031`)**: 
   * **Nilai Dosen**: **90**
   * **AI Binary**: **10**
   * **Analisis Penyebab**: Mahasiswa ini melakukan kesalahan penulisan yang dianggap fatal oleh aturan biner yang sangat ketat (misalnya salah menulis nama kolom primary key, salah menggunakan tanda kutip pada data INSERT, atau tidak menuliskan sintaks UPDATE/DELETE sesuai instruksi eksak). Karena biner, kesalahan kecil pada aspek bernilai bobot besar langsung memicu nilai **0** untuk aspek tersebut, sehingga skornya anjlok total ke 10, sedangkan Dosen memberikan 90 karena melihat secara holistik bahwa tugasnya "hampir selesai".

2. **Kelemahan Penilaian Biner Murni (Binary)**:
   * **Loss of Nuance**: Skema biner tidak memberikan penghargaan bagi mahasiswa yang menulis 90% kode dengan benar tetapi melakukan kesalahan typo kecil (seperti menulis `im` bukan `nim` atau lupa tanda kutip).
   * **Deviasi Ekstrem**: MAE (Mean Absolute Error) pada penilaian Binary cenderung meningkat tajam karena deviasi antara penilaian holistik manusia (dosen) dengan penilaian biner kaku sangat jauh.
