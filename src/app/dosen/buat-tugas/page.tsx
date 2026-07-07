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
  Settings
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/utils/supabase/client";

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
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [dueDate, setDueDate] = useState("");
  
  const [essayQuestion, setEssayQuestion] = useState("");
  const [academicContext, setAcademicContext] = useState("");

  const [rubrics, setRubrics] = useState<RubricItem[]>([]);
  const [modelOptions, setModelOptions] = useState<string[]>(["llama-3.3-70b-versatile"]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadModels() {
      try {
        const response = await fetch("/api/internal/llm/models?provider=groq");
        if (response.ok) {
          const data = await response.json();
          if (active && data.models && data.models.length > 0) {
            setModelOptions(data.models);
            const recommended = data.recommendedModel || "llama-3.3-70b-versatile";
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

  const loadTemplate = () => {
    setTitle("Praktikum 2: Inner Join & Subquery");
    setEssayQuestion("Tuliskan sintaks query SQL untuk menampilkan nama mahasiswa (student_name), nama mata kuliah (course_name), dan nilai akhir (grade) yang diambil dari tabel mahasiswa, matakuliah, dan KRS. Kuncinya adalah hanya menampilkan data mahasiswa yang memiliki nilai di atas 80 dan menggunakan klausa JOIN secara benar. Jelaskan alur eksekusi query tersebut.");
    setAcademicContext(`SKEMA TABEL DATABASE REFERENSI:
1. mahasiswa (id INT PRIMARY KEY, student_name VARCHAR(100))
2. matakuliah (id INT PRIMARY KEY, course_name VARCHAR(100))
3. krs (id INT PRIMARY KEY, mahasiswa_id INT, matakuliah_id INT, grade INT, FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id), FOREIGN KEY (matakuliah_id) REFERENCES matakuliah(id))

SINTAKS QUERY YANG BENAR (GROUND TRUTH):
SELECT m.student_name, mk.course_name, k.grade
FROM mahasiswa m
INNER JOIN krs k ON m.id = k.mahasiswa_id
INNER JOIN matakuliah mk ON k.matakuliah_id = mk.id
WHERE k.grade > 80;

PENJELASAN LOGIS WAJIB:
- FROM klausa dijalankan awal.
- INNER JOIN m ke k ke mk dilakukan melalui key relasi mahasiswa_id dan matakuliah_id.
- WHERE k.grade > 80 untuk menyaring data nilai di atas 80.
- SELECT memproyeksikan nama mahasiswa, nama mk, dan grade.`);
    setRubrics([
      { id: "1", name: "Kebenaran Sintaks SQL", weight: 40, description: "Sintaks SELECT, FROM, JOIN, dan WHERE harus ditulis dengan benar tanpa syntax error." },
      { id: "2", name: "Logika Join & Relasi Tabel", weight: 30, description: "Kebenaran penghubung antar-tabel mahasiswa ke krs dan krs ke matakuliah." },
      { id: "3", name: "Akurasi Penjelasan Alur", weight: 30, description: "Ketepatan penjelasan urutan logika pemrosesan query (logical processing order)." }
    ]);
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
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
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
            <Link href="/" className="bg-gradient-to-tr from-indigo-500 to-sky-400 text-white w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-lg shadow-lg shadow-indigo-500/20">
              S
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <div className="space-y-2 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Settings className="w-4 h-4" />
              Langkah Setup Evaluasi
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Buat Parameter Grounding &amp; Rubrik</h1>
            <p className="text-xs text-muted-text max-w-2xl leading-relaxed">
              Kunci parameter grounding di bawah ini. AI asisten dosen akan menilai jawaban mahasiswa secara ketat berdasarkan kunci/referensi materi ajar dan rubrik yang Anda tentukan untuk mencegah penilaian yang subjektif dan halusinasi model.
            </p>
          </div>
          <button
            type="button"
            onClick={loadTemplate}
            className="self-start md:self-center px-4 py-2 text-xs font-bold text-indigo-500 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-600 rounded-xl transition-all duration-300 shadow-sm whitespace-nowrap"
          >
            Gunakan Template Soal (Skripsi)
          </button>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="llm-model">
                  Model AI Inferencing (Groq Cloud) {isLoadingModels && <span className="text-[10px] text-muted-text animate-pulse">(Memuat...)</span>}
                </label>
                <select 
                  id="llm-model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-3 py-2.5 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300"
                >
                  {modelOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === "llama-3.3-70b-versatile" ? "GPT-OSS 120B" : opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="due-date">Tenggat Pengumpulan</label>
                <input 
                  id="due-date" 
                  type="datetime-local" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: CONTEXT GROUNDING PARAMETERS */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm transition-all duration-300 space-y-4">
            <h2 className="font-bold text-foreground text-sm tracking-wider uppercase border-b border-card-border pb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded"></span>
              2. Parameter Grounding (Jangkar Kontekstual)
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="essay-question">Soal Uraian / Esai Praktikum</label>
                <span className="text-[10px] text-muted-text">Akan ditampilkan pada layar mahasiswa</span>
              </div>
              <textarea 
                id="essay-question" 
                rows={3} 
                required
                value={essayQuestion}
                onChange={(e) => setEssayQuestion(e.target.value)}
                placeholder="Tuliskan detail pertanyaan penugasan..."
                className="w-full text-xs bg-input-bg border border-input-border rounded-xl p-4 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300 leading-relaxed font-sans"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <label className="text-xs font-semibold text-muted-text block" htmlFor="academic-context">Konteks Akademik (Kunci Jawaban / Modul Referensi)</label>
                </div>
                <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider">Mitigasi Halusinasi AI</span>
              </div>
              <textarea 
                id="academic-context" 
                rows={6} 
                required
                value={academicContext}
                onChange={(e) => setAcademicContext(e.target.value)}
                placeholder="Salin materi modul praktikum, contoh query yang benar, atau skema tabel di sini..."
                className="w-full text-xs bg-input-bg border border-input-border rounded-xl p-4 text-foreground focus:outline-none focus:border-indigo-500 transition-all duration-300 font-mono leading-relaxed"
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
                      <input 
                        type="text" 
                        value={item.description} 
                        onChange={(e) => handleFieldChange(item.id, "description", e.target.value)}
                        placeholder="Deskripsi kriteria penilaian detail..." 
                        required
                        className="w-full text-xs bg-input-bg border border-input-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-indigo-500"
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
