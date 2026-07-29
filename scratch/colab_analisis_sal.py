# ==============================================================================
# SMART ASSISTANT LECTURER (SAL) - GOOGLE COLAB ANALISIS STATISTIK & GRAFIK
# ==============================================================================
# Buka Google Colab (colab.research.google.com), buat Notebook baru,
# lalu salin seluruh kode ini ke dalam satu sel kode dan jalankan (Shift + Enter).
# ==============================================================================

import io
import csv
import math
import matplotlib.pyplot as plt
from scipy import stats

# Cek pustaka google.colab
try:
    from google.colab import files
    IS_COLAB = True
except ImportError:
    IS_COLAB = False

# ------------------------------------------------------------------------------
# 1. RUMUS STATISTIK DINAMIS (PURE PYTHON)
# ------------------------------------------------------------------------------

def calculate_kendall_tau(x, y):
    """Menghitung Kendall's Tau-b dengan penanganan ties."""
    n = len(x)
    if n < 2: return 0.0
    nc = nd = tx = ty = 0
    for i in range(n):
        for j in range(i + 1, n):
            dx = x[i] - x[j]
            dy = y[i] - y[j]
            prod = dx * dy
            if prod > 0: nc += 1
            elif prod < 0: nd += 1
            else:
                if dx == 0 and dy != 0: tx += 1
                elif dy == 0 and dx != 0: ty += 1
    num = nc - nd
    den1 = nc + nd + tx
    den2 = nc + nd + ty
    if den1 == 0 or den2 == 0: return 0.0
    return num / math.sqrt(den1 * den2)

def calculate_mae(x, y):
    """Menghitung Mean Absolute Error (MAE)."""
    if len(x) == 0: return 0.0
    return sum(abs(a - d) for a, d in zip(x, y)) / len(x)

# ------------------------------------------------------------------------------
# 2. MAIN PROSES ANALISIS & UPLOAD
# ------------------------------------------------------------------------------

