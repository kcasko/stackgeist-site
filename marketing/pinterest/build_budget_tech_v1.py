from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(r"E:\Repos\stackgeist\stackgeist-site")
SRC = ROOT / "marketing" / "pinterest" / "budget-sources"
OUT = ROOT / "public" / "pinterest" / "budget-tech-v1"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1000, 1500
WHITE = (248, 246, 251)
VIOLET = (155, 92, 255)
MUTED = (220, 214, 228)
HEAD_FONT = r"C:\Windows\Fonts\arialbd.ttf"
SUB_FONT = r"C:\Windows\Fonts\arial.ttf"

# One pin per category, plus a second creative angle for each of the four categories = 8 pins.
PINS = [
    ("bt01", "under25.png",   "TECH UPGRADES",     "UNDER $25",           "Small fixes that stop wasting your time.",              .5, .5),
    ("bt02", "under25.png",   "THE $10 CABLE",     "THAT ACTUALLY WORKS", "Full-speed USB-C without the guesswork.",               .55, .48),
    ("bt03", "under75.png",   "TECH UPGRADES",     "UNDER $75",           "Where value peaks. Gear you don't replace twice.",       .5, .5),
    ("bt04", "under75.png",   "ONE CHARGER",       "FOR EVERY DEVICE",    "GaN charging stations that replace the pile.",           .5, .55),
    ("bt05", "essentials.png","EVERYDAY",          "DESK ESSENTIALS",     "Things you replace anyway. Buy the right ones.",         .5, .5),
    ("bt06", "essentials.png","CHEAP UPGRADES",    "WITH REAL IMPACT",    "Lighting, stands, cables, cloths — under $25 each.",     .5, .55),
    ("bt07", "worthit.png",   "WORTH",             "PAYING MORE FOR",     "Gear that replaced other gear and earned its spot.",     .5, .5),
    ("bt08", "worthit.png",   "PREMIUM TECH",      "THAT LASTS",          "Headphones, storage, laptop gear — worth the price.",    .55, .5),
]

def cover_crop(img, fw, fh, fx=.5, fy=.5):
    scale = max(fw / img.width, fh / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, min(int((nw - fw) * fx), nw - fw))
    top = max(0, min(int((nh - fh) * fy), nh - fh))
    return img.crop((left, top, left + fw, top + fh))

def fit_font(text, max_width, start=92, minimum=48):
    for size in range(start, minimum - 1, -2):
        font = ImageFont.truetype(HEAD_FONT, size)
        if font.getbbox(text)[2] <= max_width:
            return font
    return ImageFont.truetype(HEAD_FONT, minimum)

def draw_pin(slug, photo, line1, line2, subhead, fx, fy):
    img = Image.open(SRC / photo).convert("RGB")
    img = ImageEnhance.Brightness(img).enhance(1.02)
    img = ImageEnhance.Contrast(img).enhance(1.06)
    canvas = cover_crop(img, W, H, fx, fy).convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, 560):
        alpha = int(232 * (1 - y / 560) ** 1.4)
        od.line((0, y, W, y), fill=(0, 0, 0, alpha))
    od.rectangle((0, 1375, W, H), fill=(8, 7, 12, 244))
    canvas = Image.alpha_composite(canvas, overlay)
    d = ImageDraw.Draw(canvas)

    f1 = fit_font(line1, 890, 82)
    f2 = fit_font(line2, 890, 94)
    d.text((54, 70), line1, font=f1, fill=WHITE)
    y2 = 70 + (f1.getbbox(line1)[3] - f1.getbbox(line1)[1]) + 20
    d.text((54, y2), line2, font=f2, fill=VIOLET)
    sub_font = ImageFont.truetype(SUB_FONT, 32)
    while sub_font.getbbox(subhead)[2] > 900:
        sub_font = ImageFont.truetype(SUB_FONT, sub_font.size - 1)
    sy = y2 + (f2.getbbox(line2)[3] - f2.getbbox(line2)[1]) + 34
    sw = sub_font.getbbox(subhead)[2]
    d.rounded_rectangle((46, sy - 14, min(954, 80 + sw), sy + 54), radius=8, fill=(8, 7, 12, 218))
    d.text((62, sy), subhead, font=sub_font, fill=MUTED)

    d.rectangle((52, 1424, 76, 1448), fill=VIOLET)
    brand = ImageFont.truetype(HEAD_FONT, 31)
    d.text((92, 1410), "STACKGEIST.DEV", font=brand, fill=WHITE)
    d.text((948, 1410), "BUDGET TECH", font=ImageFont.truetype(HEAD_FONT, 23), fill=VIOLET, anchor="ra")

    out = OUT / f"{slug}.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(out.name, out.stat().st_size)

for pin in PINS:
    draw_pin(*pin)
