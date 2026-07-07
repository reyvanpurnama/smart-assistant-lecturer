"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FileText, 
  Upload, 
  User, 
  CheckCircle2, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function StudentPortal() {
  const router = useRouter();

  // Form State
  const [nim, setNim] = useState("");
  const [name, setName] = useState("");
  const [answer, setAnswer] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

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
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nim || !name) {
      alert("Harap isi Nama dan NIM terlebih dahulu!");
      return;
    }
    if (!answer && !fileName) {
      alert("Harap unggah berkas jawaban atau isi teks esai query SQL!");
      return;
    }
    
    // Direct redirect to Halaman E (Hasil Evaluasi Mhs) for the specific student NIM
    router.push(`/mahasiswa/hasil/${nim}?name=${encodeURIComponent(name)}`);
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
        
        {/* ASSIGNMENT INFO PANEL */}
        <div className="bg-card border border-card-border rounded-2xl p-5 mb-6 shadow-sm transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-3 mb-4 gap-2">
            <div>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20 uppercase tracking-wider">
                Tugas Praktikum Mandiri
              </span>
              <h2 className="text-base font-extrabold text-foreground tracking-tight mt-1">
                Praktikum 2: Inner Join &amp; Subquery
              </h2>
            </div>
            <div className="text-left sm:text-right font-mono text-[10px] text-muted-text">
              Tenggat: <strong className="text-rose-500">15 Juli 2026, 23:59 WIB</strong>
            </div>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-foreground/80">
            <p className="font-semibold text-foreground">Pertanyaan Uraian:</p>
            <p className="bg-slate-500/5 p-3 rounded-xl border border-card-border/60">
              Tuliskan sintaks query SQL untuk menampilkan nama mahasiswa (student_name), nama mata kuliah (course_name), dan nilai akhir (grade) yang diambil dari tabel mahasiswa, matakuliah, dan KRS. Kuncinya adalah hanya menampilkan data mahasiswa yang memiliki nilai di atas 80 dan menggunakan klausa JOIN secara benar. Jelaskan alur eksekusi query tersebut.
            </p>
          </div>
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
                    {fileName ? `Terpilih: ${fileName}` : "Seret &amp; letakkan berkas di sini atau klik untuk mencari"}
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
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Kirim &amp; Nilai Jawaban dengan AI
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
