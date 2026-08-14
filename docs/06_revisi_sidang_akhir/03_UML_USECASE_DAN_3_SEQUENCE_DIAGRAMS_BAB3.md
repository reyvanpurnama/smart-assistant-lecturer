# 📐 REVISI BAB III: USE CASE & 3 SEQUENCE DIAGRAMS TERPISAH

**File Target:** `docs/06_revisi_sidang_akhir/03_UML_USECASE_DAN_3_SEQUENCE_DIAGRAMS_BAB3.md`  
**Topik:** Pemodelan UML, Use Case Diagram Halaman, dan 3 Sequence Diagrams Terpisah  
**Catatan Penguji:**  
1. *"Use Case Diagram harus sesuai urutan alur kerja di setiap page dosen dan mahasiswa."*  
2. *"Sequence Diagram masih kurang, harus nyampe ke dosen yang override nilai. Dibikin 3 sequence terpisah: Dosen, Mahasiswa, lalu Dosen lagi."*

---

## 📍 1. USE CASE DIAGRAM BERBASIS HALAMAN SISTEM

### Pemetaan Halaman Aplikasi & Aktor:
- **Aktor Dosen:**
  - Halaman `/dosen/buat-tugas`: Membuat tugas, mengunggah materi referensi *Knowledge Grounding*, menetapkan bobot rubrik.
  - Halaman `/dosen`: Memantau *dashboard* rekapitulasi nilai dan status pemeriksaan.
  - Halaman `/dosen/validasi/[id]`: Meninjau log penalaran CoT AI, melakukan *override* nilai manual, serta memfinalisasi status nilai.
- **Aktor Mahasiswa:**
  - Halaman `/tugas/[id]`: Mengunggah berkas jawaban (.pdf, .docx, .txt), memicu eksekusi *pipeline* AI middleware, dan melihat umpan balik formatif *real-time*.

### Mermaid Diagram: Use Case System SAL

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

---

## 🔄 2. SEQUENCE DIAGRAM TERPISAH 1: DOSEN (PEMBUATAN TUGAS & GROUNDING)

*Fokus: Alur Dosen membuat instrumen soal, mengunggah materi acuan grounding, dan mengunci kriteria rubrik di Supabase.*

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

---

## 🔄 3. SEQUENCE DIAGRAM TERPISAH 2: MAHASISWA (SUBMISI & PIPELINE EVALUASI AI)

*Fokus: Alur Mahasiswa mengunggah jawaban, eksekusi ekstraksi teks middleware, inferensi Groq LLM (GPT-OSS 120B), komputasi skor, dan penyampaian feedback.*

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

---

## 🔄 4. SEQUENCE DIAGRAM TERPISAH 3: DOSEN (VALIDASI, REVIEW COT, & OVERRIDE NILAI)

*Fokus: Alur Dosen meninjau hasil AI, mengevaluasi justifikasi CoT, melakukan koreksi/override nilai manual jika diperlukan, dan memfinalisasi nilai resmi.*

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

---

## 📌 PENJELASAN INTEGRASI DIAGRAM UNTUK NASKAH SKRIPSI
1. **Pemisahan 3 Sequence Diagram** memberikan kejelasan arsitektur yang sangat tinggi. Penguji dapat melihat dengan jelas batasan antara tahap *authoring* (Dosen), tahap *automated inference* (Mahasiswa & AI Engine), serta tahap *human-in-the-loop control* (Validasi & Override Dosen).
2. **Override Mechanism** pada Diagram 3 membuktikan secara eksplisit bahwa otoritas penilaian akademik tetap 100% berada di tangan dosen pengampu, sehingga menjawab rumusan masalah mengenai kendali kaku rubrik dosen.
