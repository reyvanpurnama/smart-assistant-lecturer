import csv
import math
import os
import matplotlib.pyplot as plt

# ==============================================================================
# SMART ASSISTANT LECTURER (SAL) - SCRIPT VISUALISASI METRIK DENGAN RUMUS STATISTIK
# ==============================================================================
# Script ini membaca data retrospektif mahasiswa dari file CSV, menghitung metrik
# Kendall's Tau (tau) dan Mean Absolute Error (MAE) secara dinamis dengan rumus matematika,
# serta menghasilkan grafik visualisasi siap pakai untuk naskah Skripsi / Slide Sidang.
# ==============================================================================

def calculate_kendall_tau(x, y):
    """
    Menghitung Kendall's Rank Correlation Coefficient (Tau-b) dengan penanganan ties.
    Rumus: tau = (Nc - Nd) / sqrt((Nc + Nd + Tx) * (Nc + Nd + Ty))
    """
    n = len(x)
    if n < 2:
        return 0.0
    
    nc = 0  # Pair konkordan (selaras)
    nd = 0  # Pair diskordant (berlawanan)
    tx = 0  # Ties hanya pada variabel X (Skor AI)
    ty = 0  # Ties hanya pada variabel Y (Skor Dosen)
    
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
                    
    numerator = nc - nd
    den1 = nc + nd + tx
    den2 = nc + nd + ty
    
    if den1 == 0 or den2 == 0:
        return 0.0
        
    return numerator / math.sqrt(den1 * den2)


def calculate_mae(x, y):
    """
    Menghitung Mean Absolute Error (MAE).
    Rumus: MAE = (1 / N) * sum(|x_i - y_i|)
    """
    n = len(x)
    if n == 0:
        return 0.0
    return sum(abs(a - d) for a, d in zip(x, y)) / n


def load_dataset(csv_path):
    """Membaca file CSV dataset dan mengembalikan list float skor_ai dan skor_dosen."""
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
    
    # 1. Definisi Dataset Strategi Evaluasi
    dataset_configs = [
        {
            "name": "Binary\n(Iterasi 1)",
            "file": os.path.join(docs_dir, "IF23A_cleaned_binary.csv"),
            "color_tau": "#94a3b8",
            "color_mae": "#ef4444"
        },
        {
            "name": "Strict",
            "file": os.path.join(docs_dir, "IF23A_cleaned_strict.csv"),
            "color_tau": "#64748b",
            "color_mae": "#f59e0b"
        },
        {
            "name": "Relaxed",
            "file": os.path.join(docs_dir, "IF23A_cleaned.csv"),
            "color_tau": "#64748b",
            "color_mae": "#3b82f6"
        },
        {
            "name": "Trinary\n(Iterasi 2 / Skripsi)",
            "file": os.path.join(docs_dir, "IF23A_cleaned_trinary.csv"),
            "color_tau": "#4f46e5",
            "color_mae": "#10b981"
        }
    ]
    
    strategies = []
    kendall_tau_list = []
    mae_list = []
    colors_tau = []
    colors_mae = []
    
    print("=======================================================================")
    print("      SMART ASSISTANT LECTURER (SAL) - PERHITUNGAN METRIK STATISTIK    ")
    print("=======================================================================")
    
    for cfg in dataset_configs:
        try:
            x_ai, y_dosen = load_dataset(cfg["file"])
            tau = calculate_kendall_tau(x_ai, y_dosen)
            mae = calculate_mae(x_ai, y_dosen)
            
            clean_name = cfg["name"].replace("\n", " ")
            print(f"🔹 Strategi: {clean_name:<28} | N = {len(x_ai)}")
            print(f"   - Kendall's Tau (τ) : {tau:.4f}")
            print(f"   - MAE (Error Poin)  : {mae:.2f} Poin\n")
            
            strategies.append(cfg["name"])
            kendall_tau_list.append(tau)
            mae_list.append(mae)
            colors_tau.append(cfg["color_tau"])
            colors_mae.append(cfg["color_mae"])
        except Exception as e:
            print(f"[ERROR] Gagal memproses {cfg['file']}: {e}")

    print("=======================================================================")
    print("Generasi Grafik Visualisasi Matplotlib...")

    # Set style matplotlib
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5), dpi=300)
    
    # --------------------------------------------------------------------------
    # Chart 1: Kendall Tau (Rank Correlation)
    # --------------------------------------------------------------------------
    bars1 = ax1.bar(strategies, kendall_tau_list, color=colors_tau, width=0.52, edgecolor='black', linewidth=0.8)
    ax1.set_title("Korelasi Kendall's Tau (τ) [Lebih Tinggi Lebih Baik]", fontsize=12, fontweight='bold', pad=15)
    ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=10, fontweight='bold')
    ax1.set_ylim(0, 1.0)
    
    for bar in bars1:
        yval = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontsize=10, fontweight='bold')
        
    # --------------------------------------------------------------------------
    # Chart 2: Mean Absolute Error (MAE)
    # --------------------------------------------------------------------------
    bars2 = ax2.bar(strategies, mae_list, color=colors_mae, width=0.52, edgecolor='black', linewidth=0.8)
    ax2.set_title("Mean Absolute Error (MAE) [Lebih Kecil Lebih Baik]", fontsize=12, fontweight='bold', pad=15)
    ax2.set_ylabel("Error Poin (MAE)", fontsize=10, fontweight='bold')
    max_mae = max(mae_list) if mae_list else 20.0
    ax2.set_ylim(0, max_mae + 4.0)
    
    for bar in bars2:
        yval = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.3, f"{yval:.2f}", ha='center', va='bottom', fontsize=10, fontweight='bold')
        
    plt.suptitle("Perbandingan Performansi Strategi Evaluasi Asisten Dosen AI (SAL)", fontsize=14, fontweight='bold', y=1.02)
    plt.tight_layout()
    
    # Simpan hasil grafik
    chart_path = os.path.join(docs_dir, "grafik_kendall_mae.png")
    plt.savefig(chart_path, bbox_inches='tight')
    plt.close()
    
    print(f"✅ Grafik berhasil diperbarui & disimpan secara otomatis di:\n   {chart_path}")
    print("=======================================================================")

if __name__ == "__main__":
    main()
