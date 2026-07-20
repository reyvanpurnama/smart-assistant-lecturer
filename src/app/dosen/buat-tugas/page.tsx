"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Settings,
  GraduationCap
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/utils/supabase/client";
import { DEFAULT_LLM_MODEL, getModelDisplayName } from "@/lib/grading/model-policy";

interface RubricItem {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export default function CreateAssignment() {
  const router = useRouter();
  const [courseCode, setCourseCode] = useState("IF204");
  const [title, setTitle] = useState("");
  const [model, setModel] = useState(DEFAULT_LLM_MODEL);
  const [dueDate, setDueDate] = useState(""); // kept as dummy to avoid refactoring other parts if any
  
  const [essayQuestion, setEssayQuestion] = useState("");
  
  const [academicContext, setAcademicContext] = useState("");

  const [rubrics, setRubrics] = useState<RubricItem[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>([DEFAULT_LLM_MODEL]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    document.title = "Buat Soal Baru | Smart Assistant Lecturer";
  }, []);

  useEffect(() => {
    let active = true;
    async function loadModels() {
      try {
        const response = await fetch("/api/internal/llm/models?provider=groq");
        if (response.ok) {
          const data = await response.json();
          if (active && data.models && data.models.length > 0) {
            setModelOptions(data.models);
            const recommended = data.recommendedModel || DEFAULT_LLM_MODEL;
            setModel(recommended);
          }
        }
      } catch (err) {
        console.error("Gagal memuat katalog model:", err);
      } finally {
        if (active) setIsLoadingModels(false);
      }
    }
    loadModels();
    return () => {
      active = false;
    };
  }, []);

  const commonQuestion = `Tuliskan perintah SQL untuk menyelesaikan seluruh latihan berikut secara berurutan:

1. Membuat Database:
- Buat database baru bernama 'universitas'.

2. Membuat Tabel:
- Buat tabel 'mahasiswa' dengan kolom:
  * nim (PK, VARCHAR)
  * nama (VARCHAR)
  * jurusan (VARCHAR)
  * angkatan (YEAR/INT)
  * ipk (DECIMAL/FLOAT/DOUBLE)

3. Menambahkan Data:
- Tambahkan 3 data mahasiswa berikut:
  * ('12345', 'Ali Hasan', 'Informatika', 2021, 3.75)
  * ('12346', 'Budi Santoso', 'Sistem Informasi', 2022, 3.60)
  * ('12347', 'Citra Dewi', 'Teknik Komputer', 2020, 3.85)

4. Membaca Data:
- Tampilkan semua data mahasiswa.
- Tampilkan mahasiswa dari jurusan 'Informatika'.
- Tampilkan mahasiswa dengan IPK lebih dari 3.7.

5. Memperbarui Data:
- Perbarui IPK mahasiswa dengan NIM '12346' menjadi 3.8.

6. Menghapus Data:
- Hapus data mahasiswa dengan nama 'Citra Dewi'.

7. Mengubah Struktur Tabel:
- Tambahkan kolom 'tanggal_lahir' pada tabel mahasiswa.
- Masukkan nilai tanggal lahir pada setiap data di tabel mahasiswa.`;

