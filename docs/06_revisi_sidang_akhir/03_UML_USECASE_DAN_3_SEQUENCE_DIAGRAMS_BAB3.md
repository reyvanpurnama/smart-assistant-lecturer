# 📐 REVISI BAB III: USE CASE & 3 SEQUENCE DIAGRAMS TERPISAH

**File Target:** `docs/06_revisi_sidang_akhir/03_UML_USECASE_DAN_3_SEQUENCE_DIAGRAMS_BAB3.md`  
**Topik:** Pemodelan UML, Use Case Diagram Halaman, dan 3 Sequence Diagrams Terpisah  
**Catatan Penguji:**  
1. *"Use Case Diagram harus sesuai urutan alur kerja di setiap page dosen dan mahasiswa."*  
2. *"Sequence Diagram masih kurang, harus nyampe ke dosen yang override nilai. Dibikin 3 sequence terpisah: Dosen, Mahasiswa, lalu Dosen lagi."*

---

```markdown
================================================================================
[SIAP COPY-PASTE SKRIPSI] - BAB III SUB-BAB 3.3.1 USE CASE DIAGRAM BERBASIS RUTE HALAMAN
================================================================================

3.3.1. Perancangan Use Case Diagram

Perancangan Use Case Diagram disesuaikan secara presisi dengan arsitektur antarmuka dan alur kerja pengguna pada setiap rute halaman aplikasi Smart Assistant Lecturer (SAL). Aktor utama dalam sistem ini terbagi menjadi dua, yaitu Dosen Pengampu (Evaluator/Administrator) dan Mahasiswa (User).

Pengelompokan Use Case berdasarkan rute halaman aplikasi direpresentasikan sebagai berikut:

1. Aktor Dosen Pengampu:
   a. Halaman /dosen/buat-tugas: Dosen menginput naskah soal esai, mengunggah dokumen referensi acuan Knowledge Grounding, dan menguraikan kriteria rubrik 3-Point Partial Credit.
   b. Halaman /dosen: Dosen memantau dashboard rekapitulasi nilai, status pemeriksaan, dan daftar submisi mahasiswa.
   c. Halaman /dosen/validasi/[id]: Dosen mengulas (review) log penalaran Chain-of-Thought (CoT) AI, melakukan koreksi/override nilai manual, serta memfinalisasi status nilai.

2. Aktor Mahasiswa:
   a. Halaman /tugas/[id]: Mahasiswa mengunggah berkas dokumen jawaban (.pdf, .docx, .txt).
   b. Halaman /tugas/[id]: Mahasiswa melihat visualisasi skor sementara dan rincian umpan balik formatif per aspek secara responsif.

Diagram Use Case disajikan pada Gambar 3.x:

```mermaid
flowchart LR
    subgraph DosenPages["Portal Dosen"]
        UC1["Buat Tugas & Grounding Context (/dosen/buat-tugas)"]
        UC2["Kelola Rubrik 3-Point Partial Credit (/dosen/buat-tugas)"]
        UC3["Lihat Dashboard Rekap Submisi (/dosen)"]
        UC4["Review Log Justifikasi CoT AI (/dosen/validasi/id)"]
        UC5["Koreksi / Override Nilai Manual (/dosen/validasi/id)"]
    end

    subgraph StudentPages["Portal Mahasiswa"]
        UC6["Unggah Berkas Jawaban (/tugas/id)"]
        UC7["Lihat Feedback Formatif & Skor (/tugas/id)"]
    end

    Dosen((Dosen Pengampu))
    Mahasiswa((Mahasiswa))

    Dosen --> UC1
    Dosen --> UC2
    Dosen --> UC3
    Dosen --> UC4
    Dosen --> UC5

    Mahasiswa --> UC6
    Mahasiswa --> UC7
```

================================================================================
```

---

