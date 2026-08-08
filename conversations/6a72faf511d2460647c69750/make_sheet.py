from PIL import Image, ImageDraw, ImageFont
import glob, os, subprocess

# Generate 24px and 120px PNGs for each SVG candidate
svg_files = sorted(glob.glob("c*.svg"))

# Create HTML grid preview to convert or PIL image composer
canvas_w = 800
canvas_h = len(svg_files) * 90 + 40
sheet = Image.new("RGBA", (canvas_w, canvas_h), (255, 255, 255, 255))
draw = ImageDraw.Draw(sheet)

y_offset = 20

for svg_file in svg_files:
    name = os.path.splitext(svg_file)[0]
    
    # Render at 120x120
    subprocess.run(["ffmpeg", "-y", "-i", svg_file, "-s", "120x120", "-frames:v", "1", "-update", "1", f"{name}_120.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Render at 24x24
    subprocess.run(["ffmpeg", "-y", "-i", svg_file, "-s", "24x24", "-frames:v", "1", "-update", "1", f"{name}_24.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Render at 14x14
    subprocess.run(["ffmpeg", "-y", "-i", svg_file, "-s", "14x14", "-frames:v", "1", "-update", "1", f"{name}_14.png"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    img120 = Image.open(f"{name}_120.png").convert("RGBA")
    img24 = Image.open(f"{name}_24.png").convert("RGBA")
    img14 = Image.open(f"{name}_14.png").convert("RGBA")

    # Paste on white background
    sheet.paste(img120, (30, y_offset), img120)
    sheet.paste(img24, (180, y_offset + 48), img24)
    sheet.paste(img14, (230, y_offset + 53), img14)

    draw.text((280, y_offset + 50), f"{name}", fill=(40, 40, 40))
    y_offset += 90

sheet.save("candidates_sheet.png")
print("Saved candidates_sheet.png")

