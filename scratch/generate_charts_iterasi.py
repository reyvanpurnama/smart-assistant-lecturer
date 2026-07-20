import matplotlib.pyplot as plt
import numpy as np

# Set clean aesthetic style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

# Data comparison for Prototyping Iterations
iterations = ['Iterasi 1\n(Prototype Awal - Binary)', 'Iterasi 2\n(Prototype Final - Trinary)']
kendall_tau = [0.4400, 0.7724]
mae_values = [18.33, 5.45]

colors_tau = ['#94a3b8', '#4f46e5'] # Muted slate for Iteration 1, Indigo for Iteration 2 (Final)
colors_mae = ['#ef4444', '#10b981'] # Red for High Error (Iter 1), Green for Low Error (Iter 2)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4.5), dpi=300)

# Chart 1: Kendall Tau Progress
bars1 = ax1.bar(iterations, kendall_tau, color=colors_tau, width=0.45, edgecolor='black', linewidth=0.8)
ax1.set_title("Peningkatan Keselarasan (Kendall's Tau τ)\n[Semakin Tinggi Semakin Baik]", fontsize=11, fontweight='bold', pad=12)
ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=9, fontweight='bold')
ax1.set_ylim(0, 1.0)

for bar in bars1:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

# Add improvement annotation
ax1.annotate('+75.5% Keselarasan', xy=(1, 0.7724), xytext=(0.5, 0.85),
             arrowprops=dict(facecolor='black', shrink=0.08, width=1, headwidth=6),
             fontsize=9, fontweight='bold', ha='center', color='#4f46e5')

# Chart 2: MAE Error Reduction Progress
bars2 = ax2.bar(iterations, mae_values, color=colors_mae, width=0.45, edgecolor='black', linewidth=0.8)
ax2.set_title("Penurunan Tingkat Kesalahan (MAE Poin)\n[Semakin Kecil Semakin Baik]", fontsize=11, fontweight='bold', pad=12)
ax2.set_ylabel("Error Poin (MAE)", fontsize=9, fontweight='bold')
ax2.set_ylim(0, 22.0)

for bar in bars2:
    yval = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.4, f"{yval:.2f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

# Add reduction annotation
ax2.annotate('-70.3% Error Poin', xy=(1, 5.45), xytext=(0.5, 14.0),
             arrowprops=dict(facecolor='black', shrink=0.08, width=1, headwidth=6),
             fontsize=9, fontweight='bold', ha='center', color='#10b981')

plt.suptitle("Hasil Iterasi Perbaikan Prototype Asisten Dosen AI (SAL)", fontsize=13, fontweight='bold', y=1.03)
plt.tight_layout()

chart_path = "/home/alexa/Documents/SKRIPSI/project/sal/docs/grafik_iterasi_prototype.png"
plt.savefig(chart_path, bbox_inches='tight')
print(f"Grafik Iterasi Prototype berhasil disimpan ke {chart_path}")
