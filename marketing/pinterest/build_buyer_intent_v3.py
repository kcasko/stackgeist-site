from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(r"E:\Repos\stackgeist\stackgeist-site")
SRC = ROOT / "marketing" / "pinterest" / "real-sources"
OUT = ROOT / "public" / "pinterest" / "buyer-intent-v3"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1000, 1500
WHITE = (248, 246, 251)
VIOLET = (155, 92, 255)
MUTED = (220, 214, 228)
DARK = (8, 7, 12)
HEAD_FONT = r"C:\Windows\Fonts\arialbd.ttf"
SUB_FONT = r"C:\Windows\Fonts\arial.ttf"

# Generic licensed setup photos are intentionally used: none of these pins
# claims that the pictured hardware is the named product.
PINS = [
    ("b01", "p04.jpg", "DUAL MONITOR ARM", "CHECK THESE 3 SPECS", "Weight · VESA · desk thickness", .50, .52),
    ("b02", "p03.jpg", "NEED MORE", "DESK SPACE?", "A monitor arm may help — if it fits.", .50, .48),
    ("b03", "p07.jpg", "ONE CHARGER FOR", "THE WHOLE DESK", "Who the Anker 525 fits — and who should skip it.", .54, .52),
    ("b04", "p09.jpg", "TASK LIGHT OR", "AMBIENT GLOW?", "Choose the lighting job before the product.", .50, .58),
    ("b05", "p01.jpg", "BEFORE YOU BUY", "AN XXL DESK MAT", "Measure usable depth, not total desk depth.", .52, .54),
    ("b06", "p05.jpg", "CLEAN CABLES", "THAT STAY CLEAN", "Build a route you can maintain.", .50, .54),
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
    img = ImageEnhance.Brightness(img).enhance(1.05)
    img = ImageEnhance.Contrast(img).enhance(1.06)
    canvas = cover_crop(img, W, H, fx, fy).convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, 550):
        alpha = int(230 * (1 - y / 550) ** 1.4)
        od.line((0, y, W, y), fill=(0, 0, 0, alpha))
    od.rectangle((0, 1375, W, H), fill=(8, 7, 12, 244))
    canvas = Image.alpha_composite(canvas, overlay)
    d = ImageDraw.Draw(canvas)

    f1, f2 = fit_font(line1, 890, 82), fit_font(line2, 890, 94)
    d.text((54, 70), line1, font=f1, fill=WHITE)
    y2 = 70 + (f1.getbbox(line1)[3] - f1.getbbox(line1)[1]) + 20
    d.text((54, y2), line2, font=f2, fill=VIOLET)
    sub_font = ImageFont.truetype(SUB_FONT, 32)
    max_sub = 900
    while sub_font.getbbox(subhead)[2] > max_sub:
        sub_font = ImageFont.truetype(SUB_FONT, sub_font.size - 1)
    sy = y2 + (f2.getbbox(line2)[3] - f2.getbbox(line2)[1]) + 34
    sw = sub_font.getbbox(subhead)[2]
    d.rounded_rectangle((46, sy - 14, min(954, 80 + sw), sy + 54), radius=8, fill=(8, 7, 12, 218))
    d.text((62, sy), subhead, font=sub_font, fill=MUTED)

    d.rectangle((52, 1424, 76, 1448), fill=VIOLET)
    brand = ImageFont.truetype(HEAD_FONT, 31)
    d.text((92, 1410), "STACKGEIST.DEV", font=brand, fill=WHITE)
    d.text((948, 1410), "BUY SMARTER", font=ImageFont.truetype(HEAD_FONT, 23), fill=VIOLET, anchor="ra")

    out = OUT / f"{slug}.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(out, out.stat().st_size)

for pin in PINS:
    draw_pin(*pin)
