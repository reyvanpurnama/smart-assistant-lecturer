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

def quadratic_weighted_kappa(x, y, min_val=0, max_val=100):
    n = len(x)
    if n == 0:
        return 0.0
        
    rounded_x = [round(v) for v in x]
    rounded_y = [round(v) for v in y]
    
    classes = list(range(min_val, max_val + 1))
    num_classes = len(classes)
    class_index = {c: idx for idx, c in enumerate(classes)}
    
    # Observational matrix O
    O = [[0] * num_classes for _ in range(num_classes)]
    hist_x = [0] * num_classes
    hist_y = [0] * num_classes
    
    for i in range(n):
        val_x = rounded_x[i]
        val_y = rounded_y[i]
        idx_x = class_index.get(val_x)
        idx_y = class_index.get(val_y)
        if idx_x is not None and idx_y is not None:
            O[idx_x][idx_y] += 1
            hist_x[idx_x] += 1
            hist_y[idx_y] += 1
            
    # Weights matrix W
    W = [[0.0] * num_classes for _ in range(num_classes)]
    for i in range(num_classes):
        for j in range(num_classes):
            diff = classes[i] - classes[j]
            W[i][j] = (diff * diff) / ((num_classes - 1) ** 2) if num_classes > 1 else 0.0
            
    # Expected matrix E
    E = [[0.0] * num_classes for _ in range(num_classes)]
    for i in range(num_classes):
        for j in range(num_classes):
            E[i][j] = (hist_x[i] * hist_y[j]) / n
            
    # Compute agreement and expected disagreement
    num = 0.0
    den = 0.0
    for i in range(num_classes):
        for j in range(num_classes):
            num += W[i][j] * O[i][j]
            den += W[i][j] * E[i][j]
            
    if den == 0.0:
        return 0.0
    return 1.0 - (num / den)

def generate_visualization(x_ai, y_dosen, output_path):
    try:
        import matplotlib.pyplot as plt
        
        plt.figure(figsize=(8, 6), dpi=300)
        
        # Plot scatter points
        plt.scatter(x_ai, y_dosen, color='#4f46e5', alpha=0.7, edgecolors='none', s=60, label='Mahasiswa (N=33)')
        
        # Perfect agreement reference diagonal line
        plt.plot([0, 100], [0, 100], color='#10b981', linestyle='--', linewidth=1.5, label='Garis Keselarasan Sempurna (y=x)')
        
        # Set titles & labels
        plt.title('Perbandingan Skor Otomatis AI vs Skor Manual Dosen\n(Smart Assistant Lecturer)', fontsize=12, fontweight='bold', pad=15)
        plt.xlabel('Skor Penilaian AI', fontsize=10)
        plt.ylabel('Skor Penilaian Dosen', fontsize=10)
        
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
    csv_path = os.path.join(os.path.dirname(__file__), "../docs/IF23A_cleaned.csv")
    img_output_path = os.path.join(os.path.dirname(__file__), "../docs/sebaran_nilai.png")
    
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
    r = pearson_correlation(x_ai, y_dosen)
    qwk100 = quadratic_weighted_kappa(x_ai, y_dosen, 0, 100)
    
    # Binned 0-10 scale
    x_ai_10 = [v / 10.0 for v in x_ai]
    y_dosen_10 = [v / 10.0 for v in y_dosen]
    qwk10 = quadratic_weighted_kappa(x_ai_10, y_dosen_10, 0, 10)
    
    print("\n=== HASIL EVALUASI STATISTIK (LOKAL) ===")
    print(f"1. Pearson Correlation Coefficient (r)                  : {r:.4f}")
    print(f"2. Quadratic Weighted Kappa (QWK) Skala 100 (Integer)  : {qwk100:.4f}")
    print(f"3. Quadratic Weighted Kappa (QWK) Skala 10  (Binned)   : {qwk10:.4f}")
    print("=========================================\n")
    
    # Try to generate plot
    generate_visualization(x_ai, y_dosen, img_output_path)

if __name__ == "__main__":
    main()
