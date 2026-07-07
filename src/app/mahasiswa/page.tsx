"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Upload, 
  User, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/utils/supabase/client";

export default function StudentPortal() {
  const router = useRouter();

  // Form State
  const [nim, setNim] = useState("");
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assignments State
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchAssignments() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("assignments")
          .select("id, title, question, due_date, course_code")
          .order("created_at", { ascending: false });
        
        if (error) throw error;

        if (data && data.length > 0) {
          setAssignments(data);
          setSelectedAssignment(data[0]);
        }
      } catch (err) {
        console.error("Gagal memuat daftar tugas:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAssignments();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !name) {
      alert("Harap isi Nama dan NIM terlebih dahulu!");
      return;
    }
    if (!selectedAssignment) {
      alert("Harap pilih tugas praktikum terlebih dahulu!");
      return;
    }
    if (!answer && !file) {
      alert("Harap unggah berkas jawaban atau isi teks esai query SQL!");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("nim", nim);
      formData.append("name", name);
      formData.append("answer", answer);
      formData.append("assignmentId", selectedAssignment.id);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirimkan tugas.");
      }
      
      // Redirect to Halaman E (Hasil Evaluasi Mhs) passing the database submission ID
      router.push(`/mahasiswa/hasil/${data.submissionId}?name=${encodeURIComponent(name)}`);
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return "Tidak ada tenggat";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) + " WIB";
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      
      {/* HEADER */}
      <header className="border-b border-card-border bg-card/80 backdrop-blur sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="bg-gradient-to-tr from-emerald-500 to-sky-400 text-white w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-lg shadow-lg shadow-emerald-500/20">
              S
            </Link>
            <div>
              <span className="font-bold text-foreground text-sm tracking-tight">Smart Assistant Lecturer</span>
              <p className="text-[10px] text-muted-text -mt-0.5">Portal Mahasiswa &bull; Pengumpulan Tugas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/dosen" 
              className="px-4 py-2 text-xs font-semibold text-muted-text hover:text-foreground bg-card border border-card-border rounded-xl transition-all duration-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Dosen
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        
        {/* ASSIGNMENT CHOOSE & INFO PANEL */}
        <div className="bg-card border border-card-border rounded-2xl p-5 mb-6 shadow-sm transition-all duration-300 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-text block" htmlFor="select-assignment">Pilih Tugas Praktikum Aktif:</label>
            {isLoading ? (
              <div className="text-xs text-muted-text py-2">Memuat daftar tugas...</div>
            ) : assignments.length === 0 ? (
              <div className="text-xs text-rose-500 font-semibold py-2">Belum ada tugas praktikum aktif dari Dosen.</div>
            ) : (
              <select
                id="select-assignment"
                value={selectedAssignment?.id || ""}
                onChange={(e) => {
                  const found = assignments.find(a => a.id === e.target.value);
                  if (found) setSelectedAssignment(found);
                }}
                className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-emerald-500 transition-all duration-300 cursor-pointer"
              >
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>
                    [{a.course_code}] {a.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedAssignment && (
            <div className="border-t border-card-border/60 pt-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border/60 pb-3 mb-4 gap-2">
                <div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20 uppercase tracking-wider">
                    {selectedAssignment.course_code}
                  </span>
                  <h2 className="text-base font-extrabold text-foreground tracking-tight mt-1">
                    {selectedAssignment.title}
                  </h2>
                </div>
                <div className="text-left sm:text-right font-mono text-[10px] text-muted-text">
                  Tenggat: <strong className="text-rose-500">{formatDueDate(selectedAssignment.due_date)}</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-foreground/80">
                <p className="font-semibold text-foreground">Pertanyaan Uraian:</p>
                <p className="bg-slate-500/5 p-3 rounded-xl border border-card-border/60 whitespace-pre-wrap">
                  {selectedAssignment.question}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SUBMISSION FORM */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Identities */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-4">
              <h3 className="font-bold text-foreground text-xs tracking-wider uppercase border-b border-card-border pb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-500" />
                Identitas Mahasiswa
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="nim">Nomor Induk Mahasiswa (NIM)</label>
                <input 
                  id="nim"
                  type="text" 
                  placeholder="e.g. 220102043" 
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  required
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-emerald-500 transition-all duration-300 font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="name">Nama Lengkap</label>
                <input 
                  id="name"
                  type="text" 
                  placeholder="e.g. M. Reyvan Purnama" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:border-emerald-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Code Input & Drag Drop */}
          <div className="md:col-span-8 space-y-4">
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-4">
              <h3 className="font-bold text-foreground text-xs tracking-wider uppercase border-b border-card-border pb-3">
                Unggah Berkas / Tulis Jawaban
              </h3>

              {/* Drag and Drop Zone */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive 
                    ? "border-emerald-500 bg-emerald-500/5" 
                    : "border-card-border hover:border-emerald-500/50 bg-slate-500/5"
                }`}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden" 
                />
                <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-emerald-500 mx-auto" />
                  <div className="text-xs text-foreground font-bold">
                    {fileName ? `Terpilih: ${fileName}` : "Seret & letakkan berkas di sini atau klik untuk mencari"}
                  </div>
                  <p className="text-[10px] text-muted-text">Mendukung format PDF, DOCX, dan TXT (Maks. 5MB)</p>
                </label>
              </div>

              {/* Text Area Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-text block" htmlFor="answer-textarea">Tulis Jawaban Langsung (Opsional):</label>
                <textarea 
                  id="answer-textarea"
                  rows={8}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Ketik sintaks SQL query dan penjelasan alurnya di sini..."
                  className="w-full text-xs bg-input-bg border border-input-border rounded-xl p-4 text-foreground focus:outline-none focus:border-emerald-500 transition-all duration-300 font-mono leading-relaxed"
                />
              </div>

              {/* Submit Action */}
              <button 
                type="submit"
                disabled={isSubmitting || !selectedAssignment}
                className={`w-full h-11 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 ${
                  isSubmitting || !selectedAssignment
                    ? "bg-slate-500/50 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 shadow-emerald-500/25"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4 mr-2"></span>
                    Mengevaluasi Jawaban dengan AI...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Kirim &amp; Nilai Jawaban dengan AI
                  </>
                )}
              </button>
            </div>
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
