-- =========================================================================
-- SKRIPSI: SMART ASSISTANT LECTURER (SAL) - DATABASE SCHEMA SETUPS
-- =========================================================================

-- 1. TABEL: ASSIGNMENTS (Daftar Tugas Praktikum Dosen)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    model VARCHAR(100) NOT NULL DEFAULT 'llama-3.3-70b-versatile',
    due_date TIMESTAMP WITH TIME ZONE,
    question TEXT NOT NULL,
    reference_context TEXT NOT NULL
);

-- Enable RLS for security (Optional: set true/false based on dev needs)
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert assignments" ON public.assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update assignments" ON public.assignments FOR UPDATE USING (true);

-- 2. TABEL: RUBRICS (Rubrik Penilaian Terikat Aspek & Bobot)
CREATE TABLE IF NOT EXISTS public.rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    aspect_name VARCHAR(150) NOT NULL,
    weight INT NOT NULL CHECK (weight >= 0 AND weight <= 100),
    description TEXT NOT NULL
);

ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read rubrics" ON public.rubrics FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert rubrics" ON public.rubrics FOR INSERT WITH CHECK (true);

-- 3. TABEL: SUBMISSIONS (Lembar Jawaban & Status Penilaian Mahasiswa)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    nim VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    file_path TEXT, -- Link ke file PDF/DOCX di Supabase Storage
    raw_answer_text TEXT, -- Hasil ekstraksi dokumen / teks input langsung
    ai_score NUMERIC(5,2), -- Skor total kumulatif dari AI
    final_score NUMERIC(5,2), -- Skor akhir (bisa sama atau hasil override dosen)
    status VARCHAR(50) NOT NULL DEFAULT 'Graded' CHECK (status IN ('Graded', 'Overridden', 'Outlier')),
    cot_log TEXT -- Log penalaran Chain-of-Thought AI
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update submissions" ON public.submissions FOR UPDATE USING (true);

-- 4. TABEL: RUBRIC_SCORES (Rincian Skor Per Aspek Rubrik dari AI)
CREATE TABLE IF NOT EXISTS public.rubric_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE NOT NULL,
    aspect_name VARCHAR(150) NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    feedback_text TEXT
);

ALTER TABLE public.rubric_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read rubric_scores" ON public.rubric_scores FOR SELECT USING (true);
CREATE POLICY "Allow public insert rubric_scores" ON public.rubric_scores FOR INSERT WITH CHECK (true);

-- =========================================================================
-- 5. STORAGE BUCKET: student-submissions (Menyimpan berkas tugas PDF/DOCX)
-- =========================================================================

-- Tambahkan bucket baru jika belum ada
INSERT INTO storage.buckets (id, name, public) 
VALUES ('student-submissions', 'student-submissions', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Mengizinkan siapa saja untuk mengunggah file (untuk form mahasiswa)
CREATE POLICY "Allow public student upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'student-submissions');

-- Policy 2: Mengizinkan siapa saja membaca/mengunduh berkas
CREATE POLICY "Allow public access read files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'student-submissions');
