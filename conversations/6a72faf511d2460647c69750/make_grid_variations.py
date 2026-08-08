from PIL import Image, ImageDraw

canvas_w = 900
canvas_h = 600
sheet = Image.new("RGBA", (canvas_w, canvas_h), (250, 250, 252, 255))
draw = ImageDraw.Draw(sheet)

draw.text((30, 20), "Bloomwire PetalIcon Redesign - Detailed Variations", fill=(20, 20, 30))
draw.text((30, 40), "120px | 24px | 14px", fill=(100, 100, 120))

names = ["vA_rosebud_perfect", "vB_rosebud_sepals", "vC_5petal_crest", "vD_luxury_single_petal", "vE_tulip_bud"]

y = 80
for name in names:
    img120 = Image.open(f"{name}_120.png").convert("RGBA")
    img24 = Image.open(f"{name}_24.png").convert("RGBA")
    img14 = Image.open(f"{name}_14.png").convert("RGBA")

    draw.rectangle([20, y, 880, y + 90], outline=(220, 220, 230), width=1)

    sheet.paste(img120, (30, y + 5), img120)
    sheet.paste(img24, (180, y + 33), img24)
    sheet.paste(img14, (240, y + 38), img14)

    draw.text((290, y + 35), name.upper(), fill=(30, 30, 50))
    y += 100

sheet.save("variations_sheet.png")
print("Saved variations_sheet.png")

