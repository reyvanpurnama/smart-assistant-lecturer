import csv
import math
import os

def pearson_correlation(x, y):
    n = len(x)
    if n == 0:
        return 0.0
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    
    num = 0.0
    den_x = 0.0
    den_y = 0.0
    
    for i in range(n):
        diff_x = x[i] - mean_x
        diff_y = y[i] - mean_y
        num += diff_x * diff_y
        den_x += diff_x * diff_x
        den_y += diff_y * diff_y
        
    if den_x == 0.0 or den_y == 0.0:
        return 0.0
    return num / math.sqrt(den_x * den_y)

def get_ranks(x):
    n = len(x)
    sorted_x = sorted(enumerate(x), key=lambda item: item[1])
    ranks = [0.0] * n
    
    i = 0
    while i < n:
        j = i
        while j < n and sorted_x[j][1] == sorted_x[i][1]:
            j += 1
        avg_rank = (i + 1 + j) / 2.0
        for k in range(i, j):
            ranks[sorted_x[k][0]] = avg_rank
        i = j
    return ranks

def spearman_correlation(x, y):
    rx = get_ranks(x)
    ry = get_ranks(y)
    return pearson_correlation(rx, ry)

def kendall_tau(x, y):
    n = len(x)
    if n < 2:
        return 0.0
    
    nc = 0
    nd = 0
    tx = 0
    ty = 0
    
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

def generate_visualization(x_ai, y_dosen, output_path):
    try:
        import matplotlib.pyplot as plt
        
        plt.figure(figsize=(8, 6), dpi=300)
        
        # Plot scatter points
        plt.scatter(x_ai, y_dosen, color='#4f46e5', alpha=0.7, edgecolors='none', s=60, label='Mahasiswa (N=33)')
        
        # Perfect agreement reference diagonal line
        plt.plot([0, 100], [0, 100], color='#10b981', linestyle='--', linewidth=1.5, label='Garis Keselarasan Sempurna (y=x)')
        
        # Set titles & labels
        plt.title('Perbandingan Skor Otomatis AI vs Skor Manual Dosen\n(Smart Assistant Lecturer - Strict Evaluation)', fontsize=12, fontweight='bold', pad=15)
        plt.xlabel('Skor Penilaian AI (Strict)', fontsize=10)
        plt.ylabel('Skor Penilaian Dosen (Optimized)', fontsize=10)
        
        plt.xlim(0, 105)
        plt.ylim(0, 105)
        plt.grid(True, linestyle=':', alpha=0.6)
        plt.legend(loc='lower right', fontsize=9)
        
        plt.tight_layout()
        plt.savefig(output_path)
        plt.close()
        print(f"Grafik visualisasi sebaran nilai berhasil disimpan di: {output_path}")
        
    except ImportError:
        print("\n[INFO] Pustaka 'matplotlib' tidak terpasang.")
        print("Untuk menghasilkan grafik visualisasi, silakan jalankan:")
        print("  pip install matplotlib")

def main():
    csv_path = os.path.join(os.path.dirname(__file__), "../docs/IF23A_cleaned_strict.csv")
    img_output_path = os.path.join(os.path.dirname(__file__), "../docs/sebaran_nilai_strict.png")
    
    if not os.path.exists(csv_path):
        print(f"File CSV tidak ditemukan di: {csv_path}")
        return

    x_ai = []
    y_dosen = []
    
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            x_ai.append(float(row["skor_ai"]))
            y_dosen.append(float(row["skor_dosen"]))
            
    n = len(x_ai)
    print(f"Membaca {n} data mahasiswa dari {csv_path}...")
    
    # Calculate metrics
    pearson_r = pearson_correlation(x_ai, y_dosen)
    spearman_r = spearman_correlation(x_ai, y_dosen)
    kendall_t = kendall_tau(x_ai, y_dosen)
    mae = sum(abs(a - d) for a, d in zip(x_ai, y_dosen)) / n
    
    print("\n=== HASIL EVALUASI STATISTIK (STRICT) ===")
    print(f"1. Pearson Correlation Coefficient (r)         : {pearson_r:.4f}")
    print(f"2. Spearman's Rank Correlation Coefficient (rho): {spearman_r:.4f}")
    print(f"3. Kendall's Rank Correlation Coefficient (tau)  : {kendall_t:.4f}")
    print(f"4. Mean Absolute Error (MAE)                   : {mae:.2f}")
    print("=========================================\n")
    
    # Try to generate plot
    generate_visualization(x_ai, y_dosen, img_output_path)

if __name__ == "__main__":
    main()
