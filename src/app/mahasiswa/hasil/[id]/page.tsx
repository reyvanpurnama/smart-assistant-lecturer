"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FileText,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentFeedback({ params }: PageProps) {
  const resolvedParams = use(params);
  const nim = resolvedParams.id;
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Mahasiswa Praktikum";

  // Loading Progression States
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const steps = [
    "Membaca berkas jawaban mahasiswa...",
    "Mengekstrak teks & memetakan variabel database...",
    "Mencocokkan jawaban dengan Modul Grounding...",
    "Menjalankan inferensi kognitif Llama 3.3...",
    "Mem-parsing output kriteria & memvalidasi skor..."
  ];

  useEffect(() => {
    if (step < steps.length) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [step]);

  // Mock Result Data
  const mockResult = {
    totalScore: 96.0,
    aspects: [
      { name: "Kebenaran Sintaks SQL", score: 40, max: 40, feedback: "Sintaks query ditulis secara tepat menggunakan standar ANSI-SQL, SELECT, FROM, JOIN, dan filter WHERE sudah sempurna." },
      { name: "Logika Join & Relasi Tabel", score: 30, max: 30, feedback: "Penghubung foreign-primary key dari tabel mahasiswa ke krs dan krs ke matakuliah terjalin secara logis." },
      { name: "Akurasi Penjelasan Alur", score: 26, max: 30, feedback: "Penjelasan logical execution order (FROM -> JOIN -> WHERE -> SELECT) sudah runtut. Sedikit kurang merinci optimasi DBMS internal, namun sangat memuaskan." }
    ]
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
              <p className="text-[10px] text-muted-text -mt-0.5">Portal Mahasiswa &bull; Umpan Balik AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/mahasiswa" 
              className="px-4 py-2 text-xs font-semibold text-muted-text hover:text-foreground bg-card border border-card-border rounded-xl transition-all duration-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali
            </Link>
          </div>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col items-center justify-center">
        
        {isLoading ? (
          /* LOADING STEP CYCLER STATE */
          <div className="w-full max-w-md bg-card border border-card-border rounded-2xl p-8 shadow-xl text-center space-y-6 animate-fade-in transition-all duration-300">
            <div className="relative flex items-center justify-center mx-auto w-16 h-16">
              <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm tracking-wide uppercase">AI Evaluator Sedang Bekerja</h3>
              <p className="text-[10px] text-brand-primary font-mono font-semibold">LANGKAH {step + 1} DARI {steps.length}</p>
            </div>

            {/* PROGRESS METER */}
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500 ease-out"
                style={{ width: `${((step) / steps.length) * 100}%` }}
              ></div>
            </div>

            <div className="text-xs text-muted-text min-h-8 flex items-center justify-center font-medium">
              {steps[step] || "Menyelesaikan penilaian..."}
            </div>
          </div>
        ) : (
          /* FINISHED EVALUATION FEEDBACK STATE */
          <div className="w-full space-y-6 animate-fade-in transition-all duration-300">
            
            {/* SCORE HERO CARD */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="size-12 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-foreground tracking-tight">Evaluasi AI Selesai</h2>
                  <p className="text-xs text-muted-text mt-0.5">Jawaban dari <strong>{name}</strong> (NIM: <span className="font-mono">{nim}</span>) telah dinilai.</p>
                </div>
              </div>

              <div className="bg-slate-500/5 px-6 py-3 rounded-2xl border border-card-border text-center w-full sm:w-auto">
                <span className="text-[9px] text-muted-text uppercase font-bold block">Skor AI Kumulatif</span>
                <div className="text-2xl font-extrabold text-brand-primary tracking-tight font-mono mt-0.5">
                  {mockResult.totalScore.toFixed(1)} <span className="text-xs text-muted-text">/ 100</span>
                </div>
              </div>
            </div>

            {/* DETAILS ACCORDION BY ASPECT */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm transition-all duration-300 space-y-4">
              <h3 className="font-bold text-foreground text-xs tracking-wider uppercase border-b border-card-border pb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Umpan Balik Aspek Kriteria
              </h3>

              <div className="space-y-4">
                {mockResult.aspects.map((aspect, idx) => (
                  <div key={idx} className="bg-slate-500/5 border border-card-border/60 rounded-xl p-4 transition-all duration-300 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-foreground">{aspect.name}</h4>
                      <div className="text-xs font-mono font-bold text-brand-primary">
                        {aspect.score} <span className="text-muted-text">/ {aspect.max}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-text leading-relaxed">
                      {aspect.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ADVISORY BOX */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-foreground">Catatan Hasil Penilaian AI</h4>
                <p className="text-[10px] text-muted-text leading-relaxed">
                  Nilai di atas merupakan penilaian objektif awal oleh AI asisten dosen menggunakan rubrik penugasan. Dosen pengampu Anda memiliki wewenang penuh untuk memeriksa ulang dan melakukan penyesuaian (*manual override*) nilai akhir sebelum disahkan ke portal KRS.
                </p>
              </div>
            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-card-border bg-card py-4 text-center text-xs text-muted-text transition-all duration-300">
        <p>&copy; 2026 Smart Assistant Lecturer &bull; IT Universitas Muhammadiyah Bandung</p>
      </footer>

    </div>
  );
}
