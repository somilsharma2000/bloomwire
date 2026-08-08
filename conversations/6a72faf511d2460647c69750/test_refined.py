import subprocess
import os
from PIL import Image

styles = {
    # Style 1: Overlapping Rosebud / Lotus (3 layered petals with center stem)
    "style1_rosebud": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2.5C9 7 8.5 12.5 12 21.5C15.5 12.5 15 7 12 2.5Z" />
  <path d="M12 21.5C7.5 19 3.5 14.5 3.5 10C3.5 6.5 6.5 5 9 6.2C10.5 7 11.5 8.5 12 10.5" />
  <path d="M12 21.5C16.5 19 20.5 14.5 20.5 10C20.5 6.5 17.5 5 15 6.2C13.5 7 12.5 8.5 12 10.5" />
  <path d="M12 21.5V13" />
</svg>
""",

    # Style 2: Elegant Blooming Lotus (Central petal + left & right sweeping petals + soft base arc)
    "style2_lotus": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 3C9.5 7 9 12 12 20C15 12 14.5 7 12 3Z" />
  <path d="M12 20C7 17.5 3 13 3 8.5C3 5 6 4 8.5 5.5C10.2 6.5 11.5 8.5 12 11" />
  <path d="M12 20C17 17.5 21 13 21 8.5C21 5 18 4 15.5 5.5C13.8 6.5 12.5 8.5 12 11" />
  <path d="M8 21C10 22.2 14 22.2 16 21" />
</svg>
""",

    # Style 3: Luxury 5-Petal Blossom (Clean, geometric 5 overlapping petals around center circle)
    "style3_5petal": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="2.5" />
  <path d="M12 9.5C10.5 6.5 9.5 3.5 12 2C14.5 3.5 13.5 6.5 12 9.5Z" />
  <path d="M14.38 11.23C17.3 10.3 20.3 10 21.5 12C20.3 14 17.3 13.7 14.38 12.77" />
  <path d="M13.47 13.53 C15.2 15.8 17 19.2 15.1 20.7 C13.2 22 12.5 18.2 12.7 15.35" />
  <path d="M10.53 13.53 C8.8 15.8 7 19.2 8.9 20.7 C10.8 22 11.5 18.2 11.3 15.35" />
  <path d="M9.62 11.23C6.7 10.3 3.7 10 2.5 12C3.7 14 6.7 13.7 9.62 12.77" />
</svg>
""",

    # Style 4: Overlapping Twin Petals (Two lush, organic curved petals overlapping with vein line)
    "style4_twin_petals": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Main Petal -->
  <path d="M12 21.5C6 21.5 3 16 3.5 10C4 4 11 2 13 2C18 2 20.5 7.5 20 12.5C19.5 17.5 16 21.5 12 21.5Z" />
  <!-- Overlapping Inner Petal fold -->
  <path d="M12 21.5C9.5 18.5 7.5 14 8.5 9.5C9.5 5 13 4 13 4C13 4 16.5 5.5 17 9.5C17.5 13.5 15 18 12 21.5Z" />
  <!-- Center stem vein -->
  <path d="M12 21.5V11" />
</svg>
""",

    # Style 5: Elegant Rose Petal Pair (Two gently curved pipe cleaner flower petals with soft inner fold)
    "style5_petal_pair": """
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <!-- Primary Petal -->
  <path d="M12 21.5C7 21.5 4 17 4 11C4 5 9.5 2.5 12 2.5C14.5 2.5 20 5 20 11C20 17 17 21.5 12 21.5Z" />
  <!-- Inner Petal Contour Line -->
  <path d="M12 21.5C9 17.5 8 12.5 9.5 8C10.5 5 12 4.5 12 4.5C12 4.5 13.5 5 14.5 8C16 12.5 15 17.5 12 21.5Z" />
  <!-- Vein Curve -->
  <path d="M12 21.5C12 18 11.5 14 12 11" />
</svg>
"""
}

for name, content in styles.items():
    with open(f"{name}.svg", "w") as f:
        f.write(content.strip())
    subprocess.run(["ffmpeg", "-y", "-i", f"{name}.svg", "-s", "120x120", "-frames:v", "1", "-update", "1", f"{name}_120.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-i", f"{name}.svg", "-s", "24x24", "-frames:v", "1", "-update", "1", f"{name}_24.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run(["ffmpeg", "-y", "-i", f"{name}.svg", "-s", "14x14", "-frames:v", "1", "-update", "1", f"{name}_14.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Processed {name}")