def run_colab_analysis():
    print("=======================================================================")
    print("      SMART ASSISTANT LECTURER (SAL) - GOOGLE COLAB ANALYZER           ")
    print("=======================================================================")
    
    uploaded = {}
    if IS_COLAB:
        print("📁 Klik tombol 'Choose Files' di bawah (bisa drag & drop file CSV):")
        uploaded = files.upload()
    else:
        print("[INFO] Script dijalankan di lingkungan lokal (bukan Colab).")
        import os
        docs_dir = os.path.join(os.path.dirname(__file__), "../docs")
        for f_name in ["IF23A_cleaned_trinary.csv", "IF23A_cleaned_binary.csv"]:
            p = os.path.join(docs_dir, f_name)
            if os.path.exists(p):
                with open(p, "rb") as f:
                    uploaded[f_name] = f.read()

    if not uploaded:
        print("❌ Tidak ada file yang diunggah.")
        return

    results = []

    # --------------------------------------------------------------------------
    # 3. MEMPROSES SETIAP FILE CSV YANG DIUPLOAD
    # --------------------------------------------------------------------------
    for filename, content in uploaded.items():
        print(f"\n-----------------------------------------------------------------------")
        print(f"📊 Memproses File: {filename}")
        print(f"-----------------------------------------------------------------------")
        
        # Parse CSV menggunakan csv.DictReader
        x_ai = []
        y_dosen = []
        
        try:
            if isinstance(content, bytes):
                text_stream = io.StringIO(content.decode("utf-8-sig"))
            else:
                text_stream = io.StringIO(content)
                
            reader = csv.DictReader(text_stream)
            for row in reader:
                x_ai.append(float(row["skor_ai"]))
                y_dosen.append(float(row["skor_dosen"]))
        except Exception as e:
            print(f"❌ Error membaca file {filename}: {e}")
            continue

        n = len(x_ai)
        if n == 0:
            print(f"⚠️ File {filename} kosong atau kolom 'skor_ai'/'skor_dosen' tidak sesuai.")
            continue

        # Hitung Metrik Utama
        tau = calculate_kendall_tau(x_ai, y_dosen)
        mae = calculate_mae(x_ai, y_dosen)
        spearman, _ = stats.spearmanr(x_ai, y_dosen)
        pearson, _ = stats.pearsonr(x_ai, y_dosen)
        
        # Uji Normalitas Shapiro-Wilk
        stat_ai, p_ai = stats.shapiro(x_ai)
        stat_dosen, p_dosen = stats.shapiro(y_dosen)

        print(f"🔹 Jumlah Sampel Mahasiswa (N) : {n}")
        print(f"1. Kendall's Tau (τ)           : {tau:.4f}  (Metrik Utama Skripsi)")
        print(f"2. Mean Absolute Error (MAE)   : {mae:.2f} Poin (Metrik Utama Skripsi)")
        print(f"3. Spearman Rank Correlation   : {spearman:.4f}")
        print(f"4. Pearson Correlation         : {pearson:.4f}")
        print(f"\n🧪 Uji Normalitas Shapiro-Wilk (alpha = 0.05):")
        print(f"   - Skor AI    : W = {stat_ai:.4f}, p-value = {p_ai:.4f} -> {'TIDAK NORMAL' if p_ai <= 0.05 else 'NORMAL'}")
        print(f"   - Skor Dosen : W = {stat_dosen:.4f}, p-value = {p_dosen:.4f} -> {'TIDAK NORMAL' if p_dosen <= 0.05 else 'NORMAL'}")
        
        results.append({
            "filename": filename,
            "n": n,
            "tau": tau,
            "mae": mae,
            "x_ai": x_ai,
            "y_dosen": y_dosen
        })

        # ----------------------------------------------------------------------
        # 4. MEMBUAT GRAFIK SCATTER (SEBARAN SKOR)
        # ----------------------------------------------------------------------
        plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
        plt.figure(figsize=(7, 5.5), dpi=150)
        plt.scatter(x_ai, y_dosen, color='#4f46e5', alpha=0.8, edgecolors='#312e81', s=65, label=f'Mahasiswa (N={n})')
        plt.plot([0, 100], [0, 100], color='#10b981', linestyle='--', linewidth=1.8, label='Keselarasan Sempurna (y=x)')
        
        plt.title(f"Sebaran Skor AI vs Dosen\nFile: {filename}\n(τ = {tau:.4f}, MAE = {mae:.2f})", fontsize=11, fontweight='bold', pad=12)
        plt.xlabel("Skor AI (SAL)", fontsize=10, fontweight='bold')
        plt.ylabel("Skor Manual Dosen", fontsize=10, fontweight='bold')
        plt.xlim(0, 105)
        plt.ylim(0, 105)
        plt.grid(True, linestyle=':', alpha=0.6)
        plt.legend(loc='lower right', fontsize=9)
        plt.tight_layout()
        
        out_name = f"scatter_{filename.replace('.csv', '')}.png"
        plt.savefig(out_name, bbox_inches='tight')
        plt.show()
        
        if IS_COLAB:
            files.download(out_name)
            print(f"📥 Gambar {out_name} otomatis di-download ke laptop kamu!")

    # --------------------------------------------------------------------------
    # 5. JIKA DIUPLOAD >1 FILE, BUAT GRAFIK KOMPARASI BAR CHART
    # --------------------------------------------------------------------------
    if len(results) > 1:
        print("\n=======================================================================")
        print("📊 MERENDER GRAFIK KOMPARASI ANTAR FILE CSV")
        print("=======================================================================")
        names = [r["filename"].replace(".csv", "").replace("IF23A_cleaned_", "") for r in results]
        taus = [r["tau"] for r in results]
        maes = [r["mae"] for r in results]
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.8), dpi=150)
        
        bars1 = ax1.bar(names, taus, color='#4f46e5', width=0.45, edgecolor='black')
        ax1.set_title("Korelasi Kendall's Tau (τ)", fontsize=11, fontweight='bold')
        ax1.set_ylim(0, 1.0)
        for b in bars1:
            y = b.get_height()
            ax1.text(b.get_x() + b.get_width()/2., y + 0.02, f"{y:.4f}", ha='center', va='bottom', fontweight='bold')
            
        bars2 = ax2.bar(names, maes, color='#10b981', width=0.45, edgecolor='black')
        ax2.set_title("Mean Absolute Error (MAE)", fontsize=11, fontweight='bold')
        ax2.set_ylim(0, max(maes) + 4.0 if maes else 20)
        for b in bars2:
            y = b.get_height()
            ax2.text(b.get_x() + b.get_width()/2., y + 0.3, f"{y:.2f}", ha='center', va='bottom', fontweight='bold')
            
        plt.suptitle("Perbandingan Hasil Analisis File CSV", fontsize=13, fontweight='bold')
        plt.tight_layout()
        
        comp_out = "perbandingan_file_csv.png"
        plt.savefig(comp_out, bbox_inches='tight')
        plt.show()
        
        if IS_COLAB:
            files.download(comp_out)

if __name__ == "__main__":
    run_colab_analysis()
