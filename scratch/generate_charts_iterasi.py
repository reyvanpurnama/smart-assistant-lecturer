import sys
import os
import csv
import math
import matplotlib.pyplot as plt
import numpy as np

# Set clean aesthetic style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

def kendall_tau(x, y):
    """
    Computes Kendall's Tau (b) correlation coefficient between two lists of numbers.
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
    Computes Mean Absolute Error (MAE) between predicted (x) and ground truth (y).
    """
    if not x:
        return 0.0
    return sum(abs(a - d) for a, d in zip(x, y)) / len(x)

def load_scores_from_csv(csv_path):
    """
    Reads skor_ai and skor_dosen dynamically from a CSV file.
    Supports flexible column names.
    """
    if not csv_path or not os.path.exists(csv_path):
        raise FileNotFoundError(f"File CSV tidak ditemukan di: {csv_path}")

    x_ai = []
    y_dosen = []

    with open(csv_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise ValueError(f"File CSV kosong atau format header tidak valid: {csv_path}")

        ai_col = None
        dosen_col = None

        # Detect headers dynamically
        for h in reader.fieldnames:
            h_clean = h.strip().lower()
            if h_clean in ["skor_ai", "ai_score", "skor ai", "ai", "score_ai"]:
                ai_col = h
            elif h_clean in ["skor_dosen", "dosen_score", "skor dosen", "dosen", "ground_truth", "score_dosen"]:
                dosen_col = h

        # Fallback partial matching
        if not ai_col or not dosen_col:
            for h in reader.fieldnames:
                h_clean = h.strip().lower()
                if "ai" in h_clean and not ai_col:
                    ai_col = h
                elif ("dosen" in h_clean or "ground" in h_clean) and not dosen_col:
                    dosen_col = h

        if not ai_col or not dosen_col:
            raise ValueError(
                f"Tidak dapat menemukan kolom AI dan Dosen di CSV: {csv_path}.\n"
                f"Header yang tersedia: {reader.fieldnames}"
            )

        for row in reader:
            try:
                val_ai = float(row[ai_col])
                val_dosen = float(row[dosen_col])
                x_ai.append(val_ai)
                y_dosen.append(val_dosen)
            except (ValueError, TypeError):
                continue

    if not x_ai:
        raise ValueError(f"Tidak ada baris data angka valid yang berhasil dibaca dari: {csv_path}")

    return x_ai, y_dosen

def try_colab_file_upload():
    """
    Triggers Google Colab file upload prompt if running inside Colab.
    Returns (csv1_path, csv2_path) or (None, None).
    """
    try:
        from google.colab import files
        print("\n=========================================================")
        print("  [GOOGLE COLAB DETECTED] INTERACTIVE FILE UPLOAD")
        print("=========================================================")
        
        print("\n1. Silakan upload file CSV Iterasi 1 (Binary / Baseline)...")
        uploaded_1 = files.upload()
        if not uploaded_1:
            print("Peringatan: File Iterasi 1 tidak diupload.")
            return None, None
        file_1 = list(uploaded_1.keys())[0]

        print("\n2. Silakan upload file CSV Iterasi 2 (3-Point Partial Credit / Final)...")
        uploaded_2 = files.upload()
        if not uploaded_2:
            print("Peringatan: File Iterasi 2 tidak diupload.")
            return file_1, None
        file_2 = list(uploaded_2.keys())[0]

        return file_1, file_2
    except Exception:
        return None, None

def generate_iteration_chart(csv_iter1_path=None, csv_iter2_path=None, output_img_path="grafik_iterasi_prototype.png"):
    """
    Calculates metrics dynamically from 2 CSV files (Iteration 1 & Iteration 2)
    or falls back to reference values if CSV files are not provided or invalid.
    """
    tau_1, mae_1, n_1 = None, None, 33
    tau_2, mae_2, n_2 = None, None, 33

    # Try loading Iteration 1
    if csv_iter1_path and os.path.exists(csv_iter1_path):
        try:
            print(f"--> Membaca data Iterasi 1 dari: {csv_iter1_path}")
            x_ai_1, y_dosen_1 = load_scores_from_csv(csv_iter1_path)
            tau_1 = kendall_tau(x_ai_1, y_dosen_1)
            mae_1 = mean_absolute_error(x_ai_1, y_dosen_1)
            n_1 = len(x_ai_1)
        except Exception as e:
            print(f"[INFO] Gagal membaca CSV Iterasi 1 ({e}). Menggunakan data acuan baseline.")

    # Try loading Iteration 2
    if csv_iter2_path and os.path.exists(csv_iter2_path):
        try:
            print(f"--> Membaca data Iterasi 2 dari: {csv_iter2_path}")
            x_ai_2, y_dosen_2 = load_scores_from_csv(csv_iter2_path)
            tau_2 = kendall_tau(x_ai_2, y_dosen_2)
            mae_2 = mean_absolute_error(x_ai_2, y_dosen_2)
            n_2 = len(x_ai_2)
        except Exception as e:
            print(f"[INFO] Gagal membaca CSV Iterasi 2 ({e}). Menggunakan data acuan final.")

    # Fallback to thesis reference values if missing
    if tau_1 is None or mae_1 is None:
        tau_1 = 0.4400
        mae_1 = 18.33
        print("--> Menggunakan data acuan Iterasi 1 (Tau = 0.4400, MAE = 18.33 Poin)")

    if tau_2 is None or mae_2 is None:
        tau_2 = 0.7724
        mae_2 = 5.45
        print("--> Menggunakan data acuan Iterasi 2 (Tau = 0.7724, MAE = 5.45 Poin)")

    print("\n=========================================================")
    print("      HASIL ANALISIS EVALUASI PERBANDINGAN ITERASI")
    print("=========================================================")
    print(f"Iterasi 1 (Baseline): N={n_1} | Kendall's Tau (tau) = {tau_1:.4f} | MAE = {mae_1:.2f} poin")
    print(f"Iterasi 2 (Final)   : N={n_2} | Kendall's Tau (tau) = {tau_2:.4f} | MAE = {mae_2:.2f} poin")
    
    tau_diff_pct = ((tau_2 - tau_1) / tau_1) * 100 if tau_1 != 0 else 0
    mae_diff_pct = ((mae_2 - mae_1) / mae_1) * 100 if mae_1 != 0 else 0
    print(f"Perubahan Tau : {tau_diff_pct:+.1f}%")
    print(f"Perubahan MAE : {mae_diff_pct:+.1f}%")
    print("=========================================================\n")

    iterations = ['Iterasi 1\n(Binary Scoring)', 'Iterasi 2\n(3-Point Partial Credit)']
    kendall_tau_vals = [tau_1, tau_2]
    mae_vals = [mae_1, mae_2]

    colors_tau = ['#94a3b8', '#4f46e5'] # Slate for Iteration 1, Indigo for Iteration 2 (Final)
    colors_mae = ['#ef4444', '#10b981'] # Red for Iteration 1, Emerald for Iteration 2 (Final)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2), dpi=300)

    # Chart 1: Kendall Tau Progress
    bars1 = ax1.bar(iterations, kendall_tau_vals, color=colors_tau, width=0.45, edgecolor='black', linewidth=0.8)
    ax1.set_title("Keselarasan Peringkat (Kendall's Tau τ)", fontsize=11, fontweight='bold', pad=12)
    ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=9, fontweight='bold')
    max_tau_y = max(1.0, max(kendall_tau_vals) * 1.15)
    ax1.set_ylim(0, max_tau_y)

    for bar in bars1:
        yval = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

    # Chart 2: MAE Error Reduction Progress
    bars2 = ax2.bar(iterations, mae_vals, color=colors_mae, width=0.45, edgecolor='black', linewidth=0.8)
    ax2.set_title("Rata-Rata Kesalahan Skor (MAE Poin)", fontsize=11, fontweight='bold', pad=12)
    ax2.set_ylabel("Error Poin (MAE)", fontsize=9, fontweight='bold')
    max_mae_y = max(10.0, max(mae_vals) * 1.2)
    ax2.set_ylim(0, max_mae_y)

    for bar in bars2:
        yval = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2.0, yval + (max_mae_y * 0.02), f"{yval:.2f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

    plt.suptitle("Perbandingan Hasil Iterasi Perbaikan Prototype SAL", fontsize=13, fontweight='bold', y=1.02)
    plt.tight_layout()

    # Save output image
    plt.savefig(output_img_path, bbox_inches='tight')
    print(f"--> Grafik visualisasi berhasil disimpan di: {output_img_path}")

    # Also copy to docs directory if it exists
    docs_img_path = os.path.join(os.path.dirname(__file__), "../docs/grafik_iterasi_prototype.png")
    if os.path.exists(os.path.dirname(docs_img_path)):
        try:
            plt.savefig(docs_img_path, bbox_inches='tight')
            print(f"--> Copy grafik berhasil disimpan di: {docs_img_path}")
        except Exception:
            pass

    # Display plot in Google Colab / Jupyter notebook cell
    try:
        if 'google.colab' in sys.modules or 'ipykernel' in sys.modules or os.environ.get('COLAB_GPU'):
            plt.show()
        else:
            plt.close()
    except Exception:
        plt.close()

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.abspath(os.path.join(script_dir, ".."))

    csv_1 = None
    csv_2 = None
    output_img = "grafik_iterasi_prototype.png"

    # 1. Command Line Arguments
    if len(sys.argv) >= 3:
        csv_1 = sys.argv[1]
        csv_2 = sys.argv[2]
        if len(sys.argv) >= 4:
            output_img = sys.argv[3]
    
    # 2. Check local workspace files
    if not csv_1 or not csv_2 or not os.path.exists(str(csv_1)) or not os.path.exists(str(csv_2)):
        default_csv1 = os.path.join(project_dir, "docs", "IF23A_cleaned_binary.csv")
        default_csv2 = os.path.join(project_dir, "docs", "IF23A_cleaned_trinary.csv")

        if os.path.exists(default_csv1) and os.path.exists(default_csv2):
            csv_1 = default_csv1
            csv_2 = default_csv2

    # 3. Google Colab Interactive Upload
    if not csv_1 or not csv_2 or not os.path.exists(str(csv_1)) or not os.path.exists(str(csv_2)):
        colab_1, colab_2 = try_colab_file_upload()
        if colab_1 and colab_2:
            csv_1 = colab_1
            csv_2 = colab_2

    print("=== SCRIPT GENERATE GRAFIK ITERASI PROTOTYPE DINAMIS ===")
    print(f"File Iterasi 1 : {csv_1 if csv_1 else '(Menggunakan Nilai Acuan Baseline)'}")
    print(f"File Iterasi 2 : {csv_2 if csv_2 else '(Menggunakan Nilai Acuan Final)'}")
    print("---------------------------------------------------------")

    generate_iteration_chart(csv_1, csv_2, output_img)

if __name__ == "__main__":
    main()
