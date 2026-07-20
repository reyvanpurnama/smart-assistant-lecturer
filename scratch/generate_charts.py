import matplotlib.pyplot as plt
import numpy as np

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

strategies = ['Relaxed', 'Binary', 'Strict', 'Trinary\n(Skripsi)']
kendall_tau = [0.4132, 0.4400, 0.4925, 0.7724]
mae_values = [11.69, 18.33, 9.66, 5.45]

colors_tau = ['#94a3b8', '#94a3b8', '#64748b', '#4f46e5']
colors_mae = ['#94a3b8', '#ef4444', '#64748b', '#10b981']

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5), dpi=300)

# Chart 1: Kendall Tau
bars1 = ax1.bar(strategies, kendall_tau, color=colors_tau, width=0.55, edgecolor='black', linewidth=0.8)
ax1.set_title("Korelasi Kendall's Tau (τ) [Lebih Tinggi Lebih Baik]", fontsize=12, fontweight='bold', pad=15)
ax1.set_ylabel("Nilai Kendall's Tau (τ)", fontsize=10, fontweight='bold')
ax1.set_ylim(0, 1.0)

for bar in bars1:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

# Chart 2: MAE
bars2 = ax2.bar(strategies, mae_values, color=colors_mae, width=0.55, edgecolor='black', linewidth=0.8)
ax2.set_title("Mean Absolute Error (MAE) [Lebih Kecil Lebih Baik]", fontsize=12, fontweight='bold', pad=15)
ax2.set_ylabel("Error Poin (MAE)", fontsize=10, fontweight='bold')
ax2.set_ylim(0, 22.0)

for bar in bars2:
    yval = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.4, f"{yval:.2f}", ha='center', va='bottom', fontsize=10, fontweight='bold')

plt.suptitle("Perbandingan Performansi 4 Strategi Evaluasi Asisten Dosen AI", fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()

chart_path = "/home/alexa/Documents/SKRIPSI/project/sal/docs/grafik_kendall_mae.png"
plt.savefig(chart_path, bbox_inches='tight')
print(f"Grafik berhasil disimpan ke {chart_path}")
