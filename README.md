# Smart Assistant Lecturer (SAL) 🎓🤖

Smart Assistant Lecturer (SAL) adalah platform penilaian tugas praktikum pemrograman dan basis data berbasis kecerdasan buatan (**Large Language Model - LLM**). Sistem ini dirancang untuk membantu dosen mengoreksi jawaban esai pendek dan sintaks SQL mahasiswa secara otomatis, objektif, dan instan, sekaligus menyediakan antarmuka bagi dosen untuk melakukan penyesuaian nilai (*Human-in-the-Loop*).

Sistem ini dikembangkan khusus sebagai bagian dari penelitian Tugas Akhir/Skripsi Program Studi Teknik Informatika, Fakultas Sains dan Teknologi, Universitas Muhammadiyah Bandung.

---

## 🚀 Fitur Utama

1. **Automated Essay & Code Scoring (Penilaian Otomatis):**
   * Menilai sintaks SQL dan penjelasan konseptual mahasiswa berdasarkan kriteria rubrik yang ditetapkan dosen.
   * Didukung model bahasa open-weight **GPT-OSS 120B** via **Groq API** dengan latensi rendah.
   
2. **Decoupled Middleware Architecture:**
   * Memisahkan logika platform utama dari vendor API AI (*provider-agnostic*), memungkinkan penggantian model bahasa (seperti Llama 3.3, Qwen) tanpa merusak kode inti sistem.

3. **Mekanisme Context Grounding:**
   * Membatasi ruang penalaran LLM secara ketat hanya pada berkas acuan dan aturan toleransi dosen (*Ground Truth*) guna mengeliminasi risiko halusinasi AI (*hallucination mitigation*).

4. **Lecturer Validation & Override Dashboard:**
   * Panel khusus dosen untuk meninjau log *Chain-of-Thought (CoT)* AI, membaca justifikasi kualitatif per aspek rubrik, dan melakukan *Manual Override* nilai menggunakan slider interaktif.

5. **Student Feedback Portal:**
   * Halaman bagi mahasiswa untuk mengunggah jawaban (mendukung `.pdf`, `.docx`, `.txt`) dan menerima umpan balik terperinci per aspek penilaian secara real-time.

---

## 🛠️ Stack Teknologi

* **Frontend & Backend API:** [Next.js](https://nextjs.org/) (React/TypeScript)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL BaaS)
* **Hosting Platform:** [Vercel](https://vercel.com/)
* **AI Inference Service:** [Groq API](https://console.groq.com/)
* **Document Parser:** [Unpdf](https://github.com/unpdf/unpdf) (Text-based PDF Extraction)

---

## 📦 Panduan Instalasi Lokal

### 1. Prasyarat
* Node.js v18.x atau yang lebih baru
* NPM atau Yarn

### 2. Kloning Repositori
```bash
git clone https://github.com/reyvanpurnama/smart-assistant-lecturer.git
cd smart-assistant-lecturer
```

### 3. Konfigurasi Environment Variables
Buat berkas `.env` di root direktori proyek dan lengkapi variabel berikut:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key

# Opsional: override default model
LLM_MODEL=openai/gpt-oss-120b
```

### 4. Instalasi Dependensi & Jalankan Development Server
```bash
npm install
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 📑 Struktur Database (Supabase Schema)

Sistem menggunakan skema tabel PostgreSQL berikut untuk mengelola data:
* `assignments`: Menyimpan metadata tugas praktikum, soal, *reference context* (ground truth), dan model AI yang digunakan.
* `rubrics`: Kriteria penilaian tugas yang diinput oleh dosen (nama aspek, bobot, deskripsi kriteria).
* `submissions`: Menyimpan berkas laporan, NIM/Nama mahasiswa, hasil teks ekstraksi, skor AI, skor akhir (setelah override), status penilaian, serta log *Chain-of-Thought* AI.
* `rubric_scores`: Nilai rinci dan umpan balik kualitatif untuk setiap aspek kriteria dari masing-masing submission.

---

## 📈 Metrik Evaluasi Penelitian (Skripsi)
Keandalan sistem dievaluasi dengan membandingkan nilai keluaran sistem (AI) terhadap nilai asli dosen (*ground truth*) menggunakan perhitungan statistik:
* **Quadratic Weighted Kappa (QWK):** Mengukur tingkat kesesuaian/keandalan antar penilai (AI vs Dosen).
* **Pearson Correlation Coefficient:** Mengukur kekuatan hubungan linier tren nilai dari sistem dan dosen.
