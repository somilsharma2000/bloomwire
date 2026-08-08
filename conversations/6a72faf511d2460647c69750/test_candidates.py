import subprocess
import os

svg_templates = {
    # Candidate 1: Layered Rose/Lotus Blossom (3 overlapping petals + inner fold + base stem)
    "c1_layered_bloom": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Central main petal -->
  <path d="M12 2.5C9 7 8.5 12 12 21.5C15.5 12 15 7 12 2.5Z" />
  <!-- Left overlapping petal -->
  <path d="M12 21.5C7.5 19 3 14 3 9.5C3 5.5 6.5 4 9.5 6" />
  <!-- Right overlapping petal -->
  <path d="M12 21.5C16.5 19 21 14 21 9.5C21 5.5 17.5 4 14.5 6" />
  <!-- Center detail vein -->
  <path d="M12 21.5V10" />
</svg>
""",

    # Candidate 2: Refined 5-Petal Crown/Flower Head (Overlapping elegant curved petals around a delicate center ring)
    "c2_5petal_flower": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3" />
  <path d="M12 9C10.5 5 8 3 12 2C16 3 13.5 5 12 9Z" />
  <path d="M14.85 11.08C18.66 9.58 20.66 7.08 21.61 11.08C20.61 15.08 18.61 12.58 14.85 11.08Z" />
  <path d="M13.76 13.76C16.26 17.26 17.26 20.26 13.26 21.21C9.26 20.21 11.26 17.26 13.76 13.76Z" />
  <path d="M10.24 13.76C7.74 17.26 5.74 20.21 1.74 16.21C2.69 12.21 5.74 14.26 10.24 13.76Z" />
  <path d="M9.15 11.08C5.34 9.58 2.34 7.08 3.29 3.08C7.29 4.03 5.34 7.58 9.15 11.08Z" />
</svg>
""",

    # Candidate 3: Elegant Double-Layer Petal (A grand sweeping main petal with overlapping secondary petal and delicate internal curve)
    "c3_double_petal": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Outer Main Petal -->
  <path d="M12 21.5C5 21.5 2.5 15.5 3 10C3.5 4.5 10 2 12 2C14 2 20.5 4.5 21 10C21.5 15.5 19 21.5 12 21.5Z" />
  <!-- Inner Layered Petal Contour -->
  <path d="M12 21.5C8 18 6 13.5 7 9.5C8 5.5 12 5 12 5C12 5 16 5.5 17 9.5C18 13.5 16 18 12 21.5Z" />
  <!-- Subtle Center Stem/Vein -->
  <path d="M12 21.5V11" />
</svg>
""",

    # Candidate 4: Luxury Lotus / Rose Bud Blossom (3 layered overlapping curved petals with organic sweep)
    "c4_lotus_bud": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Central teardrop petal -->
  <path d="M12 3C9 7.5 9 13.5 12 21C15 13.5 15 7.5 12 3Z" />
  <!-- Left wing petal -->
  <path d="M12 21C7 18.5 3 13.5 3 9C3 5.5 6.5 4.5 9 6.5C10.5 7.7 11.5 9.5 12 11.5" />
  <!-- Right wing petal -->
  <path d="M12 21C17 18.5 21 13.5 21 9C21 5.5 17.5 4.5 15 6.5C13.5 7.7 12.5 9.5 12 11.5" />
</svg>
""",

    # Candidate 5: High-End Stylized 5-Petal Bloom (Symmetrical geometric 5 curved petals with central core)
    "c5_5petal_bloom": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="2.5" />
  <!-- 5 petals with smooth bezier curves radiating from center -->
  <path d="M12 9.5C12 6.5 9.5 3 12 2C14.5 3 12 6.5 12 9.5Z" />
  <path d="M14.38 11.23C17.23 10.3 20.88 10 21.51 12.38C20.88 14.76 17.23 13.7 14.38 12.77" />
  <path d="M13.47 13.53C15.23 15.96 17.06 19.34 15.11 20.76C13.16 22.18 12.47 18.3 12.71 15.35" />
  <path d="M10.53 13.53C8.77 15.96 6.94 19.34 8.89 20.76C10.84 22.18 11.53 18.3 11.29 15.35" />
  <path d="M9.62 11.23C6.77 10.3 3.12 10 2.49 12.38C3.12 14.76 6.77 13.7 9.62 12.77" />
</svg>
"""
}

for name, content in svg_templates.items():
    with open(f"{name}.svg", "w") as f:
        f.write(content.strip())
    subprocess.run(["ffmpeg", "-y", "-i", f"{name}.svg", "-frames:v", "1", "-update", "1", f"{name}.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Generated {name}.png")

