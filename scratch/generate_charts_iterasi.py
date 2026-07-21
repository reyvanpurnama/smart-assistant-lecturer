import matplotlib.pyplot as plt

# Styling formal akademik
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')

iterations = ['Iterasi 1\n(Binary Rubric)', 'Iterasi 2\n(3-Point Partial Credit)']
kendall_tau = [0.4400, 0.7724]
mae_values = [18.33, 5.45]

colors_tau = ['#94a3b8', '#3b82f6'] # Slate & Standard Blue
colors_mae = ['#64748b', '#10b981'] # Slate & Emerald Green

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 4), dpi=300)

# Chart 1: Kendall's Tau (τ)
bars1 = ax1.bar(iterations, kendall_tau, color=colors_tau, width=0.45, edgecolor='black', linewidth=0.8)
ax1.set_title("Kendall's Tau (τ)", fontsize=11, fontweight='bold', pad=10)
ax1.set_ylabel("Nilai Koefisien (τ)", fontsize=9)
ax1.set_ylim(0, 1.0)

for bar in bars1:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 0.02, f"{yval:.4f}", ha='center', va='bottom', fontsize=9.5, fontweight='bold')

# Chart 2: MAE (Poin)
bars2 = ax2.bar(iterations, mae_values, color=colors_mae, width=0.45, edgecolor='black', linewidth=0.8)
ax2.set_title("Mean Absolute Error (MAE)", fontsize=11, fontweight='bold', pad=10)
ax2.set_ylabel("Deviasi Skor (Poin)", fontsize=9)
ax2.set_ylim(0, 22.0)

for bar in bars2:
    yval = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2.0, yval + 0.4, f"{yval:.2f}", ha='center', va='bottom', fontsize=9.5, fontweight='bold')

plt.suptitle("Hasil Evaluasi Statistik Perbandingan Iterasi Prototype", fontsize=12, fontweight='bold', y=1.02)
plt.tight_layout()

chart_path = "/home/alexa/Documents/SKRIPSI/project/sal/docs/grafik_iterasi_prototype.png"
plt.savefig(chart_path, bbox_inches='tight')
print(f"Grafik Iterasi berhasil diperbarui: {chart_path}")
