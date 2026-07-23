import os
import sys
import csv
import math
import matplotlib.pyplot as plt

# Set aesthetic style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

def kendall_tau(x, y):
    """
    Menghitung koefisien korelasi Kendall's Tau (b) secara statistik murni.
    """
    n = len(x)
    if n < 2:
        return 0.0
    nc, nd, tx, ty = 0, 0, 0, 0
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

def mean_absolute_error(x, y):
    """
    Menghitung Mean Absolute Error (MAE) dalam poin.
    """
    if not x:
        return 0.0
    return sum(abs(a - b) for a, b in zip(x, y)) / len(x)

def read_csv_scores(filepath):
    """
    Membaca skor_ai dan skor_dosen dari file CSV secara dinamis.
    """
    x_ai = []
    y_dosen = []
    with open(filepath, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise ValueError(f"Header CSV tidak ditemukan di {filepath}")

        ai_col = None
        dosen_col = None

        # Deteksi otomatis nama kolom AI dan Dosen
        for col in reader.fieldnames:
            c_low = col.strip().lower()
            if 'ai' in c_low and not ai_col:
                ai_col = col
            elif ('dosen' in c_low or 'ground' in c_low) and not dosen_col:
                dosen_col = col

        if not ai_col or not dosen_col:
            raise ValueError(f"Kolom AI/Dosen tidak terdeteksi di {filepath}. Header: {reader.fieldnames}")

        for row in reader:
            try:
                x_ai.append(float(row[ai_col]))
                y_dosen.append(float(row[dosen_col]))
            except (ValueError, TypeError):
                continue

    if not x_ai:
        raise ValueError(f"Tidak ada data angka valid di {filepath}")

    return x_ai, y_dosen

def find_dragged_csv_files():
    """
    Mencari file CSV hasil drag & drop di direktori kerja (Google Colab / lokal).
    """
    search_dirs = ['.', 'docs', 'scratch']
    csv_files = []
    
    for d in search_dirs:
        if os.path.exists(d):
            for f in sorted(os.listdir(d)):
                if f.endswith('.csv') and not f.startswith('.'):
                    full_p = os.path.join(d, f)
                    if full_p not in csv_files:
                        csv_files.append(full_p)

    csv1, csv2 = None, None

    # Cari berdasarkan kata kunci di nama file
    for p in csv_files:
        p_low = p.lower()
        if ('binary' in p_low or 'iter1' in p_low or 'iterasi1' in p_low or 'awal' in p_low) and not csv1:
            csv1 = p
        elif ('trinary' in p_low or 'iter2' in p_low or 'iterasi2' in p_low or 'final' in p_low) and not csv2:
            csv2 = p

    # Jika tidak ada kata kunci spesifik, ambil 2 CSV pertama yang ditemukan
    if not csv1 and len(csv_files) >= 1:
        csv1 = csv_files[0]
    if not csv2 and len(csv_files) >= 2:
        csv2 = csv_files[1]

    return csv1, csv2

def main():
    print("=========================================================")
    print("   GENERATE GRAFIK ITERASI PROTOTYPE SAL (GOOGLE COLAB)")
    print("=========================================================\n")

    csv_1 = None
    csv_2 = None
    output_img = "grafik_iterasi_prototype.png"

    # 1. Jika nama file diberikan lewat command argument (misal: python generate_charts_iterasi.py file1.csv file2.csv)
    if len(sys.argv) >= 3:
        csv_1 = sys.argv[1]
        csv_2 = sys.argv[2]
        if len(sys.argv) >= 4:
            output_img = sys.argv[3]
    else:
        # 2. Otomatis cari file CSV yang di drag & drop ke panel kiri Google Colab
        csv_1, csv_2 = find_dragged_csv_files()

    tau_1, mae_1, n1 = None, None, 33
    tau_2, mae_2, n2 = None, None, 33

    # Proses File CSV Iterasi 1
    if csv_1 and os.path.exists(csv_1):
        try:
            x1, y1 = read_csv_scores(csv_1)
            tau_1 = kendall_tau(x1, y1)
            mae_1 = mean_absolute_error(x1, y1)
            n1 = len(x1)
            print(f"[SUCCESS] CSV Iterasi 1 Terbaca: {csv_1} (N={n1})")
        except Exception as e:
            print(f"[INFO] Gagal membaca {csv_1}: {e}")

    # Proses File CSV Iterasi 2
    if csv_2 and os.path.exists(csv_2):
        try:
            x2, y2 = read_csv_scores(csv_2)
            tau_2 = kendall_tau(x2, y2)
            mae_2 = mean_absolute_error(x2, y2)
            n2 = len(x2)
            print(f"[SUCCESS] CSV Iterasi 2 Terbaca: {csv_2} (N={n2})")
        except Exception as e:
            print(f"[INFO] Gagal membaca {csv_2}: {e}")

    # Fallback Acuan Skripsi jika file tidak ditemukan
    if tau_1 is None or mae_1 is None:
        tau_1 = 0.4400
        mae_1 = 18.33
        print("--> Using default Iteration 1 reference values (Tau=0.4400, MAE=18.33)")

    if tau_2 is None or mae_2 is None:
        tau_2 = 0.7724
        mae_2 = 5.45
        print("--> Using default Iteration 2 reference values (Tau=0.7724, MAE=5.45)")

    print("\n---------------------------------------------------------")
    print("               HASIL EVALUASI STATISTIK")
    print("---------------------------------------------------------")
    print(f"Iterasi 1 (Binary Baseline) : Tau = {tau_1:.4f} | MAE = {mae_1:.2f} poin (N={n1})")
    print(f"Iterasi 2 (3-Point Final)  : Tau = {tau_2:.4f} | MAE = {mae_2:.2f} poin (N={n2})")
    
    tau_diff = ((tau_2 - tau_1) / tau_1) * 100 if tau_1 != 0 else 0
    mae_diff = ((mae_2 - mae_1) / mae_1) * 100 if mae_1 != 0 else 0
    print(f"Perubahan Keselarasan Tau  : {tau_diff:+.1f}%")
    print(f"Reduksi Error MAE           : {mae_diff:+.1f}%")
    print("---------------------------------------------------------\n")

    # Plot Grafik Bar
    iterations = ['Iterasi 1\n(Binary Scoring)', 'Iterasi 2\n(3-Point Partial Credit)']
    tau_vals = [tau_1, tau_2]
    mae_vals = [mae_1, mae_2]

    colors_tau = ['#94a3b8', '#4f46e5']
    colors_mae = ['#ef4444', '#10b981']

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2), dpi=300)

    # Grafik 1: Kendall's Tau
    bars1 = ax1.bar(iterations, tau_vals, color=colors_tau, width=0.45, edgecolor='black', linewidth=0.8)
    ax1.set_title("Keselarasan Peringkat (Kendall's Tau τ)", fontsize=11, fontweight='bold', pad=12)
    ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=9, fontweight='bold')
    ax1.set_ylim(0, max(1.0, max(tau_vals) * 1.15))

    for b in bars1:
        y = b.get_height()
        ax1.text(b.get_x() + b.get_width()/2.0, y + 0.02, f"{y:.4f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

    # Grafik 2: MAE
    bars2 = ax2.bar(iterations, mae_vals, color=colors_mae, width=0.45, edgecolor='black', linewidth=0.8)
    ax2.set_title("Rata-Rata Kesalahan Skor (MAE Poin)", fontsize=11, fontweight='bold', pad=12)
    ax2.set_ylabel("Error Poin (MAE)", fontsize=9, fontweight='bold')
    max_m = max(10.0, max(mae_vals) * 1.2)
    ax2.set_ylim(0, max_m)

    for b in bars2:
        y = b.get_height()
        ax2.text(b.get_x() + b.get_width()/2.0, y + (max_m * 0.02), f"{y:.2f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

    plt.suptitle("Perbandingan Hasil Iterasi Perbaikan Prototype SAL", fontsize=13, fontweight='bold', y=1.02)
    plt.tight_layout()

    # Simpan Gambar Grafik
    plt.savefig(output_img, bbox_inches='tight')
    print(f"--> Grafik berhasil disimpan ke: {output_img}")

    # Simpan copy ke folder docs jika folder docs ada
    docs_path = os.path.join(os.path.dirname(__file__), "../docs/grafik_iterasi_prototype.png")
    if os.path.exists(os.path.dirname(docs_path)):
        try:
            plt.savefig(docs_path, bbox_inches='tight')
            print(f"--> Copy grafik disimpan ke: {docs_path}")
        except Exception:
            pass

    # Tampilkan grafik langsung di cell Colab / Jupyter
    try:
        plt.show()
    except Exception:
        plt.close()

if __name__ == "__main__":
    main()
