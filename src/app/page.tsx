import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-screen">
      {/* Top decoration line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"></div>

      {/* Top Floating Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-end">
        <ThemeToggle />
      </div>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-6 py-12">
        {/* Brand Hero */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-tr from-indigo-500 to-sky-400 text-white w-14 h-14 rounded-2xl font-extrabold text-2xl shadow-xl shadow-indigo-500/20 mb-3">
            SAL
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight transition-colors duration-300">
            Smart Assistant Lecturer
          </h1>
          <p className="text-xs sm:text-sm text-muted-text max-w-lg mx-auto leading-relaxed transition-colors duration-300">
            Sistem Asisten Dosen Cerdas berbasis kecerdasan buatan untuk penilaian otomatis jawaban esai mahasiswa menggunakan modul Context Grounding &amp; Chain-of-Thought.
          </p>
          <div className="inline-block px-3 py-1 bg-card border border-card-border rounded-full text-[10px] text-muted-text font-bold uppercase tracking-wider transition-colors duration-300">
            Sistem Sidang Skripsi IT
          </div>
        </div>

        {/* Role Switcher Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          
          {/* DOSEN PORTAL CARD */}
          <Link 
            href="/dosen" 
            className="bg-card/70 hover:bg-card border border-card-border hover:border-brand-primary/50 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="size-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center border border-brand-primary/20 group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-brand-primary transition-all duration-300 uppercase tracking-wide">Portal Dosen</h3>
                <p className="text-xs text-muted-text mt-1 leading-relaxed transition-colors duration-300">
                  Membuat tugas baru, mengunci parameter grounding &amp; kriteria rubrik, memvalidasi penilaian otomatis AI, dan mengekspor nilai (.csv).
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs text-brand-primary font-bold group-hover:translate-x-1.5 transition-all duration-300">
              Masuk Dashboard Dosen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* MAHASISWA PORTAL CARD */}
          <Link 
            href="/mahasiswa" 
            className="bg-card/70 hover:bg-card border border-card-border hover:border-brand-secondary/50 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="size-10 bg-brand-secondary/10 text-brand-secondary rounded-xl flex items-center justify-center border border-brand-secondary/20 group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground group-hover:text-brand-secondary transition-all duration-300 uppercase tracking-wide">Portal Mahasiswa</h3>
                <p className="text-xs text-muted-text mt-1 leading-relaxed transition-colors duration-300">
                  Melihat daftar tugas praktikum yang tersedia, mengunggah berkas jawaban (.pdf, .docx, .txt), dan menerima umpan balik penilaian AI instan.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs text-brand-secondary font-bold group-hover:translate-x-1.5 transition-all duration-300">
              Masuk Portal Mahasiswa
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-card-border bg-card/50 py-6 text-center text-xs text-muted-text transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 space-y-1">
          <p>&copy; 2026 Smart Assistant Lecturer - Skripsi IT Universitas Muhammadiyah Bandung</p>
          <p className="text-[10px] text-muted-text/80">Dikembangkan oleh M. Reyvan Purnama (220102043)</p>
        </div>
      </footer>
    </div>
  );
}
