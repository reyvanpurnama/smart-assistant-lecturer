# 🎯 CHECKLIST ACTION PLAN: PERSIAPAN H-1 SIDANG SKRIPSI SAL (06 AGUSTUS 2026)

> *"Setiap masalah 50% selesai ketika ditulis. Sisa 50%-nya tinggal kita centang satu per satu hari ini."*

**Nama:** M. Reyvan Purnama (NIM: 220102043)  
**Jadwal Sidang:** Jumat, 7 Agustus 2026 — Pukul 09.00 WIB  
**Target Hari Ini:** Semua PR Teknis & Teoretis Tuntas, Mental Tenang, Siap Bantai Pertanyaan Penguji Kritis.

---

## 🛠️ TASK LIST HARI INI (CHECKLIST BAR):

### 1. 💻 SCRIPT PYTHON COLAB (`scratch/colab_iterasi_prototyping.py`)
- [x] **Modifikasi Input Multi-CSV:** Ubah `colab_iterasi_prototyping.py` agar secara dinamis menerima file CSV Komparasi atau 2 file CSV (`IF23A_cleaned_binary.csv` & `IF23A_cleaned_trinary.csv`).
- [x] **Verifikasi Output:** Pastikan perhitungan $\tau_b$ dan MAE keluar otomatis (0.4400 vs 0.7724 dan 18.33 vs 5.45 poin).
- [x] **Test Execution:** Jalankan skrip di lingkungan lokal/Colab dan pastikan gambar `grafik_iterasi_prototype.png` ter-generate sempurna.

### 2. 🧠 PENGUASAAN LANDASAN TEORI & SAMPEL (ISLAM & FRAENKEL)
- [x] **Central Limit Theorem (CLT):** Pahami kenapa sampel $N = 33$ sudah memenuhi syarat $N \ge 30$ untuk generalisabilitas statistik inferensial (*Islam, 2018*).
- [x] **Desain Retrospektif:** Pahami kenapa evaluasi esai pada $N = 33$ mahasiswa sudah representatif (*Fraenkel et al., 2019*).
- [x] **Drafting Omongan Hapal:** Siapkan kalimat tangkisan jika penguji nanya: *"Kenapa cuma 33 mahasiswa?"*

### 3. 📊 METRIK EVALUASI: KENDALL'S TAU-B & MAE (KENAPA BUKAN METRIK LAIN?)
- [x] **Penjelasan Kendall's Tau-b ($\tau_b = 0.7724$):** Kenapa pakai Tau-b (karena mengoreksi nilai kembar/ties dan cocok untuk data ordinal hirarki).
- [x] **Penjelasan MAE ($\text{MAE} = 5.45$):** Kenapa pakai MAE (karena mengukur besarnya deviasi fisik poin secara linier tanpa memberi penalti kuadratik yang bias seperti RMSE).
- [x] **Tangkisan Kenapa Ga Pakai Pearson/Spearman Murni:** Pahami kenapa Pearson (linear interval) dan Spearman kurang tepat mengoreksi *ties* sebanyak 71 pasang pada skor dosen.

### 4. 🏗️ KODE & ARSITEKTUR MIDDLEWARE (HAFAL ALUR END-TO-END)
- [x] **Alur Frontend (Next.js):** Pahami bagaimana UI mengirimkan payload tugas & rincian rubrik.
- [x] **Alur Supabase BaaS:** Pahami tempat penyimpanan tabel `tasks`, `rubrics`, `submissions`, dan `grading_results`.
- [x] **Alur Middleware (Prompt Construction):** Pahami rincian 5 kompartemen prompt (`[ROLE]`, `[TASK]`, `[CONTEXT]`, `[CRITERIA]`, `[OUTPUT FORMAT]`).
- [x] **Alur Groq API:** Model `openai/gpt-oss-120b` via Groq Cloud API, forcing Structured JSON output.

### 5. 🥊 LATIHAN MENTAL & SIMULASI DEFENSIF DARI PENGUJI KRITIS
- [x] **Simulasi Tanya Jawab 3 Penguji:** Latihan memperagakan tangkisan untuk 3 skenario pertanyaan tersulit.
- [x] **Revisi Skripsi Mindset:** Sadari bahwa revisi itu *pasti* ada di setiap sidang skripsi manapun (bahkan yang dapet nilai A+), tujuan sidang adalah mempertahankan **logika dasar & keabsahan data**.

---

## ⚡ LOG PROGRES EKSEKUSI HARI INI:
- [x] Checkifying & Drafting Action Plan (`CHECKLIST_HARI_INI_06_AGUSTUS.md`) — *50% masalah tuntas!*
- [x] Task 1: Modifikasi Python Colab Script (`colab_iterasi_prototyping.py`)
- [x] Task 2 & 3: Master Class Statistik & Tangkisan Metrik (Islam, Fraenkel, Tau-b, MAE)
- [x] Task 4: Trace Codebase Middleware & Structured JSON
- [x] Task 5: Rehearsal & Gladi Bersih Mental — **100% PERSIAPAN SELESAI & SIAP BANTAI SIDANG BESOK!** 🚀
