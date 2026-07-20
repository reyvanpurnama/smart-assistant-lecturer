import csv
import math

# We can use scipy if available, or write standard scipy call
try:
    from scipy import stats
    import numpy as np
    HAS_SCIPY = True
except ImportError:
    HAS_SCIPY = False

def run_normality_test():
    csv_path = "/home/alexa/Documents/SKRIPSI/project/sal/docs/IF23A_cleaned_trinary.csv"
    
    ai_scores = []
    dosen_scores = []
    
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if "skor_ai" in row and "skor_dosen" in row:
                ai_scores.append(float(row["skor_ai"]))
                dosen_scores.append(float(row["skor_dosen"]))
                
    n = len(ai_scores)
    print(f"Data Mahasiswa N = {n}\n")
    
    if HAS_SCIPY:
        print("=== 1. SHAPIRO-WILK NORMALITY TEST (Utama untuk N = 33) ===")
        sw_ai = stats.shapiro(ai_scores)
        sw_dosen = stats.shapiro(dosen_scores)
        print(f"Skor AI    : W = {sw_ai.statistic:.4f}, p-value = {sw_ai.pvalue:.4e} -> {'Normal' if sw_ai.pvalue > 0.05 else 'Tidak Normal (p <= 0.05)'}")
        print(f"Skor Dosen : W = {sw_dosen.statistic:.4f}, p-value = {sw_dosen.pvalue:.4e} -> {'Normal' if sw_dosen.pvalue > 0.05 else 'Tidak Normal (p <= 0.05)'}")
        
        print("\n=== 2. KOLMOGOROV-SMIRNOV TEST ===")
        # Standardize for KS test
        ai_std = (np.array(ai_scores) - np.mean(ai_scores)) / np.std(ai_scores, ddof=1)
        dosen_std = (np.array(dosen_scores) - np.mean(dosen_scores)) / np.std(dosen_scores, ddof=1)
        
        ks_ai = stats.kstest(ai_std, 'norm')
        ks_dosen = stats.kstest(dosen_std, 'norm')
        print(f"Skor AI    : D = {ks_ai.statistic:.4f}, p-value = {ks_ai.pvalue:.4e}")
        print(f"Skor Dosen : D = {ks_dosen.statistic:.4f}, p-value = {ks_dosen.pvalue:.4e}")
        
        print("\n=== 3. SKEWNESS & KURTOSIS ===")
        print(f"Skor AI    : Skewness = {stats.skew(ai_scores):.4f}, Kurtosis = {stats.kurtosis(ai_scores):.4f}")
        print(f"Skor Dosen : Skewness = {stats.skew(dosen_scores):.4f}, Kurtosis = {stats.kurtosis(dosen_scores):.4f}")
        
        print("\n=== 4. DESKRIPTIF STATISTIK ===")
        print(f"Skor AI    : Mean = {np.mean(ai_scores):.2f}, Std Dev = {np.std(ai_scores, ddof=1):.2f}, Min = {np.min(ai_scores)}, Max = {np.max(ai_scores)}")
        print(f"Skor Dosen : Mean = {np.mean(dosen_scores):.2f}, Std Dev = {np.std(dosen_scores, ddof=1):.2f}, Min = {np.min(dosen_scores)}, Max = {np.max(dosen_scores)}")
    else:
        print("Scipy tidak terdeteksi. Silakan install scipy untuk analisis lengkap.")

if __name__ == "__main__":
    run_normality_test()
