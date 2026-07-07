"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Users, 
  Plus, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DosenDashboard() {
  const [students, setStudents] = useState([
    { nim: "220102043", name: "M. Reyvan Purnama", aiScore: 96.0, finalScore: 96.0, status: "Graded" },
    { nim: "220102011", name: "Ahmad Jalaludin", aiScore: 82.0, finalScore: 90.0, status: "Overridden" },
    { nim: "220102015", name: "Siti Nurhaliza", aiScore: 88.5, finalScore: 88.5, status: "Graded" },
    { nim: "220102029", name: "Fikri Syahputra", aiScore: 12.0, finalScore: 12.0, status: "Outlier" },
    { nim: "220102052", name: "Rizky Ramadhan", aiScore: 79.0, finalScore: 79.0, status: "Graded" }
  ]);

  const exportToCSV = () => {
    const csvData = [
      ["nim", "nama_mahasiswa", "skor_ai", "skor_dosen", "status"],
      ...students.map(s => [s.nim, s.name, s.aiScore.toFixed(1), s.finalScore.toFixed(1), s.status])
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvData.forEach(row => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rekap_nilai_praktikum2.csv");
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    
    alert("Sukses mengunduh berkas 'rekap_nilai_praktikum2.csv'!\n\nDataset ini siap digunakan untuk komputasi QWK dan Pearson di Google Colab.");
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
              <p className="text-[10px] text-muted-text -mt-0.5">Universitas Muhammadiyah Bandung &bull; Portal Dosen</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block text-xs text-foreground font-semibold bg-card border border-card-border px-3 py-1.5 rounded-xl transition-all duration-300">
              Dosen: <strong className="text-brand-primary">Husni Mubarok, M.T.</strong>
            </span>
            <ThemeToggle />
            <Link 
              href="/mahasiswa" 
              className="px-4 py-2 text-xs font-semibold text-muted-text hover:text-foreground bg-card border border-card-border hover:border-brand-primary/50 rounded-xl transition-all duration-300"
            >
              Simulasi Mhs
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-6">
        
        {/* STATS DASHBOARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300">
            <span className="text-[9px] uppercase tracking-wider text-muted-text font-bold block mb-1">Mata Kuliah Aktif</span>
            <div className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Basis Data Lanjut
            </div>
            <p className="text-[10px] text-brand-primary mt-1 font-semibold">IF204 &bull; Semester 4</p>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300">
            <span className="text-[9px] uppercase tracking-wider text-muted-text font-bold block mb-1">Total Tugas Dibuat</span>
            <div className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <GraduationCap className="w-5 h-5 text-brand-secondary" />
              3 Tugas
            </div>
            <p className="text-[10px] text-muted-text mt-1">Llama 3.3 sebagai model grading utama</p>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300">
            <span className="text-[9px] uppercase tracking-wider text-muted-text font-bold block mb-1">Rata-rata Nilai Kelas</span>
            <div className="text-xl font-extrabold text-brand-primary tracking-tight flex items-center gap-1.5">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              85.4 / 100
            </div>
            <p className="text-[10px] text-muted-text mt-1">Mengalami tren kenaikan kualitatif</p>
          </div>

          <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300">
            <span className="text-[9px] uppercase tracking-wider text-muted-text font-bold block mb-1">Status Pengumpulan</span>
            <div className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1.5">
              <Users className="w-5 h-5 text-amber-500" />
              95% (42 / 45)
            </div>
            <p className="text-[10px] text-muted-text mt-1">3 Mahasiswa belum mengumpulkan</p>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Assignment List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-4">
              <div className="flex justify-between items-center border-b border-card-border pb-3">
                <h2 className="font-bold text-foreground text-xs tracking-wider uppercase">Daftar Tugas</h2>
                <Link 
                  href="/dosen/buat-tugas" 
                  className="px-2.5 py-1 text-[10px] font-bold text-indigo-500 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 border border-indigo-500/20 rounded-lg transition-all duration-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tugas Baru
                </Link>
              </div>

              <div className="space-y-3">
                <div className="bg-indigo-500/5 dark:bg-indigo-950/20 border-2 border-indigo-500/80 rounded-xl p-4 cursor-pointer transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded font-semibold border border-indigo-500/30 uppercase">Aktif</span>
                    <span className="text-[10px] text-muted-text font-mono">42 mhs</span>
                  </div>
                  <h3 className="font-bold text-foreground text-xs mt-2 leading-snug">Praktikum 2: Inner Join & Subquery</h3>
                  <p className="text-[10px] text-muted-text mt-1">Tenggat: 15 Juli 2026</p>
                  <div className="mt-2 text-[9px] text-muted-text font-mono">Model: llama-3.3-70b-versatile</div>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-4 hover:border-indigo-500/50 cursor-pointer transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="px-1.5 py-0.5 text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded font-semibold border border-card-border uppercase">Arsip</span>
                    <span className="text-[10px] text-muted-text font-mono">45 mhs</span>
                  </div>
                  <h3 className="font-bold text-foreground text-xs mt-2 leading-snug">Praktikum 1: DDL & DML Schema</h3>
                  <p className="text-[10px] text-muted-text mt-1">Tenggat: 28 Juni 2026</p>
                  <div className="mt-2 text-[9px] text-muted-text font-mono">Model: llama3-8b-8192</div>
                </div>

                <div className="bg-card border border-card-border rounded-xl p-4 hover:border-indigo-500/50 cursor-pointer transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <span className="px-1.5 py-0.5 text-[9px] bg-slate-150 dark:bg-slate-900 text-slate-450 rounded font-semibold border border-card-border uppercase">Draft</span>
                    <span className="text-[10px] text-muted-text font-mono">0 mhs</span>
                  </div>
                  <h3 className="font-bold text-foreground text-xs mt-2 leading-snug">Ujian Tengah Semester (Teori)</h3>
                  <p className="text-[10px] text-muted-text mt-1">Tenggat: -</p>
                  <div className="mt-2 text-[9px] text-muted-text font-mono">Model: -</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Student Grades Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border pb-3 gap-2">
                <div>
                  <h2 className="font-bold text-foreground text-xs tracking-wider uppercase">Tabel Rekap Nilai Tugas</h2>
                  <p className="text-[10px] text-muted-text mt-0.5">Praktikum 2: Inner Join & Subquery</p>
                </div>
                
                <button 
                  onClick={exportToCSV}
                  className="px-3 py-1.5 text-xs font-semibold text-foreground hover:text-indigo-600 bg-background border border-card-border hover:border-indigo-500/50 rounded-lg transition-all duration-300 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Ekspor data QWK/Pearson (.csv)
                </button>
              </div>

              {/* Grades Table */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-card-border text-muted-text font-bold">
                      <th className="py-3 px-2">NIM</th>
                      <th className="py-3 px-2">Nama Lengkap</th>
                      <th className="py-3 px-2 text-center">Skor AI</th>
                      <th className="py-3 px-2 text-center">Skor Akhir Dosen</th>
                      <th className="py-3 px-2 text-center">Status</th>
                      <th className="py-3 px-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border/60">
                    {students.map((student) => (
                      <tr key={student.nim} className="hover:bg-slate-500/5 transition-all duration-300">
                        <td className="py-3.5 px-2 font-mono text-foreground/80">{student.nim}</td>
                        <td className="py-3.5 px-2 font-semibold text-foreground">{student.name}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-foreground/70">{student.aiScore.toFixed(1)}</td>
                        <td className="py-3.5 px-2 text-center font-mono text-brand-primary font-bold">{student.finalScore.toFixed(1)}</td>
                        <td className="py-3.5 px-2 text-center">
                          {student.status === "Graded" && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              Graded
                            </span>
                          )}
                          {student.status === "Overridden" && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Overridden
                            </span>
                          )}
                          {student.status === "Outlier" && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              Outlier
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-2 text-center">
                          <Link 
                            href={`/dosen/validasi/${student.nim}`} 
                            className="px-2.5 py-1 text-[10px] font-bold text-indigo-500 hover:text-white bg-indigo-500/5 hover:bg-indigo-600 border border-indigo-500/10 hover:border-indigo-600 rounded-lg transition-all duration-300 inline-block"
                          >
                            Periksa
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
