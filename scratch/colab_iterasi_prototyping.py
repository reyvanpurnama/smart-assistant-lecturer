# ==============================================================================
# SMART ASSISTANT LECTURER (SAL) - GOOGLE COLAB: CELL 2 (ITERASI PROTOTYPING)
# ==============================================================================
# Jalankan sel ini di sel Google Colab berikutnya (Cell 2) untuk mengunggah 
# dataset Iterasi 2 dan merender grafik perbandingan Prototyping (Iterasi 1 vs 2).
# ==============================================================================

import io
import csv
import math
import matplotlib.pyplot as plt

try:
    from google.colab import files
    IS_COLAB = True
except ImportError:
    IS_COLAB = False

def calculate_kendall_tau(x, y):
    """Menghitung Kendall's Tau-b dengan ties handling."""
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

def run_colab_iterasi():
    print("=======================================================================")
    print("  SMART ASSISTANT LECTURER (SAL) - COLAB GRAFIK ITERASI PROTOTYPING    ")
    print("=======================================================================")
    
    uploaded = {}
    if IS_COLAB:
        print("📁 Klik 'Choose Files' & upload CSV Iterasi 2 / Trinary Final (misal: IF23A_cleaned_trinary.csv):")
        uploaded = files.upload()
    else:
        import os
        docs_dir = os.path.join(os.path.dirname(__file__), "../docs")
        p = os.path.join(docs_dir, "IF23A_cleaned_trinary.csv")
        if os.path.exists(p):
            with open(p, "rb") as f:
                uploaded["IF23A_cleaned_trinary.csv"] = f.read()

    if not uploaded:
        print("❌ Tidak ada file yang diunggah.")
        return

    filename, content = list(uploaded.items())[0]
    
    # Read CSV content
    x_trinary, y_dosen = [], []
    if isinstance(content, bytes):
        text_stream = io.StringIO(content.decode("utf-8-sig"))
    else:
        text_stream = io.StringIO(content)
        
    reader = csv.DictReader(text_stream)
    for row in reader:
        x_trinary.append(float(row["skor_ai"]))
        y_dosen.append(float(row["skor_dosen"]))
        
    # Hitung metrik dinamis Iterasi 2
    tau_iterasi2 = calculate_kendall_tau(x_trinary, y_dosen)
    mae_iterasi2 = calculate_mae(x_trinary, y_dosen)
    
    # Data Baseline Iterasi 1 (Prototype Awal - Penilaian Biner)
    tau_iterasi1 = 0.4400
    mae_iterasi1 = 18.33
    
    # Delta Persentase Peningkatan
    delta_tau = ((tau_iterasi2 - tau_iterasi1) / tau_iterasi1) * 100
    delta_mae = ((mae_iterasi1 - mae_iterasi2) / mae_iterasi1) * 100
    
    print(f"\n📊 HASIL EVALUASI ALUR ITERASI PROTOTYPING (N = {len(x_trinary)})")
    print(f"-----------------------------------------------------------------------")
    print(f"🔴 Iterasi 1 (Prototype Awal - Binary Scoring):")
    print(f"   - Kendall's Tau (τ) : {tau_iterasi1:.4f}")
    print(f"   - MAE (Error Poin)  : {mae_iterasi1:.2f} Poin\n")
    print(f"🟢 Iterasi 2 (Prototype Final - Trinary Scoring / {filename}):")
    print(f"   - Kendall's Tau (τ) : {tau_iterasi2:.4f}")
    print(f"   - MAE (Error Poin)  : {mae_iterasi2:.2f} Poin\n")
    print(f"📈 Peningkatan Rank Correlation (Kendall Tau) : +{delta_tau:.1f}%")
    print(f"📉 Penurunan Error Poin (MAE)                 : -{delta_mae:.1f}%")
    print(f"-----------------------------------------------------------------------")

    # Render Grafik Matplotlib
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.8), dpi=150)
    
    stages = ['Iterasi 1\n(Prototype Awal - Biner)', 'Iterasi 2\n(Prototype Final - Trinary)']
    tau_vals = [tau_iterasi1, tau_iterasi2]
    mae_vals = [mae_iterasi1, mae_iterasi2]
    
    colors_tau = ['#94a3b8', '#4f46e5']
    colors_mae = ['#ef4444', '#10b981']
    
    # Subplot 1: Kendall's Tau
    bars1 = ax1.bar(stages, tau_vals, color=colors_tau, width=0.48, edgecolor='black', linewidth=0.8)
    ax1.set_title(f"Korelasi Peringkat Kendall's Tau (τ)\n[Meningkat +{delta_tau:.1f}%]", fontsize=11, fontweight='bold', pad=12)
    ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=10, fontweight='bold')
    ax1.set_ylim(0, 1.0)
    for bar in bars1:
        yval = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontweight='bold')
        
    # Subplot 2: MAE
    bars2 = ax2.bar(stages, mae_vals, color=colors_mae, width=0.48, edgecolor='black', linewidth=0.8)
    ax2.set_title(f"Mean Absolute Error (MAE)\n[Error Turun -{delta_mae:.1f}%]", fontsize=11, fontweight='bold', pad=12)
    ax2.set_ylabel("Error Poin (MAE)", fontsize=10, fontweight='bold')
    ax2.set_ylim(0, 22.0)
    for bar in bars2:
        yval = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.4, f"{yval:.2f}", ha='center', va='bottom', fontweight='bold')
        
    plt.suptitle("Peningkatan Performansi Sistem pada Alur Iterasi Prototyping (SAL)", fontsize=13, fontweight='bold', y=1.03)
    plt.tight_layout()
    
    out_img = "grafik_iterasi_prototype.png"
    plt.savefig(out_img, bbox_inches='tight')
    plt.show()
    
    if IS_COLAB:
        files.download(out_img)
        print(f"📥 Gambar {out_img} berhasil di-download ke laptop kamu!")

if __name__ == "__main__":
    run_colab_iterasi()
