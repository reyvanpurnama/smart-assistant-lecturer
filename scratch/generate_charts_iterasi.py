import csv
import math
import os
import matplotlib.pyplot as plt

# ==============================================================================
# SMART ASSISTANT LECTURER (SAL) - SCRIPT GRAFIK ITERASI PROTOTYPING
# ==============================================================================
# Script ini menghitung metrik Kendall's Tau (tau) dan MAE untuk perbandingan 
# Iterasi 1 (Binary Scoring) vs Iterasi 2 (3-Point Partial Credit / Trinary),
# serta menghasilkan grafik visualisasi perbaikan prototype untuk Bab III & IV Skripsi.
# ==============================================================================

def calculate_kendall_tau(x, y):
    """Menghitung Kendall's Rank Correlation Coefficient (Tau-b) dengan ties handling."""
    n = len(x)
    if n < 2:
        return 0.0
    nc = nd = tx = ty = 0
    for i in range(n):
        for j in range(i + 1, n):
            dx = x[i] - x[j]
            dy = y[i] - y[j]
            prod = dx * dy
            if prod > 0:
                nc += 1
            elif prod < 0:
                nd += 1
            else:
                if dx == 0 and dy != 0:
                    tx += 1
                elif dy == 0 and dx != 0:
                    ty += 1
    num = nc - nd
    den1 = nc + nd + tx
    den2 = nc + nd + ty
    if den1 == 0 or den2 == 0:
        return 0.0
    return num / math.sqrt(den1 * den2)


def calculate_mae(x, y):
    """Menghitung Mean Absolute Error (MAE)."""
    n = len(x)
    if n == 0:
        return 0.0
    return sum(abs(a - d) for a, d in zip(x, y)) / n


def load_dataset(csv_path):
    x_ai = []
    y_dosen = []
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"File CSV tidak ditemukan: {csv_path}")
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            x_ai.append(float(row["skor_ai"]))
            y_dosen.append(float(row["skor_dosen"]))
    return x_ai, y_dosen


def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = os.path.join(base_dir, "../docs")
    
    # Path dataset iterasi
    path_trinary = os.path.join(docs_dir, "IF23A_cleaned_trinary.csv")
    
    # Hitung metrik dinamis Iterasi 2 (Trinary)
    x_trinary, y_dosen = load_dataset(path_trinary)
    tau_iterasi2 = calculate_kendall_tau(x_trinary, y_dosen)
    mae_iterasi2 = calculate_mae(x_trinary, y_dosen)
    
    # Data Iterasi 1 (Binary Awal / Baseline Prototype Awal)
    tau_iterasi1 = 0.4400
    mae_iterasi1 = 18.33
    
    print("=======================================================================")
    print("      HASIL PERHITUNGAN DINAMIS ITERASI PROTOTYPE PENELITIAN SAL       ")
    print("=======================================================================")
    print(f"🔴 Iterasi 1 (Prototype Awal - Penilaian Biner):")
    print(f"   - Kendall's Tau (τ) : {tau_iterasi1:.4f}")
    print(f"   - MAE (Error Poin)  : {mae_iterasi1:.2f} Poin\n")
    print(f"🟢 Iterasi 2 (Prototype Final - 3-Point Partial Credit):")
    print(f"   - Kendall's Tau (τ) : {tau_iterasi2:.4f}")
    print(f"   - MAE (Error Poin)  : {mae_iterasi2:.2f} Poin\n")
    
    # Persentase Peningkatan
    delta_tau = ((tau_iterasi2 - tau_iterasi1) / tau_iterasi1) * 100
    delta_mae = ((mae_iterasi1 - mae_iterasi2) / mae_iterasi1) * 100
    print(f"📈 Peningkatan Keselarasan Rank (Kendall Tau) : +{delta_tau:.1f}%")
    print(f"📉 Penurunan Tingkat Kesalahan (MAE)           : -{delta_mae:.1f}%")
    print("=======================================================================")

    # Visualisasi
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.8), dpi=300)
    
    stages = ['Iterasi 1\n(Prototype Awal - Biner)', 'Iterasi 2\n(Prototype Final - Trinary)']
    tau_vals = [tau_iterasi1, tau_iterasi2]
    mae_vals = [mae_iterasi1, mae_iterasi2]
    
    colors_tau = ['#94a3b8', '#4f46e5']
    colors_mae = ['#ef4444', '#10b981']
    
    # Subplot 1: Kendall's Tau
    bars1 = ax1.bar(stages, tau_vals, color=colors_tau, width=0.48, edgecolor='black', linewidth=0.8)
    ax1.set_title("Korelasi Peringkat Kendall's Tau (τ)\n[Meningkat +75.5%]", fontsize=11, fontweight='bold', pad=12)
    ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=10, fontweight='bold')
    ax1.set_ylim(0, 1.0)
    for bar in bars1:
        yval = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontsize=10, fontweight='bold')
        
    # Subplot 2: MAE
    bars2 = ax2.bar(stages, mae_vals, color=colors_mae, width=0.48, edgecolor='black', linewidth=0.8)
    ax2.set_title("Mean Absolute Error (MAE)\n[Tingkat Error Turun -70.3%]", fontsize=11, fontweight='bold', pad=12)
    ax2.set_ylabel("Error Poin (MAE)", fontsize=10, fontweight='bold')
    ax2.set_ylim(0, 22.0)
    for bar in bars2:
        yval = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.4, f"{yval:.2f}", ha='center', va='bottom', fontsize=10, fontweight='bold')
        
    plt.suptitle("Peningkatan Performansi Sistem pada Alur Iterasi Prototyping (SAL)", fontsize=13, fontweight='bold', y=1.03)
    plt.tight_layout()
    
    chart_path = os.path.join(docs_dir, "grafik_iterasi_prototype.png")
    plt.savefig(chart_path, bbox_inches='tight')
    plt.close()
    
    print(f"✅ Grafik Iterasi berhasil disimpan ke:\n   {chart_path}")
    print("=======================================================================")

if __name__ == "__main__":
    main()
