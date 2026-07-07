"use client";

import Link from "next/link";
import { useState, use } from "react";
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LecturerOverride({ params }: PageProps) {
  const resolvedParams = use(params);
  const nim = resolvedParams.id;

  // Mock Student Data based on NIM
  const getStudentData = (nimVal: string) => {
    const students: Record<string, any> = {
      "220102043": {
        name: "M. Reyvan Purnama",
        answer: `SELECT m.student_name, mk.course_name, k.grade
FROM mahasiswa m
INNER JOIN krs k ON m.id = k.mahasiswa_id
INNER JOIN matakuliah mk ON k.matakuliah_id = mk.id
WHERE k.grade > 80;

Penjelasan alur eksekusi query SQL:
1. SQL Server/Database Engine akan memproses klausa FROM terlebih dahulu untuk mengambil data dari tabel mahasiswa (m).
2. Kemudian klausa INNER JOIN krs (k) dieksekusi dengan mencocokkan primary key mahasiswa.id dengan foreign key krs.mahasiswa_id.
3. INNER JOIN matakuliah (mk) berikutnya mencocokkan foreign key krs.matakuliah_id dengan primary key matakuliah.id.
4. Klausa WHERE k.grade > 80 diproses untuk memfilter baris data yang nilai mata kuliahnya lebih besar dari 80.
5. Terakhir, klausa SELECT dieksekusi untuk menampilkan kolom nama mahasiswa (student_name), nama mata kuliah (course_name), dan nilai akhir (grade) ke layar output.`,
        aiScores: { sql: 40, join: 30, flow: 26 },
        cot: `[SYSTEM] Menginisialisasi modul Context Grounding...
[GROUNDING] Memuat skema tabel referensi dan sintaks Ground Truth...
[COGNITIVE] Menganalisis sintaks SQL Mahasiswa:
- Klausa SELECT sesuai dengan kriteria proyeksi.
- Struktur INNER JOIN m -> k -> mk dieksekusi secara tepat.
- Kondisi filter WHERE k.grade > 80 valid.
[COGNITIVE] Menganalisis Penjelasan Alur:
- Langkah pemrosesan logical query order (FROM -> JOIN -> WHERE -> SELECT) dijelaskan secara runut dan benar.
- Ada sedikit kekurangan detail pada logical execution database engine, namun penjelasan secara keseluruhan sudah sangat baik.
[SCORE CALCULATOR] Kebenaran Sintaks SQL: 40/40. Logika Join: 30/30. Alur Eksekusi: 26/30.
[DECISION] Evaluasi selesai. Nilai Kumulatif AI: 96.0`
      },
      "220102011": {
        name: "Ahmad Jalaludin",
        answer: `SELECT student_name, course_name, grade
FROM mahasiswa, krs, matakuliah
WHERE mahasiswa.id = krs.mahasiswa_id 
AND krs.matakuliah_id = matakuliah.id 
AND grade >= 80;

Alur eksekusi:
Query ini mengambil tabel mahasiswa, krs, dan matakuliah. Lalu menghubungkan id mahasiswa ke krs dan id krs ke matakuliah di klausa WHERE. Kemudian memfilter nilai grade yang minimal 80. Terakhir mengambil kolom student_name, course_name, grade.`,
        aiScores: { sql: 32, join: 25, flow: 25 },
        cot: `[SYSTEM] Menginisialisasi modul Context Grounding...
[GROUNDING] Memuat skema tabel referensi dan sintaks Ground Truth...
[COGNITIVE] Menganalisis sintaks SQL Mahasiswa:
- Menggunakan IMPLICIT JOIN (comma separated tables di FROM) bukan INNER JOIN eksplisit. Ini merupakan bad practice untuk basis data lanjut, namun sintaks berjalan dengan benar.
- Kondisi filter menggunakan grade >= 80 (padahal di soal tertulis "di atas 80", harusnya > 80). Ini menyebabkan data nilai tepat 80 ikut terbawa. Skor dikurangi.
[COGNITIVE] Menganalisis Penjelasan Alur:
- Penjelasan alur sangat singkat dan tidak merinci tahapan logical processing order (FROM -> JOIN -> WHERE -> SELECT).
[SCORE CALCULATOR] Kebenaran Sintaks SQL: 32/40. Logika Join: 25/30. Alur Eksekusi: 25/30.
[DECISION] Evaluasi selesai. Nilai Kumulatif AI: 82.0`
      }
    };

    return students[nimVal] || {
      name: "Mahasiswa Contoh",
      answer: `SELECT * FROM mahasiswa WHERE kelas = 'A';`,
      aiScores: { sql: 20, join: 10, flow: 10 },
      cot: `[SYSTEM] Menginisialisasi modul...
[GROUNDING] Tidak mendeteksi SQL query yang relevan...
[DECISION] Penilaian selesai. Nilai Kumulatif AI: 40.0`
    };
  };

  const student = getStudentData(nim);

  interface ScoresState {
    sql: number;
    join: number;
    flow: number;
  }

  // States
  const [isCotExpanded, setIsCotExpanded] = useState(true);
  const [scores, setScores] = useState<ScoresState>({
    sql: student.aiScores.sql,
    join: student.aiScores.join,
    flow: student.aiScores.flow
  });
  const [isOverridden, setIsOverridden] = useState(false);

  // Calculate scores
  const totalScore = scores.sql + scores.join + scores.flow;
  const originalTotal = student.aiScores.sql + student.aiScores.join + student.aiScores.flow;

  const handleSliderChange = (key: keyof ScoresState, val: number) => {
    setScores((prev: ScoresState) => ({ ...prev, [key]: val }));
    setIsOverridden(true);
  };

  const resetToAI = () => {
    setScores({ ...student.aiScores });
    setIsOverridden(false);
  };

  const saveOverride = () => {
    alert(`Sukses menyimpan perubahan nilai!\n\nNama: ${student.name}\nNilai Akhir: ${totalScore.toFixed(1)} (Override: ${isOverridden ? 'YA' : 'TIDAK'})`);
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
              <h1 className="text-lg font-extrabold text-foreground tracking-tight">{student.name}</h1>
              <p className="text-xs text-muted-text">NIM: <span className="font-mono">{nim}</span> &bull; Kelas: Basis Data Lanjut (IF204)</p>
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
                    Tuliskan sintaks query SQL untuk menampilkan nama mahasiswa, nama mata kuliah, dan nilai akhir yang diambil dari tabel mahasiswa, matakuliah, dan KRS. Serta jelaskan alur eksekusi query tersebut.
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-muted-text block mb-1">Jawaban (Teks &amp; Kode SQL):</span>
                  <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap">
                    {student.answer}
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
                    {student.cot}
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
                
                {/* Rubric Aspect 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Kebenaran Sintaks SQL</h4>
                      <p className="text-[10px] text-muted-text">Maksimal 40% bobot &bull; SELECT, FROM, JOIN, WHERE.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-brand-primary">{scores.sql}</span>
                      <span className="text-[10px] text-muted-text"> / 40</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="40" 
                    value={scores.sql}
                    onChange={(e) => handleSliderChange("sql", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[8px] text-muted-text font-mono">
                    <span>0 (Salah total)</span>
                    <span className="text-indigo-400 font-bold">AI: {student.aiScores.sql}</span>
                    <span>40 (Sempurna)</span>
                  </div>
                </div>

                {/* Rubric Aspect 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Logika Join &amp; Relasi Tabel</h4>
                      <p className="text-[10px] text-muted-text">Maksimal 30% bobot &bull; Penghubung antar foreign key.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-brand-primary">{scores.join}</span>
                      <span className="text-[10px] text-muted-text"> / 30</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    value={scores.join}
                    onChange={(e) => handleSliderChange("join", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[8px] text-muted-text font-mono">
                    <span>0 (Salah relasi)</span>
                    <span className="text-indigo-400 font-bold">AI: {student.aiScores.join}</span>
                    <span>30 (Sempurna)</span>
                  </div>
                </div>

                {/* Rubric Aspect 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Akurasi Penjelasan Alur</h4>
                      <p className="text-[10px] text-muted-text">Maksimal 30% bobot &bull; Logical execution order query.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-brand-primary">{scores.flow}</span>
                      <span className="text-[10px] text-muted-text"> / 30</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="30" 
                    value={scores.flow}
                    onChange={(e) => handleSliderChange("flow", parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[8px] text-muted-text font-mono">
                    <span>0 (Tidak menjelaskan)</span>
                    <span className="text-indigo-400 font-bold">AI: {student.aiScores.flow}</span>
                    <span>30 (Sempurna)</span>
                  </div>
                </div>

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
                className="h-11 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Simpan &amp; Sahkan Nilai
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
