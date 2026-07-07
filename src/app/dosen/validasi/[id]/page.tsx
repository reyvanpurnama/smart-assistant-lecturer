"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { 
  ArrowLeft, 
  Sparkles, 
  Terminal, 
  User, 
  FileText, 
  Save, 
  Undo,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/utils/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LecturerOverride({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const submissionId = resolvedParams.id;

  const [submission, setSubmission] = useState<any>(null);
  const [assignment, setAssignment] = useState<any>(null);
  const [aspectScores, setAspectScores] = useState<any[]>([]);
  
  const [isCotExpanded, setIsCotExpanded] = useState(true);
  const [isOverridden, setIsOverridden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        // 1. Fetch submission details
        const { data: sub, error: subErr } = await supabase
          .from("submissions")
          .select("*")
          .eq("id", submissionId)
          .single();

        if (subErr || !sub) {
          throw new Error("Pengumpulan tidak ditemukan.");
        }

        setSubmission(sub);
        setIsOverridden(sub.status === "Overridden");

        // 2. Fetch assignment details
        const { data: assign, error: assignErr } = await supabase
          .from("assignments")
          .select("*")
          .eq("id", sub.assignment_id)
          .single();

        if (assignErr) throw assignErr;
        setAssignment(assign);

        // 3. Fetch rubric definitions
        const { data: rubricsDef, error: rubDefErr } = await supabase
          .from("rubrics")
          .select("*")
          .eq("assignment_id", sub.assignment_id);

        if (rubDefErr) throw rubDefErr;

        // 4. Fetch current rubric scores
        const { data: currentScores, error: scoresErr } = await supabase
          .from("rubric_scores")
          .select("*")
          .eq("submission_id", submissionId);

        if (scoresErr) throw scoresErr;

        // Merge rubric definitions with scores
        const initialAspects = (rubricsDef || []).map(rd => {
          const scoreRow = (currentScores || []).find(cs => cs.aspect_name === rd.aspect_name);
          return {
            id: scoreRow ? scoreRow.id : null,
            aspect_name: rd.aspect_name,
            max_weight: Number(rd.weight),
            description: rd.description,
            score: scoreRow ? Number(scoreRow.score) : 0,
            ai_score: scoreRow ? Number(scoreRow.score) : 0
          };
        });

        setAspectScores(initialAspects);

      } catch (err) {
        console.error("Error loading validation data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [submissionId]);

  // Calculate scores
  const originalTotal = aspectScores.reduce((acc, curr) => acc + curr.ai_score, 0);
  const totalScore = aspectScores.reduce((acc, curr) => acc + curr.score, 0);

  const handleSliderChange = (index: number, val: number) => {
    setAspectScores(prev => {
      const next = [...prev];
      next[index].score = val;
      return next;
    });
    setIsOverridden(true);
  };

  const resetToAI = () => {
    setAspectScores(prev => prev.map(a => ({ ...a, score: a.ai_score })));
    setIsOverridden(false);
  };

  const saveOverride = async () => {
    try {
      setIsSaving(true);
      
      // Update individual aspect scores in rubric_scores
      for (const aspect of aspectScores) {
        if (aspect.id) {
          const { error: updateScoreErr } = await supabase
            .from("rubric_scores")
            .update({ score: aspect.score })
            .eq("id", aspect.id);
          
          if (updateScoreErr) throw updateScoreErr;
        }
      }

      // Update submission status and final_score
      const { error: updateSubErr } = await supabase
        .from("submissions")
        .update({
          final_score: totalScore,
          status: isOverridden ? "Overridden" : "Graded"
        })
        .eq("id", submissionId);

      if (updateSubErr) throw updateSubErr;

      alert(`Sukses menyimpan perubahan nilai!\n\nNama: ${submission.student_name}\nNilai Akhir: ${totalScore.toFixed(1)} (Override: ${isOverridden ? 'YA' : 'TIDAK'})`);
      router.push("/dosen");
    } catch (err: any) {
      alert(`Gagal menyimpan perubahan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-xs text-muted-text">
        Memuat lembar validasi mahasiswa...
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen text-xs text-rose-500 font-bold">
        Lembar pengumpulan tidak ditemukan di database.
      </div>
    );
  }

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
              <p className="text-[10px] text-muted-text -mt-0.5">Dosen Panel &bull; Validasi &amp; Override Nilai</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link 
              href="/dosen" 
              className="px-4 py-2 text-xs font-semibold text-muted-text hover:text-foreground bg-card border border-card-border rounded-xl transition-all duration-300 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* WORKSPACE GRID */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* STUDENT HEADER CARD */}
        <div className="bg-card border border-card-border rounded-2xl p-5 mb-6 shadow-sm transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-2xl flex items-center justify-center border border-indigo-500/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-foreground tracking-tight">{submission.student_name}</h1>
              <p className="text-xs text-muted-text">NIM: <span className="font-mono">{submission.nim}</span> &bull; Kelas: Basis Data Lanjut (IF204)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-muted-text uppercase font-bold block">Status Penilaian</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`h-2 w-2 rounded-full ${isOverridden ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
                <span className="text-xs font-bold text-foreground">{isOverridden ? "Overridden (Dosen)" : "AI Evaluated"}</span>
              </div>
            </div>

            <div className="h-10 w-px bg-card-border"></div>

            <div className="bg-slate-500/5 px-4 py-2 rounded-xl border border-card-border text-center">
              <span className="text-[9px] text-muted-text uppercase font-bold block">Nilai Akhir</span>
              <div className="text-base font-extrabold text-brand-primary tracking-tight font-mono">
                {totalScore.toFixed(1)} <span className="text-xs text-muted-text">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* SPLIT SCREEN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT PANEL: Student Answer & Document */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-4">
              <h2 className="font-bold text-foreground text-xs tracking-wider uppercase border-b border-card-border pb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Lembar Jawaban Mahasiswa
              </h2>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-muted-text block mb-1">Pertanyaan Tugas:</span>
                  <div className="p-3.5 bg-slate-500/5 border border-card-border/60 rounded-xl text-xs text-foreground/80 leading-relaxed">
                    {assignment?.question || "Tuliskan sintaks query SQL."}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-muted-text block mb-1">Jawaban (Teks &amp; Kode SQL):</span>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap">
                    {submission.raw_answer_text}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: AI CoT & Override Controls */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* AI Reasoning Accordion */}
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300">
              <button 
                onClick={() => setIsCotExpanded(!isCotExpanded)}
                className="w-full flex justify-between items-center border-b border-card-border pb-3"
              >
                <h2 className="font-bold text-foreground text-xs tracking-wider uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  AI Chain-of-Thought (Logs)
                </h2>
                {isCotExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {isCotExpanded && (
                <div className="mt-3">
                  <pre className="p-4 bg-slate-950 text-indigo-300 rounded-xl text-[10px] font-mono leading-relaxed border border-slate-900 overflow-x-auto whitespace-pre-wrap max-h-56 custom-scrollbar">
                    {submission.cot_log || "[SYSTEM] Tidak ada log reasoning."}
                  </pre>
                </div>
              )}
            </div>

            {/* Rubric Evaluator / Sliders */}
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-4">
              <h2 className="font-bold text-foreground text-xs tracking-wider uppercase border-b border-card-border pb-3">
                Rincian Evaluasi Aspek Rubrik
              </h2>

              <div className="space-y-5">
                {aspectScores.map((aspect, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{aspect.aspect_name}</h4>
                        <p className="text-[10px] text-muted-text">Maksimal {aspect.max_weight}% bobot &bull; {aspect.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-brand-primary">{aspect.score}</span>
                        <span className="text-[10px] text-muted-text"> / {aspect.max_weight}</span>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={aspect.max_weight} 
                      value={aspect.score}
                      onChange={(e) => handleSliderChange(idx, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[8px] text-muted-text font-mono">
                      <span>0 (Salah total)</span>
                      <span className="text-indigo-400 font-bold">AI: {aspect.ai_score}</span>
                      <span>{aspect.max_weight} (Sempurna)</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Indicator */}
              <div className="pt-4 border-t border-card-border flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-muted-text uppercase font-bold block">Perbandingan Nilai</span>
                  <div className="text-xs text-foreground mt-0.5">
                    Skor AI: <strong className="font-mono">{originalTotal}</strong> &rarr; Dosen: <strong className="font-mono text-brand-primary">{totalScore}</strong>
                  </div>
                </div>

                {isOverridden && (
                  <div className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-[9px] font-bold border border-amber-500/20 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Nilai diubah secara manual
                  </div>
                )}
              </div>
            </div>

            {/* ACTION PANELS */}
            <div className="flex justify-between gap-3">
              <button 
                onClick={resetToAI}
                disabled={!isOverridden}
                className={`h-11 px-4 text-xs font-semibold rounded-xl border transition-all duration-300 flex items-center gap-1.5 ${
                  isOverridden 
                    ? "bg-card text-foreground border-card-border hover:border-indigo-500/50" 
                    : "bg-slate-100 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border-card-border/40 cursor-not-allowed"
                }`}
              >
                <Undo className="w-4 h-4" />
                Reset ke AI
              </button>

              <button 
                onClick={saveOverride}
                disabled={isSaving}
                className="h-11 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-3.5 h-3.5 mr-1.5"></span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan &amp; Sahkan Nilai
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-card-border bg-card py-4 text-center text-xs text-muted-text transition-all duration-300">
        <p>&copy; 2026 Smart Assistant Lecturer &bull; IT Universitas Muhammadiyah Bandung</p>
      </footer>

    </div>
  );
}