```markdown
================================================================================
[SIAP COPY-PASTE SKRIPSI] - BAB III SUB-BAB 3.3.2 THREE-STAGE SEQUENCE DIAGRAMS
================================================================================

3.3.2. Perancangan Sequence Diagram (Tiga Tahapan Terpisah)

Guna memberikan gambaran eksplisit mengenai interaksi antar-komponen aplikasi, lapisan middleware, basis data Supabase, dan layanan Groq API Cloud, perancangan Sequence Diagram dibagi menjadi 3 tahapan sekuensial terpisah:

1. Sequence Diagram 1: Tahap Pembuatan Tugas dan Grounding Dosen (/dosen/buat-tugas)
Sequence diagram pertama menggambarkan alur kerja Dosen Pengampu saat menerbitkan tugas baru, mengunggah konteks acuan Knowledge Grounding, dan menyimpan kriteria rubrik 3-Point Partial Credit ke basis data Supabase.

```mermaid
sequenceDiagram
    autonumber
    actor Dosen as Dosen Pengampu
    participant FE as Frontend (/dosen/buat-tugas)
    participant API as API Route Middleware
    participant DB as Supabase Database

    Dosen->>FE: Input Naskah Soal, Modul Acuan, & Rubrik (0, 50, 100)
    FE->>API: POST /api/assignments (payload JSON)
    API->>API: Validasi Total Bobot Rubrik == 100%
    API->>DB: INSERT INTO assignments (question, reference_context)
    DB-->>API: return assignment_id
    API->>DB: INSERT INTO rubrics (assignment_id, aspect_name, weight, description)
    DB-->>API: return status_success
    API-->>FE: HTTP 201 Created (Assignment Saved)
    FE-->>Dosen: Tampilkan Notifikasi "Tugas Berhasil Dipublikasikan"
```

2. Sequence Diagram 2: Tahap Submisi Mahasiswa dan Pipeline Evaluasi AI Engine (/tugas/[id])
Sequence diagram kedua menggambarkan alur kerja Mahasiswa saat mengunggah berkas jawaban, dilanjutkan dengan eksekusi pipeline middleware (cleansing teks regex, perakitan prompt modular), inferensi ke Groq API Cloud (model GPT-OSS 120B), komputasi skor terbobot, hingga penyimpanan log justifikasi CoT ke Supabase.

```mermaid
sequenceDiagram
    autonumber
    actor Mahasiswa as Mahasiswa
    participant FE as Frontend (/tugas/id)
    participant Storage as Supabase Storage
    participant MW as Middleware (Cleansing & Prompt Assembler)
    participant Groq as Groq API Cloud (GPT-OSS 120B)
    participant DB as Supabase Database

    Mahasiswa->>FE: Unggah Berkas Jawaban (.pdf / .docx) & Submit
    FE->>Storage: Upload File ke Bucket 'student-submissions'
    Storage-->>FE: return file_path
    FE->>MW: POST /api/submit (submission_id, file_path)
    MW->>MW: Extract Raw Text & Clean via Regex
    MW->>DB: Fetch Question, Context Grounding, & Rubrics
    DB-->>MW: return Context Data
    MW->>MW: Assemble Modular Prompt (Role, Task, CoT, Grounding, Data)
    MW->>Groq: POST /v1/chat/completions (Prompt JSON)
    Groq-->>MW: Response JSON (global_reasoning, rubric_scores, weighted_total)
    MW->>DB: INSERT INTO rubric_scores & UPDATE submissions (holistic_score, global_reasoning)
    DB-->>MW: Status Saved
    MW-->>FE: Return Evaluation Outcome JSON
    FE-->>Mahasiswa: Visualisasi Skor Sementara & Log Feedback Formatif
```

3. Sequence Diagram 3: Tahap Validasi, Review CoT, dan Override Nilai Manual Dosen (/dosen/validasi/[id])
Sequence diagram ketiga menggambarkan alur kerja Dosen Pengampu saat membuka halaman validasi untuk meninjau log penalaran CoT AI. Apabila terdapat ketidaksesuaian penilaian, Dosen dapat melakukan override nilai secara manual dan menyimpan catatan justifikasi resmi ke basis data Supabase.

```mermaid
sequenceDiagram
    autonumber
    actor Dosen as Dosen Pengampu
    participant FE as Frontend (/dosen/validasi/id)
    participant API as API Route Middleware
    participant DB as Supabase Database

    Dosen->>FE: Buka Halaman Validasi Submisi Mahasiswa
    FE->>DB: FETCH Submisi, Answer Text, AI Scores, & CoT Reasoning Log
    DB-->>FE: Return Full Submission Detail Data
    FE-->>Dosen: Tampilkan Komparasi Jawaban, Log CoT AI, & Skor AI
    
    alt Dosen Menyetujui Nilai AI
        Dosen->>FE: Klik "Setujui Nilai AI"
        FE->>API: POST /api/validate (submission_id, is_overridden=false)
        API->>DB: UPDATE submissions SET status='validated', final_score=holistic_score
    else Dosen Melakukan Override Nilai Manual
        Dosen->>FE: Input Skor Manual Baru & Alasan Override
        FE->>API: POST /api/override (submission_id, new_score, override_reason)
        API->>DB: UPDATE submissions SET final_score=new_score, is_overridden=true, override_reason=reason, status='validated'
    end

    DB-->>API: Status Updated
    API-->>FE: Return Confirmation HTTP 200 OK
    FE-->>Dosen: Tampilkan Label Status "Nilai Terverifikasi / Overridden"
```

================================================================================
```
