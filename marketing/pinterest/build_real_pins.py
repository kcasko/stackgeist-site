from PIL import Image, ImageDraw, ImageFont, ImageEnhance
from pathlib import Path

ROOT = Path(r"E:\Repos\stackgeist\stackgeist-site")
SRC = ROOT / "marketing" / "pinterest" / "real-sources"
OUT = ROOT / "public" / "pinterest" / "real-launch"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1000, 1500
WHITE = (248, 246, 251)
VIOLET = (155, 92, 255)
MUTED = (220, 214, 228)
BLACK = (8, 7, 12)

HEAD_FONT = r"C:\Windows\Fonts\arialbd.ttf"
SUB_FONT = r"C:\Windows\Fonts\arial.ttf"
BRAND_FONT = r"C:\Windows\Fonts\arialbd.ttf"

PINS = [
    ("p01", "SMALL BEDROOM", "GAMING SETUP", "Make the room work before you add more gear.", .52, .58, 1.05),
    ("p02", "5 RULES FOR A", "SMALL GAMING ROOM", "Fewer collisions. Better setup.", .70, .48, 1.14),
    ("p03", "BETTER GAMING DESK", "ON A BUDGET", "Spend on problems, not decoration.", .52, .50, 1.07),
    ("p04", "WHAT TO", "UPGRADE FIRST", "A smarter order for a budget setup.", .50, .52, 1.07),
    ("p05", "CABLE MANAGEMENT", "THAT LASTS", "Route for maintenance, not just appearance.", .50, .54, 1.14),
    ("p06", "BEFORE YOU BUY", "CABLE ORGANIZERS", "Fix the route first.", .50, .52, 1.10),
    ("p07", "CHEAP DESK", "UPGRADES THAT MATTER", "Fix friction before buying more gear.", .50, .52, 1.08),
    ("p08", "5 LOW-COST", "DESK UPGRADES", "Small changes. Better setup.", .60, .52, 1.12),
    ("p09", "DARK GAMING", "SETUP", "Atmosphere without the RGB carnival.", .50, .58, 1.14),
    ("p10", "GAMING + WORK", "ONE DESK", "Dark, useful, low-clutter.", .56, .52, 1.10),
]

def cover_crop(img, fw, fh, fx=.5, fy=.5):
    scale = max(fw / img.width, fh / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = int((nw - fw) * max(0, min(1, fx)))
    top = int((nh - fh) * max(0, min(1, fy)))
    left = max(0, min(left, nw - fw))
    top = max(0, min(top, nh - fh))
    return img.crop((left, top, left + fw, top + fh))

def fit_font(text, max_width, start=86, minimum=50):
    for size in range(start, minimum - 1, -2):
        font = ImageFont.truetype(HEAD_FONT, size)
        box = font.getbbox(text)
        if box[2] - box[0] <= max_width:
            return font
    return ImageFont.truetype(HEAD_FONT, minimum)
def add_gradients(base):
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for y in range(0, 460):
        a = int(225 * (1 - y / 460) ** 1.5)
        od.line((0, y, W, y), fill=(0, 0, 0, a))
    for y in range(1240, H):
        a = int(210 * ((y - 1240) / 260) ** .7)
        od.line((0, y, W, y), fill=(0, 0, 0, a))
    return Image.alpha_composite(base.convert("RGBA"), overlay)

def draw_pin(src_path, out_path, idx, line1, line2, subhead, fx, fy, brightness):
    img = Image.open(src_path).convert("RGB")
    img = ImageEnhance.Brightness(img).enhance(brightness)
    img = ImageEnhance.Contrast(img).enhance(1.04)
    img = cover_crop(img, W, H, fx, fy)
    canvas = add_gradients(img)
    d = ImageDraw.Draw(canvas)

    d.rounded_rectangle((36, 34, 112, 104), radius=8, fill=VIOLET + (255,))
    num_font = ImageFont.truetype(BRAND_FONT, 34)
    d.text((74, 69), f"{idx:02}", font=num_font, fill=WHITE, anchor="mm")

    f1 = fit_font(line1, 900, 84)
    f2 = fit_font(line2, 900, 92)
    y1 = 142
    d.text((56, y1), line1, font=f1, fill=WHITE)
    y2 = y1 + (f1.getbbox(line1)[3] - f1.getbbox(line1)[1]) + 16
    d.text((56, y2), line2, font=f2, fill=VIOLET)
    sub_font = ImageFont.truetype(SUB_FONT, 34)
    sub_y = y2 + (f2.getbbox(line2)[3] - f2.getbbox(line2)[1]) + 32
    sub_box = d.textbbox((0, 0), subhead, font=sub_font)
    sw = sub_box[2] - sub_box[0]
    sh = sub_box[3] - sub_box[1]
    d.rounded_rectangle((48, sub_y - 14, min(952, 76 + sw), sub_y + sh + 20), radius=8, fill=(8, 7, 12, 218))
    d.text((62, sub_y), subhead, font=sub_font, fill=MUTED)

    d.rectangle((0, 1392, W, H), fill=(8, 7, 12, 242))
    d.rectangle((52, 1432, 76, 1456), fill=VIOLET + (255,))
    brand_font = ImageFont.truetype(BRAND_FONT, 31)
    d.text((92, 1419), "STACK", font=brand_font, fill=WHITE)
    stack_w = d.textbbox((92, 1419), "STACK", font=brand_font)[2] - 92
    d.text((92 + stack_w, 1419), "GEIST", font=brand_font, fill=VIOLET)
    geist_w = d.textbbox((92 + stack_w, 1419), "GEIST", font=brand_font)[2] - (92 + stack_w)
    d.text((92 + stack_w + geist_w, 1419), ".DEV", font=brand_font, fill=WHITE)

    canvas.convert("RGB").save(out_path, "PNG", optimize=True)

for i, pin in enumerate(PINS, 1):
    slug, l1, l2, sub, fx, fy, bright = pin
    draw_pin(SRC / f"p{i:02}.jpg", OUT / f"{slug}.png", i, l1, l2, sub, fx, fy, bright)
    print(slug, (OUT / f"{slug}.png").stat().st_size)