  const loadTemplate = (type: "trinary" | "relaxed" | "strict" | "binary" = "trinary") => {
    setCourseCode("IF204");
    setEssayQuestion(commonQuestion);

    if (type === "trinary") {
      setTitle("Praktikum 1: Konsep DBMS dan Dasar SQL (Trinary)");
      setAcademicContext(`DOKUMEN ACUAN DAN PANDUAN PENILAIAN BERTINGKAT (TRINARY EVALUATION):

### ATURAN UTAMA PENILAIAN BERTINGKAT (TRINARY):
Setiap aspek penilaian dinilai menggunakan tiga kemungkinan nilai mentah (raw score):
- 100: Terpenuhi sepenuhnya tanpa ada kesalahan sintaks atau kelalaian.
- 50: Terpenuhi sebagian (ada typo ejaan, kelalaian tanda kutip, atau tidak ada screenshot bukti running tetapi kodenya secara logika benar).
- 0: Salah total, tidak lengkap, atau tidak mengumpulkan.
DILARANG memberikan skor di luar 0, 50, dan 100 untuk setiap aspek rubrik.

### SPESIFIKASI KUNCI JAWABAN DAN TOLERANSI:
1. CREATE DATABASE (10%): CREATE DATABASE universitas; (Skor 100=Benar, 50=Nama beda, 0=Salah)
2. CREATE TABLE (10%): CREATE TABLE mahasiswa (nim PK VARCHAR, nama, jurusan, angkatan, ipk); (Skor 100=Benar PK, 50=Typo kolom/tipe data, 0=Tidak ada)
3. INSERT DATA (10%): Insert 3 data mahasiswa. (Skor 100=Lengkap, 50=NIM tanpa kutip/hanya 2 data, 0=Tidak ada)
4. READ DATA - Query 1 (10%): SELECT * FROM mahasiswa;
5. READ DATA - Query 2 (10%): SELECT * FROM mahasiswa WHERE jurusan = 'Informatika';
6. READ DATA - Query 3 (10%): SELECT * FROM mahasiswa WHERE ipk > 3.7;
7. UPDATE DATA (10%): UPDATE mahasiswa SET ipk = 3.8 WHERE nim = '12346' + SS running.
8. DELETE DATA (10%): DELETE FROM mahasiswa WHERE nama = 'Citra Dewi' + SS running.
9. ALTER TABLE - Add Column (10%): ALTER TABLE mahasiswa ADD tanggal_lahir DATE;
10. ALTER TABLE - Update Data (10%): UPDATE tanggal_lahir untuk ketiga mahasiswa.`);

      setRubrics([
        { id: "1", name: "CREATE DATABASE", weight: 10, description: "Pembuatan database universitas. Skor bertingkat: 0, 50, atau 100." },
        { id: "2", name: "CREATE TABLE", weight: 10, description: "Pembuatan tabel mahasiswa (wajib PK nim). Skor bertingkat: 0, 50, atau 100." },
        { id: "3", name: "INSERT", weight: 10, description: "Insert 3 data mahasiswa. Skor bertingkat: 0, 50, atau 100." },
        { id: "4", name: "READ - Query 1", weight: 10, description: "Query SELECT menampilkan semua data. Skor bertingkat: 0, 50, atau 100." },
        { id: "5", name: "READ - Query 2", weight: 10, description: "Query SELECT menampilkan mahasiswa jurusan Informatika. Skor bertingkat: 0, 50, atau 100." },
        { id: "6", name: "READ - Query 3", weight: 10, description: "Query SELECT menampilkan mahasiswa dengan IPK > 3.7. Skor bertingkat: 0, 50, atau 100." },
        { id: "7", name: "UPDATE (Query & SS)", weight: 10, description: "Query UPDATE IPK mahasiswa NIM 12346 menjadi 3.8 dan bukti screenshot. Skor bertingkat: 0, 50, atau 100." },
        { id: "8", name: "DELETE (Query & SS)", weight: 10, description: "Query DELETE mahasiswa Citra Dewi (filter nama) dan bukti screenshot. Skor bertingkat: 0, 50, atau 100." },
        { id: "9", name: "ALTER - Add Column", weight: 10, description: "Query ALTER TABLE ADD tanggal_lahir. Skor bertingkat: 0, 50, atau 100." },
        { id: "10", name: "ALTER - Update Data", weight: 10, description: "Query UPDATE tanggal lahir lengkap untuk ketiga data mahasiswa. Skor bertingkat: 0, 50, atau 100." }
      ]);
    } else if (type === "relaxed") {
      setTitle("Praktikum 1: Konsep DBMS dan Dasar SQL (Relaxed)");
      setAcademicContext(`DOKUMEN ACUAN DAN PANDUAN TOLERANSI VARIASI (RELAXED EVALUATION):
1. PEMBUATAN DATABASE: CREATE DATABASE universitas; (Toleransi case-insensitive & titik koma opsional).
2. PEMBUATAN TABEL: CREATE TABLE mahasiswa (nim PK VARCHAR...); (Ukuran VARCHAR & presisi DECIMAL dibebaskan).
3. MENAMBAHKAN DATA: INSERT 3 data mahasiswa. (Multi-row insert atau 3 insert terpisah dibebaskan).
4. MEMBACA DATA: SELECT * / SELECT spesifik kolom, filter Informatika & IPK > 3.7.
5. MEMPERBARUI DATA: UPDATE IPK NIM 12346 menjadi 3.8.
6. MENGHAPUS DATA: DELETE Citra Dewi (filter nama / NIM 12347).
7. MENGUBAH STRUKTUR TABEL: ALTER ADD tanggal_lahir DATE & UPDATE data.`);

      setRubrics([
        { id: "1", name: "Penerapan CREATE DATABASE", weight: 10, description: "Pembuatan database 'universitas' dengan benar." },
        { id: "2", name: "Penerapan CREATE TABLE", weight: 10, description: "Pembuatan tabel 'mahasiswa' lengkap dengan Primary Key (nim)." },
        { id: "3", name: "Penerapan INSERT DATA", weight: 10, description: "Query memasukkan ketiga baris data mahasiswa secara lengkap." },
        { id: "4", name: "Penerapan SELECT / READ DATA", weight: 30, description: "Logika dari ketiga query pemanggilan data." },
        { id: "5", name: "Penerapan UPDATE DATA", weight: 10, description: "Query perubahan IPK NIM '12346' menjadi 3.8." },
        { id: "6", name: "Penerapan DELETE DATA", weight: 10, description: "Query penghapusan data 'Citra Dewi'." },
        { id: "7", name: "Penerapan ALTER TABLE", weight: 20, description: "Query modifikasi struktur tabel (ALTER ADD) dan pembaruan kolom." }
      ]);
    } else if (type === "strict") {
      setTitle("Praktikum 1: Konsep DBMS dan Dasar SQL (Strict)");
      setAcademicContext(`DOKUMEN ACUAN EVALUASI KETAT (STRICT EVALUATION):
Kurangi skor secara bergradasi desimal untuk setiap kesalahan sintaks, typo nama kolom, atau kegagalan mengikuti instruksi eksak.`);

      setRubrics([
        { id: "1", name: "Penerapan CREATE DATABASE", weight: 10, description: "Sintaks pembuatan database 'universitas' tanpa error." },
        { id: "2", name: "Penerapan CREATE TABLE", weight: 10, description: "Sintaks pembuatan tabel 'mahasiswa' dengan PK (nim)." },
        { id: "3", name: "Penerapan INSERT DATA", weight: 10, description: "Penulisan query insert 3 data mahasiswa secara akurat." },
        { id: "4", name: "Penerapan SELECT / READ DATA", weight: 30, description: "Kebenaran sintaks dari ketiga query pemanggilan data." },
        { id: "5", name: "Penerapan UPDATE DATA", weight: 10, description: "Query perubahan IPK NIM '12346' menjadi 3.8." },
        { id: "6", name: "Penerapan DELETE DATA", weight: 10, description: "Query penghapusan data 'Citra Dewi'." },
        { id: "7", name: "Penerapan ALTER TABLE", weight: 20, description: "Query modifikasi struktur tabel dan update tanggal lahir." }
      ]);
    } else if (type === "binary") {
      setTitle("Praktikum 1: Konsep DBMS dan Dasar SQL (Binary)");
      setAcademicContext(`DOKUMEN ACUAN EVALUASI BINER KETAT (BINARY EVALUATION 0/100):
Setiap aspek HANYA dinilai 100 jika benar sempurna atau 0 jika ada kesalahan/ketidakpatuhan.`);

      setRubrics([
        { id: "1", name: "CREATE DATABASE", weight: 10, description: "Pembuatan database (0 atau 100)." },
        { id: "2", name: "CREATE TABLE", weight: 10, description: "Pembuatan tabel (0 atau 100)." },
        { id: "3", name: "INSERT", weight: 10, description: "Insert 3 data (0 atau 100)." },
        { id: "4", name: "READ - Query 1", weight: 10, description: "SELECT * (0 atau 100)." },
        { id: "5", name: "READ - Query 2", weight: 10, description: "SELECT Informatika (0 atau 100)." },
        { id: "6", name: "READ - Query 3", weight: 10, description: "SELECT IPK > 3.7 (0 atau 100)." },
        { id: "7", name: "UPDATE - Query", weight: 5, description: "UPDATE query (0 atau 100)." },
        { id: "8", name: "UPDATE - Screenshot", weight: 5, description: "UPDATE SS (0 atau 100)." },
        { id: "9", name: "DELETE - Query", weight: 5, description: "DELETE query (0 atau 100)." },
        { id: "10", name: "DELETE - Screenshot", weight: 5, description: "DELETE SS (0 atau 100)." },
        { id: "11", name: "ALTER - Add Column", weight: 10, description: "ALTER ADD (0 atau 100)." },
        { id: "12", name: "ALTER - Update Data", weight: 10, description: "ALTER UPDATE (0 atau 100)." }
      ]);
    }
  };

