import matplotlib.pyplot as plt
import numpy as np

# Set clean aesthetic style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

# Data comparison for Prototyping Iterations (Formal Academic Terms)
iterations = ['Iterasi 1\n(Binary Scoring)', 'Iterasi 2\n(3-Point Partial Credit)']
kendall_tau = [0.4400, 0.7724]
mae_values = [18.33, 5.45]

colors_tau = ['#94a3b8', '#4f46e5'] # Slate for Iteration 1, Indigo for Iteration 2 (Final)
colors_mae = ['#ef4444', '#10b981'] # Red for Iteration 1, Emerald for Iteration 2 (Final)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.2), dpi=300)

# Chart 1: Kendall Tau Progress
bars1 = ax1.bar(iterations, kendall_tau, color=colors_tau, width=0.45, edgecolor='black', linewidth=0.8)
ax1.set_title("Keselarasan Peringkat (Kendall's Tau τ)", fontsize=11, fontweight='bold', pad=12)
ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=9, fontweight='bold')
ax1.set_ylim(0, 1.0)

for bar in bars1:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

# Chart 2: MAE Error Reduction Progress
bars2 = ax2.bar(iterations, mae_values, color=colors_mae, width=0.45, edgecolor='black', linewidth=0.8)
ax2.set_title("Rata-Rata Kesalahan Skor (MAE Poin)", fontsize=11, fontweight='bold', pad=12)
ax2.set_ylabel("Error Poin (MAE)", fontsize=9, fontweight='bold')
ax2.set_ylim(0, 22.0)

for bar in bars2:
    yval = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.4, f"{yval:.2f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

plt.suptitle("Perbandingan Hasil Iterasi Perbaikan Prototype SAL", fontsize=13, fontweight='bold', y=1.02)
plt.tight_layout()

# Save image using relative path (works in Colab and local)
plt.savefig('grafik_iterasi_prototype.png', bbox_inches='tight')

# Display plot inline (ideal for Google Colab)
plt.show()
