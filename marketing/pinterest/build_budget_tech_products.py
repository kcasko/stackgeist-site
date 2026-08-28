"""Generate 30 per-product Pinterest pins for stackgeist.dev budget-tech section."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFont
import json, re, urllib.request, io, csv

ROOT = Path(r"E:\Repos\stackgeist\stackgeist-site")
JSON = Path(r"C:\Users\keith\affiliate_products_enriched.json")
OUT = ROOT / "public" / "pinterest" / "budget-tech-products"
CSV_PATH = ROOT / "marketing" / "pinterest" / "pinterest-budget-tech-products.csv"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1000, 1500
WHITE = (248, 246, 251); VIOLET = (155, 92, 255); MUTED = (220, 214, 228)
HEAD_FONT = r"C:\Windows\Fonts\arialbd.ttf"
SUB_FONT = r"C:\Windows\Fonts\arial.ttf"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"}
BOARDS = ["Desk Setup Guides", "Budget Desk Setups", "Gaming Setup Ideas"]

def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:60]

def split_headline(name):
    """Split product name into a short 2-line headline (line1 white, line2 violet)."""
    words = name.upper().replace('"', '').replace("(", "").replace(")", "").split()
    if len(words) <= 2:
        return words[0], " ".join(words[1:]) or "PICK"
    # Split roughly in half by word count
    mid = max(1, len(words) // 2)
    line1 = " ".join(words[:mid])
    line2 = " ".join(words[mid:])
    # Trim long lines to avoid tiny font
    if len(line1) > 22: line1 = line1[:22].rsplit(" ", 1)[0]
    if len(line2) > 22: line2 = line2[:22].rsplit(" ", 1)[0]
    return line1, line2

def sentence_sub(desc, cap=60):
    sent = re.split(r"(?<=[.!?])\s+", desc.strip())[0] if desc else ""
    if len(sent) > cap:
        sent = sent[:cap].rsplit(" ", 1)[0] + "..."
    return sent

def cover_crop(img, fw, fh, fx=.5, fy=.5):
    scale = max(fw / img.width, fh / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = max(0, min(int((nw - fw) * fx), nw - fw))
    top = max(0, min(int((nh - fh) * fy), nh - fh))
    return img.crop((left, top, left + fw, top + fh))

def fit_font(text, max_width, start=82, minimum=44):
    for size in range(start, minimum - 1, -2):
        f = ImageFont.truetype(HEAD_FONT, size)
        if f.getbbox(text)[2] <= max_width:
            return f
    return ImageFont.truetype(HEAD_FONT, minimum)

def download(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()

def draw_pin(slug, image_bytes, name, subhead):
    line1, line2 = split_headline(name)
    try:
        src = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        print(f"[skip {slug}] image decode failed: {e}")
        return False

    # Enhance and fit
    src = ImageEnhance.Brightness(src).enhance(1.02)
    src = ImageEnhance.Contrast(src).enhance(1.06)
    canvas = cover_crop(src, W, H).convert("RGBA")

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
    while subhead and sub_font.getbbox(subhead)[2] > 900:
        sub_font = ImageFont.truetype(SUB_FONT, sub_font.size - 1)
    sy = y2 + (f2.getbbox(line2)[3] - f2.getbbox(line2)[1]) + 34
    if subhead:
        sw = sub_font.getbbox(subhead)[2]
        d.rounded_rectangle((46, sy - 14, min(954, 80 + sw), sy + 54), radius=8, fill=(8, 7, 12, 218))
        d.text((62, sy), subhead, font=sub_font, fill=MUTED)

    d.rectangle((52, 1424, 76, 1448), fill=VIOLET)
    brand = ImageFont.truetype(HEAD_FONT, 31)
    d.text((92, 1410), "STACKGEIST.DEV", font=brand, fill=WHITE)
    d.text((948, 1410), "BUDGET TECH", font=ImageFont.truetype(HEAD_FONT, 23), fill=VIOLET, anchor="ra")

    out = OUT / f"{slug}.png"
    canvas.convert("RGB").save(out, "PNG", optimize=True)
    return True

def main():
    products = json.loads(JSON.read_text(encoding="utf-8"))
    rows = [["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"]]
    made = 0
    for i, p in enumerate(products):
        if not p.get("image_url"):
            print(f"[skip] {p['name']} no image")
            continue
        slug = slugify(p["name"])
        try:
            img_bytes = download(p["image_url"])
        except Exception as e:
            print(f"[skip {slug}] download failed: {e}")
            continue
        sub = sentence_sub(p.get("description", ""))
        if not draw_pin(slug, img_bytes, p["name"], sub):
            continue
        board = BOARDS[i % len(BOARDS)]
        title = p["name"]
        desc = p["description"][:480]
        media_url = f"https://stackgeist.dev/pinterest/budget-tech-products/{slug}.png"
        link = f"https://stackgeist.dev/gear/budget-tech/{slug}/?utm_source=pinterest&utm_medium=organic&utm_campaign=products_v1&utm_content={slug}"
        keywords = f"{p.get('category','budget tech')}, tech accessories, desk setup, budget tech, {p['name'].split()[0].lower()}"
        rows.append([title, media_url, board, "", desc, link, "", keywords])
        made += 1
        print(f"[ok] {slug}")

    CSV_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        csv.writer(f).writerows(rows)
    print(f"\nGenerated {made} pins")
    print(f"CSV: {CSV_PATH}")

if __name__ == "__main__":
    main()
