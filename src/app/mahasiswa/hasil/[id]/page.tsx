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
import { createClient } from "@/utils/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StudentFeedback({ params }: PageProps) {
  const resolvedParams = use(params);
  const submissionId = resolvedParams.id;
  const searchParams = useSearchParams();
  const nameQuery = searchParams.get("name") || "Mahasiswa Praktikum";

  // Loading Progression States
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [modelName, setModelName] = useState("GPT-OSS 120B");

  const [submission, setSubmission] = useState<any>(null);
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    "Membaca berkas jawaban mahasiswa...",
    "Mengekstrak teks & memetakan variabel database...",
    "Mencocokkan dengan Kunci Jawaban...",
    `Menganalisis Logika Jawaban (${modelName})...`,
    "Menghitung Nilai Akhir..."
  ];

  useEffect(() => {
    document.title = "Hasil Evaluasi AI | Smart Assistant Lecturer";
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading && step < steps.length - 1) {
      timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [step, isLoading, steps.length]);

  useEffect(() => {
    async function loadDataAndGrade() {
      try {
        const supabase = createClient();

        // 1. Fetch submission details
        let { data: sub, error: subErr } = await supabase
          .from("submissions")
          .select("id, assignment_id, nim, student_name, ai_score, final_score, status, cot_log, file_path")
          .eq("id", submissionId)
          .single();

        if (subErr || !sub) {
          throw new Error("Hasil penilaian tidak ditemukan atau data Supabase belum selesai disinkronkan.");
        }

        // Fetch assignment to find out which model is selected
        const { data: assignmentData } = await supabase
          .from("assignments")
          .select("model")
          .eq("id", sub.assignment_id)
          .single();

        if (assignmentData?.model) {
          const m = assignmentData.model.toLowerCase();
          if (m.includes("llama")) {
            setModelName("Llama 3.3");
          } else if (m.includes("qwen")) {
            setModelName("Qwen 2.5");
          } else if (m.includes("gpt-oss-20b")) {
            setModelName("GPT-OSS 20B");
          } else if (m.includes("gpt-oss-safeguard")) {
            setModelName("Safety GPT-OSS 20B");
          } else {
            setModelName("GPT-OSS 120B");
          }
        }

        // 2. If it's not graded yet (ai_score is null), trigger the grade API!
        if (sub.ai_score === null) {
          const res = await fetch("/api/grade", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ submissionId }),
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Gagal memproses penilaian AI.");
          }

          // Re-fetch submission after grading finishes
          const { data: updatedSub, error: reFetchErr } = await supabase
            .from("submissions")
            .select("id, assignment_id, nim, student_name, ai_score, final_score, status, cot_log, file_path")
            .eq("id", submissionId)
            .single();

          if (reFetchErr || !updatedSub) {
            throw new Error("Gagal mengambil data hasil penilaian terupdate.");
          }
          sub = updatedSub;
        }

        // 3. Fetch rubric scores
        const { data: rubScores, error: rubErr } = await supabase
          .from("rubric_scores")
          .select("aspect_name, score, feedback_text")
          .eq("submission_id", submissionId);

        if (rubErr) {
          throw new Error(`Gagal memuat rincian rubrik: ${rubErr.message}`);
        }

        // 4. Fetch original rubric definitions for max scores
        const { data: rubricsDef } = await supabase
          .from("rubrics")
          .select("aspect_name, weight")
          .eq("assignment_id", sub.assignment_id);

        const mergedRubrics = (rubScores || []).map(rs => {
          const matchDef = (rubricsDef || []).find(rd => rd.aspect_name === rs.aspect_name);
          const maxWeight = matchDef ? Number(matchDef.weight) : 100;
          let scoreVal = Number(rs.score);

          // If old data has raw score (0-100) instead of weighted score (0-weight)
          if (scoreVal > maxWeight && maxWeight > 0) {
            scoreVal = Number(((scoreVal * maxWeight) / 100).toFixed(2));
          }

          return {
            name: rs.aspect_name,
            score: scoreVal,
            max: maxWeight,
            feedback: rs.feedback_text
          };
        });

        setSubmission(sub);
        setRubrics(mergedRubrics);
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || "Terjadi kesalahan memuat data.");
        setIsLoading(false);
      }
    }

    loadDataAndGrade();
  }, [submissionId]);

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
              <h3 className="font-bold text-foreground text-sm tracking-wide uppercase">Sistem Sedang Memeriksa Jawaban</h3>
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
        ) : errorMsg ? (
          /* ERROR RENDER */
          <div className="w-full max-w-md bg-card border border-card-border rounded-2xl p-6 shadow-md text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold text-foreground uppercase">Gagal Memuat Hasil</h3>
            <p className="text-xs text-muted-text">{errorMsg}</p>
            <Link 
              href="/mahasiswa" 
              className="inline-block px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold"
            >
              Coba Kumpulkan Ulang
            </Link>
          </div>
        ) : submission ? (
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
                  <p className="text-xs text-muted-text mt-0.5">Jawaban dari <strong>{submission.student_name}</strong> (NIM: <span className="font-mono">{submission.nim}</span>) telah dinilai.</p>
                </div>
              </div>

              <div className="bg-slate-500/5 px-6 py-3 rounded-2xl border border-card-border text-center w-full sm:w-auto">
                <span className="text-[9px] text-muted-text uppercase font-bold block">Nilai Akhir AI</span>
                <div className="text-2xl font-extrabold text-brand-primary tracking-tight font-mono mt-0.5">
                  {Number(submission.final_score).toFixed(1)} <span className="text-xs text-muted-text">/ 100</span>
                </div>
              </div>
            </div>

            {/* ATTACHMENT CARD */}
            {submission.file_path && (
              <div className="bg-card border border-card-border rounded-2xl p-4 shadow-sm transition-all duration-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-text uppercase font-bold block">Berkas Terlampir</span>
                    <span className="text-xs font-semibold text-foreground font-mono truncate max-w-[200px] sm:max-w-xs block">
                      {submission.file_path.split("/").pop()}
                    </span>
                  </div>
                </div>
                <a 
                  href={`https://reyvanpurnama-smart-assistant-lecturer.supabase.co/storage/v1/object/public/student-submissions/${submission.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1"
                >
                  Unduh Berkas
                </a>
              </div>
            )}

            {/* DETAILS ACCORDION BY ASPECT */}
            <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm transition-all duration-300 space-y-4">
              <h3 className="font-bold text-foreground text-xs tracking-wider uppercase border-b border-card-border pb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Umpan Balik Aspek Kriteria
              </h3>

              <div className="space-y-4">
                {rubrics.map((aspect, idx) => (
                  <div key={idx} className="bg-slate-500/5 border border-card-border/60 rounded-xl p-4 transition-all duration-300 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-foreground">{aspect.name}</h4>
                      <div className="text-xs font-mono font-bold text-brand-primary">
                        {aspect.score.toFixed(1)} <span className="text-muted-text">/ {aspect.max}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-text leading-relaxed">
                      {aspect.feedback || "Tidak ada rincian umpan balik."}
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
                  Nilai di atas merupakan penilaian objektif awal oleh AI asisten dosen menggunakan rubrik penugasan. Dosen pengampu Anda memiliki wewenang penuh untuk memeriksa ulang dan melakukan koreksi jika terdeteksi kesalahan pembacaan kode.
                </p>
              </div>
            </div>

          </div>
        ) : null}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-card-border bg-card py-4 text-center text-xs text-muted-text transition-all duration-300">
        <p>&copy; 2026 Smart Assistant Lecturer &bull; IT Universitas Muhammadiyah Bandung</p>
      </footer>

    </div>
  );
}