  const [totalWeight, setTotalWeight] = useState(100);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const sum = rubrics.reduce((acc, curr) => acc + curr.weight, 0);
    setTotalWeight(sum);
  }, [rubrics]);

  const handleWeightChange = (id: string, value: number) => {
    setRubrics(rubrics.map(item => item.id === id ? { ...item, weight: value } : item));
  };

  const handleFieldChange = (id: string, field: keyof RubricItem, value: string) => {
    setRubrics(rubrics.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteRow = (id: string) => {
    setRubrics(rubrics.filter(item => item.id !== id));
  };

  const addNewRow = () => {
    const newId = (Math.random() * 1000).toFixed(0);
    setRubrics([...rubrics, { id: newId, name: "", weight: 0, description: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) {
      alert("Error: Total bobot kriteria harus tepat bernilai 100%!");
      return;
    }
    
    try {
      setIsSaving(true);

      // 1. Insert assignment
      const { data: newAssignment, error: insertAssignErr } = await supabase
        .from("assignments")
        .insert({
          course_code: courseCode,
          title,
          model,
          due_date: null,
          question: essayQuestion,
          reference_context: academicContext
        })
        .select()
        .single();
      
      if (insertAssignErr || !newAssignment) {
        throw new Error(insertAssignErr?.message || "Gagal menyimpan data tugas.");
      }

      // 2. Insert rubrics
      const rubricRows = rubrics.map(r => ({
        assignment_id: newAssignment.id,
        aspect_name: r.name,
        weight: r.weight,
        description: r.description
      }));

      const { error: insertRubricErr } = await supabase
        .from("rubrics")
        .insert(rubricRows);

      if (insertRubricErr) {
        throw new Error(insertRubricErr.message);
      }

      alert(`Sukses! Tugas "${title}" berhasil dikunci dan dipublikasikan di database Supabase.`);
      router.push("/dosen");
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      
      {/* HEADER */}
      <header className="border-b border-card-border bg-card/80 backdrop-blur sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-gradient-to-tr from-indigo-500 to-sky-400 text-white w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-bold text-foreground text-sm tracking-tight">Smart Assistant Lecturer</span>
              <p className="text-[10px] text-muted-text -mt-0.5">Dashboard Dosen &bull; Pembuat Tugas Baru</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/dosen" 
              className="px-4 py-2 text-xs font-semibold text-muted-text hover:text-foreground bg-card border border-card-border rounded-xl transition-all duration-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali
            </Link>
          </div>
        </div>
      </header>

      {/* FORM CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        <div className="space-y-2 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Settings className="w-4 h-4" />
              Pengaturan Penilaian Tugas
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Buat Soal &amp; Rubrik Penilaian</h1>
            <p className="text-xs text-muted-text max-w-2xl leading-relaxed">
              Tentukan kunci jawaban dan kriteria nilai di bawah ini. AI asisten dosen akan menilai jawaban mahasiswa secara obyektif berdasarkan panduan materi dan rubrik penilaian yang Anda tentukan.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-text block w-full md:w-auto">Load Template:</span>
            <button
              type="button"
              onClick={() => loadTemplate("trinary")}
              className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-600 rounded-xl transition-all duration-300 shadow-sm whitespace-nowrap flex items-center gap-1"
            >
              ✨ Trinary (Skripsi)
            </button>
            <button
              type="button"
              onClick={() => loadTemplate("relaxed")}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-white bg-slate-500/10 hover:bg-slate-700 border border-slate-500/20 rounded-xl transition-all duration-300 shadow-sm whitespace-nowrap"
            >
              🛡️ Relaxed
            </button>
            <button
              type="button"
              onClick={() => loadTemplate("strict")}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-white bg-slate-500/10 hover:bg-slate-700 border border-slate-500/20 rounded-xl transition-all duration-300 shadow-sm whitespace-nowrap"
            >
              🎯 Strict
            </button>
            <button
              type="button"
              onClick={() => loadTemplate("binary")}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-white bg-slate-500/10 hover:bg-slate-700 border border-slate-500/20 rounded-xl transition-all duration-300 shadow-sm whitespace-nowrap"
            >
              ⚡ Binary
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* CARD 1: INFORMASI UMUM & MODEL SELECTION */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm transition-all duration-300 space-y-4">
            <h2 className="font-bold text-foreground text-sm tracking-wider uppercase border-b border-card-border pb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded"></span>
              1. Informasi Umum &amp; Model Penilaian
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="course-code">Mata Kuliah / Kelas</label>
                <select 
                  id="course-code" 
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300"
                >
                  <option value="IF204">Basis Data Lanjut (IF204)</option>
                  <option value="IF301">Pemrograman Web Enterprise (IF301)</option>
                  <option value="IF102">Dasar Algoritma &amp; Pemrograman (IF102)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="title">Judul Penugasan</label>
                <input 
                  id="title" 
                  type="text" 
                  placeholder="e.g. Praktikum 2: Inner Join &amp; Subquery" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="llm-model">
                  Model Kecerdasan Buatan (AI) {isLoadingModels && <span className="text-[10px] text-muted-text animate-pulse">(Memuat...)</span>}
                </label>
                <select 
                  id="llm-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300"
                >
                  {modelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {getModelDisplayName(opt)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* CARD 2: CONTEXT GROUNDING PARAMETERS */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm transition-all duration-300 space-y-4">
            <h2 className="font-bold text-foreground text-sm tracking-wider uppercase border-b border-card-border pb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded"></span>
              2. Kunci Jawaban &amp; Panduan Toleransi
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="essay-question">Soal Uraian / Esai Praktikum</label>
                <span className="text-[10px] text-muted-text">Akan ditampilkan pada layar mahasiswa</span>
              </div>
              <textarea 
                id="essay-question" 
                rows={6} 
                required
                value={essayQuestion}
                onChange={(e) => setEssayQuestion(e.target.value)}
                placeholder="Tuliskan detail pertanyaan penugasan..."
                className="w-full text-xs bg-input-bg border border-input-border rounded-xl p-4 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300 leading-relaxed font-sans resize-y"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-semibold text-muted-text block" htmlFor="academic-context">Kunci Jawaban &amp; Modul Referensi</label>
                </div>
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider">Panduan Akurasi AI</span>
              </div>
              <textarea 
                id="academic-context" 
                rows={12} 
                required
                value={academicContext}
                onChange={(e) => setAcademicContext(e.target.value)}
                placeholder="Salin materi modul praktikum, contoh query yang benar, atau skema tabel di sini..."
                className="w-full text-xs bg-input-bg border border-input-border rounded-xl p-4 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300 font-mono leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* CARD 3: DYNAMIC RUBRIC BUILDER */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm transition-all duration-300 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-3 gap-2">
              <h2 className="font-bold text-foreground text-sm tracking-wider uppercase flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-500 rounded"></span>
                3. Rubrik Penilaian Khusus
              </h2>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-text">Total Bobot:</span>
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all duration-300 ${
                  totalWeight === 100 
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${totalWeight === 100 ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                  {totalWeight}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="hidden sm:grid grid-cols-12 gap-3 text-xs font-bold text-muted-text px-2">
                <div className="col-span-3">Nama Aspek</div>
                <div className="col-span-2">Bobot (%)</div>
                <div className="col-span-6">Kriteria Penilaian Detail</div>
                <div className="col-span-1 text-center">Aksi</div>
              </div>

              <div className="space-y-3">
                {rubrics.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-500/5 border border-card-border/60 p-4 sm:p-2.5 rounded-xl items-center transition-all duration-300">
                    <div className="col-span-3">
                      <input 
                        type="text" 
                        value={item.name} 
                        onChange={(e) => handleFieldChange(item.id, "name", e.target.value)}
                        placeholder="Nama Aspek Kriteria" 
                        required
                        className="w-full text-xs bg-input-bg border border-input-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="relative">
                        <input 
                          type="number" 
                          value={item.weight} 
                          onChange={(e) => handleWeightChange(item.id, parseInt(e.target.value) || 0)}
                          min="1" 
                          max="100" 
                          required
                          className="w-full text-xs bg-input-bg border border-input-border rounded-lg pl-3 pr-7 py-2 text-foreground font-mono focus:outline-none focus:border-indigo-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-text font-bold">%</span>
                      </div>
                    </div>
                    <div className="col-span-6">
                      <textarea 
                        value={item.description} 
                        onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                        placeholder="Deskripsi kriteria penilaian detail..." 
                        required
                        rows={2}
                        className="w-full text-xs bg-input-bg border border-input-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-indigo-500 resize-y leading-relaxed"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button 
                        type="button" 
                        onClick={() => deleteRow(item.id)}
                        className="p-2 text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={addNewRow}
                className="px-4 py-2.5 text-xs font-semibold text-indigo-500 dark:text-indigo-400 hover:text-white bg-indigo-500/5 hover:bg-indigo-600 border border-indigo-500/10 hover:border-indigo-600 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 w-full sm:w-auto shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Tambah Aspek Kriteria Baru
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => alert('Tugas disimpan sebagai draft.')}
              className="h-11 px-6 text-xs font-semibold text-foreground bg-card border border-card-border hover:border-indigo-500/50 rounded-xl transition-all duration-300"
            >
              Simpan ke Draft
            </button>
            <button 
              type="submit"
              disabled={totalWeight !== 100 || isSaving}
              className={`h-11 px-8 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 ${
                totalWeight === 100 && !isSaving
                  ? "bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 shadow-indigo-500/25"
                  : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4 mr-2"></span>
                  Mempublikasikan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Kunci &amp; Publikasikan Tugas
                </>
              )}
            </button>
          </div>

        </form>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-card-border bg-card py-4 text-center text-xs text-muted-text transition-all duration-300">
        <p>&copy; 2026 Smart Assistant Lecturer &bull; IT Universitas Muhammadiyah Bandung</p>
      </footer>

    </div>
  );
}
