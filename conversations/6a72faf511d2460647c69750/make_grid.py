from PIL import Image, ImageDraw, ImageFont
import glob, os

canvas_w = 900
canvas_h = 600
sheet = Image.new("RGBA", (canvas_w, canvas_h), (250, 250, 252, 255))
draw = ImageDraw.Draw(sheet)

# Header
draw.text((30, 20), "Bloomwire PetalIcon Redesign Candidates Comparison", fill=(20, 20, 30))
draw.text((30, 40), "Left: 120px | Middle: 24px | Right: 14px", fill=(100, 100, 120))

names = ["style1_rosebud", "style2_lotus", "style3_5petal", "style4_twin_petals", "style5_petal_pair"]

y = 80
for name in names:
    img120 = Image.open(f"{name}_120.png").convert("RGBA")
    img24 = Image.open(f"{name}_24.png").convert("RGBA")
    img14 = Image.open(f"{name}_14.png").convert("RGBA")

    # Draw border box
    draw.rectangle([20, y, 880, y + 90], outline=(220, 220, 230), width=1)

    sheet.paste(img120, (30, y + 5), img120)
    sheet.paste(img24, (180, y + 33), img24)
    sheet.paste(img14, (240, y + 38), img14)

    draw.text((290, y + 35), name.upper(), fill=(30, 30, 50))
    y += 100

sheet.save("comparison_grid.png")
print("Saved comparison_grid.png")

