import subprocess
import os

variations = {
    # Variation A: Perfect Symmetric Blooming Rosebud (3 layered petals + vein)
    "vA_rosebud_perfect": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Central teardrop petal -->
  <path d="M12 2.5C8.8 7 8.5 12.5 12 21.5C15.5 12.5 15.2 7 12 2.5Z" />
  <!-- Left wrapping petal -->
  <path d="M12 21.5C7.5 19 3.5 14.5 3.5 10C3.5 6.5 6.5 5 9 6.2C10.5 7 11.5 8.5 12 10.5" />
  <!-- Right wrapping petal -->
  <path d="M12 21.5C16.5 19 20.5 14.5 20.5 10C20.5 6.5 17.5 5 15 6.2C13.5 7 12.5 8.5 12 10.5" />
  <!-- Center vein line -->
  <path d="M12 21.5V13" />
</svg>
""",

    # Variation B: Blooming Rosebud with soft curved base stem / sepals
    "vB_rosebud_sepals": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Central teardrop petal -->
  <path d="M12 2.5C8.8 7 8.5 12 12 20C15.5 12 15.2 7 12 2.5Z" />
  <!-- Left wrapping petal -->
  <path d="M12 20C7.5 18 3.5 13.5 3.5 9.5C3.5 6 6.5 4.8 9 6C10.5 6.8 11.5 8.3 12 10.2" />
  <!-- Right wrapping petal -->
  <path d="M12 20C16.5 18 20.5 13.5 20.5 9.5C20.5 6 17.5 4.8 15 6C13.5 6.8 12.5 8.3 12 10.2" />
  <!-- Curved Base Sepals -->
  <path d="M8 21.5C10 22.5 14 22.5 16 21.5" />
  <!-- Stem line -->
  <path d="M12 20V12" />
</svg>
""",

    # Variation C: 5-Petal Cherry Blossom / Rose Crest (5 curved petals wrapping around a delicate center ring)
    "vC_5petal_crest": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="2.5" />
  <!-- Top Petal -->
  <path d="M12 9.5C10.5 6.5 9.5 3.5 12 2C14.5 3.5 13.5 6.5 12 9.5Z" />
  <!-- Right Top Petal -->
  <path d="M14.38 11.23C17.3 9.8 20.5 9.2 21.5 11.5C20.8 13.8 17.5 13.2 14.38 12.77" />
  <!-- Right Bottom Petal -->
  <path d="M13.47 13.53C15.5 15.8 17.5 19 15.5 20.5C13.2 21.5 12.8 18 12.71 15.35" />
  <!-- Left Bottom Petal -->
  <path d="M10.53 13.53C8.5 15.8 6.5 19 8.5 20.5C10.8 21.5 11.2 18 11.29 15.35" />
  <!-- Left Top Petal -->
  <path d="M9.62 11.23C6.7 9.8 3.5 9.2 2.5 11.5C3.2 13.8 6.5 13.2 9.62 12.77" />
</svg>
""",

    # Variation D: Ultra-Sleek Luxury Single Petal with Contour Fold and Delicate Veins
    "vD_luxury_single_petal": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Outer Petal Boundary -->
  <path d="M12 21.5C6.5 21.5 3.5 16.5 3.5 11C3.5 5.5 8.5 2.5 12 2.5C15.5 2.5 20.5 5.5 20.5 11C20.5 16.5 17.5 21.5 12 21.5Z" />
  <!-- Inner Fold Line giving depth -->
  <path d="M12 21.5C9.5 17.5 8.5 12.5 10 8C11 5 12 4 12 4C12 4 13 5 14 8C15.5 12.5 14.5 17.5 12 21.5Z" />
  <!-- Delicate Vein Lines -->
  <path d="M12 21.5V11" />
  <path d="M12 16C10 14.5 8.5 13.5 7.5 13" />
  <path d="M12 16C14 14.5 15.5 13.5 16.5 13" />
</svg>
""",

    # Variation E: Overlapping Tulip Blossom (2 overlapping curved petals with inner bud)
    "vE_tulip_bud": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Left Petal Curve -->
  <path d="M12 21.5C6.5 19 3 13.5 3 8.5C3 4.5 6.5 2.5 10 4.5C11.5 5.5 12 7.5 12 10.5" />
  <!-- Right Petal Curve -->
  <path d="M12 21.5C17.5 19 21 13.5 21 8.5C21 4.5 17.5 2.5 14 4.5C12.5 5.5 12 7.5 12 10.5" />
  <!-- Center Petal Peak -->
  <path d="M12 2.5C10.5 5.5 10.5 8 12 10.5C13.5 8 13.5 5.5 12 2.5Z" />
  <!-- Base Stem -->
  <path d="M12 21.5V13" />
</svg>
"""
}

for name, content in variations.items():
    with open(f"{name}.svg", "w") as f:
        f.write(content.strip())
    subprocess.run(["ffmpeg", "-y", "-i", f"{name}.svg", "-s", "120x120", "-frames:v", "1", "-update", "1", f"{name}_120.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-i", f"{name}.svg", "-s", "24x24", "-frames:v", "1", "-update", "1", f"{name}_24.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-i", f"{name}.svg", "-s", "14x14", "-frames:v", "1", "-update", "1", f"{name}_14.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Rendered {name}")

