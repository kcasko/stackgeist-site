from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(r"E:\Repos\stackgeist\stackgeist-site")
SRC = ROOT / "marketing" / "pinterest" / "real-sources"
OUT = ROOT / "public" / "pinterest" / "comparison-v1"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1000, 1500
WHITE = (248, 246, 251)
VIOLET = (168, 85, 247)
MUTED = (221, 214, 229)
HEAD_FONT = r"C:\Windows\Fonts\arialbd.ttf"
SUB_FONT = r"C:\Windows\Fonts\arial.ttf"

# Generic licensed setup imagery illustrates the decision category only.
# It does not depict or imply ownership of either compared product.
PINS = [
    ("c01", "p03.jpg", "CHEAP HUB OR", "ANKER 553?", "Choose by displays, ports, and Ethernet.", .50, .52),
    ("c02", "p08.jpg", "BAD WI-FI?", "CHECK THIS FIRST", "Built-in Wi-Fi vs an external adapter.", .50, .50),
    ("c03", "p09.jpg", "DESK LAMP OR", "SCREENBAR?", "Task light without buying the wrong format.", .50, .58),
    ("c04", "p07.jpg", "ONE CHARGER OR", "A WHOLE STATION?", "Choose by device count, not wattage hype.", .54, .52),
    ("c05", "p04.jpg", "240W USB-C VS", "A CHEAP CABLE", "When the higher rating changes anything.", .50, .52),
    ("c06", "p01.jpg", "BRIEFCASE OR", "SLIM SLEEVE?", "Choose protection by what you carry.", .52, .54),
    ("c07", "p05.jpg", "SATA CABLE OR", "DRIVE DOCK?", "The $10 fix vs the repeat-use tool.", .50, .54),
    ("c08", "p02.jpg", "128GB X2 OR", "ONE 512GB CARD?", "Choose by device count and capacity.", .50, .50),
    ("c09", "p06.jpg", "PREMIUM ANC OR", "BUDGET ANC?", "Where the headphone upgrade goes.", .50, .54),
    ("c10", "p10.jpg", "HARD DRIVE OR", "PORTABLE SSD?", "Bulk capacity vs speed and durability.", .50, .54),
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
    img = ImageEnhance.Brightness(img).enhance(.9)
    img = ImageEnhance.Contrast(img).enhance(1.08)
    canvas = cover_crop(img, W, H, fx, fy).convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, 620):
        alpha = int(238 * (1 - y / 620) ** 1.25)
        od.line((0, y, W, y), fill=(0, 0, 0, alpha))
    od.rectangle((0, 1375, W, H), fill=(8, 7, 12, 246))
    canvas = Image.alpha_composite(canvas, overlay)
    d = ImageDraw.Draw(canvas)
    f1, f2 = fit_font(line1, 890, 80), fit_font(line2, 890, 94)
    d.text((54, 70), line1, font=f1, fill=WHITE)
    y2 = 70 + (f1.getbbox(line1)[3] - f1.getbbox(line1)[1]) + 20
    d.text((54, y2), line2, font=f2, fill=VIOLET)
    sub_font = ImageFont.truetype(SUB_FONT, 31)
    while sub_font.getbbox(subhead)[2] > 875:
        sub_font = ImageFont.truetype(SUB_FONT, sub_font.size - 1)
    sy = y2 + (f2.getbbox(line2)[3] - f2.getbbox(line2)[1]) + 34
    sw = sub_font.getbbox(subhead)[2]
    d.rounded_rectangle((46, sy - 14, min(954, 80 + sw), sy + 54), radius=8, fill=(8, 7, 12, 220))
    d.text((62, sy), subhead, font=sub_font, fill=MUTED)
    d.rectangle((52, 1424, 76, 1448), fill=VIOLET)
    d.text((92, 1410), "STACKGEIST.DEV", font=ImageFont.truetype(HEAD_FONT, 31), fill=WHITE)
    d.text((948, 1410), "COMPARE SMARTER", font=ImageFont.truetype(HEAD_FONT, 23), fill=VIOLET, anchor="ra")
    out = OUT / f"{slug}.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    print(out, out.stat().st_size)

for pin in PINS:
    draw_pin(*pin)
