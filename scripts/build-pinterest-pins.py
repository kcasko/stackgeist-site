"""Generate 10 Pinterest pin images (1000x1500) for the launch-batch campaign.

Reads marketing/pinterest/launch-batch.csv and marketing/pinterest/real-sources/pNN.jpg,
overlays the StackGeist kicker + headline + subhead in the terminal/operator aesthetic,
and writes marketing/pinterest/pins/pNN.jpg for upload.

Idempotent. Skips a pin if the source photo is missing (prints a warning).
Deterministic file names so re-running overwrites in place.
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "marketing" / "pinterest" / "launch-batch.csv"
SOURCE_DIR = ROOT / "marketing" / "pinterest" / "real-sources"
OUT_DIR = ROOT / "marketing" / "pinterest" / "pins"

PIN_W, PIN_H = 1000, 1500

# StackGeist palette (matches the terminal/operator aesthetic).
VIOLET = (155, 92, 255)
PHOSPHOR = (163, 230, 53)
NEAR_BLACK = (8, 7, 12)
WHITE = (245, 244, 250)
DIM = (170, 165, 185)

FONT_CANDIDATES = [
    "C:/Windows/Fonts/impact.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/arial.ttf",
]
MONO_CANDIDATES = [
    "C:/Windows/Fonts/consolab.ttf",
    "C:/Windows/Fonts/consola.ttf",
    "C:/Windows/Fonts/cour.ttf",
]


def load_font(candidates, size):
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def wrap(draw, text, font, max_width):
    words = text.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def cover_resize(img, target_w, target_h):
    src_w, src_h = img.size
    scale = max(target_w / src_w, target_h / src_h)
    new_w, new_h = int(src_w * scale), int(src_h * scale)
    resized = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def build_pin(source_path: Path, kicker: str, headline: str, subhead: str, out_path: Path) -> None:
    photo = Image.open(source_path).convert("RGB")
    photo = cover_resize(photo, PIN_W, PIN_H)

    # Slight darken + subtle blur at the bottom third to seat the text block.
    canvas = photo.copy()
    overlay = Image.new("RGBA", (PIN_W, PIN_H), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    # Full-image dim so type is always readable regardless of source photo.
    ov_draw.rectangle([0, 0, PIN_W, PIN_H], fill=(8, 7, 12, 90))
    # Heavier gradient at the bottom (the text zone).
    gradient_top = int(PIN_H * 0.45)
    for i, y in enumerate(range(gradient_top, PIN_H)):
        alpha = int(210 * (i / (PIN_H - gradient_top)))
        ov_draw.line([(0, y), (PIN_W, y)], fill=(8, 7, 12, alpha))
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")

    draw = ImageDraw.Draw(canvas)

    # Top brand bar.
    bar_h = 78
    draw.rectangle([0, 0, PIN_W, bar_h], fill=NEAR_BLACK)
    mono_bold = load_font(MONO_CANDIDATES, 26)
    draw.text((44, 24), "STACKGEIST", font=mono_bold, fill=PHOSPHOR)
    draw.text(
        (PIN_W - 44 - draw.textlength("stackgeist.dev", font=mono_bold), 24),
        "stackgeist.dev",
        font=mono_bold,
        fill=DIM,
    )
    draw.rectangle([0, bar_h, PIN_W, bar_h + 3], fill=VIOLET)

    # Text block (bottom third).
    padding = 60
    max_text_w = PIN_W - (padding * 2)

    mono = load_font(MONO_CANDIDATES, 26)
    kicker_text = f"// {kicker.lower()}"
    draw.text((padding, PIN_H - 520), kicker_text, font=mono, fill=PHOSPHOR)

    # Headline: wrapped, large, bold.
    headline_font = load_font(FONT_CANDIDATES, 78)
    headline_lines = wrap(draw, headline, headline_font, max_text_w)
    while len(headline_lines) > 4 and headline_font.size > 48:
        headline_font = ImageFont.truetype(headline_font.path, headline_font.size - 4)
        headline_lines = wrap(draw, headline, headline_font, max_text_w)
    line_h = int(headline_font.size * 1.08)
    y = PIN_H - 470
    for line in headline_lines:
        draw.text((padding, y), line, font=headline_font, fill=WHITE)
        y += line_h

    # Subhead: smaller, dimmer, wrapped.
    sub_font = load_font(FONT_CANDIDATES, 34)
    sub_lines = wrap(draw, subhead, sub_font, max_text_w)
    y += 18
    for line in sub_lines:
        draw.text((padding, y), line, font=sub_font, fill=DIM)
        y += int(sub_font.size * 1.22)

    # Bottom accent + CTA.
    draw.rectangle([0, PIN_H - 90, PIN_W, PIN_H - 87], fill=VIOLET)
    cta_font = load_font(MONO_CANDIDATES, 24)
    cta = "read the full kit \u2192 stackgeist.dev"
    draw.text((padding, PIN_H - 62), cta, font=cta_font, fill=PHOSPHOR)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path, "JPEG", quality=88, optimize=True, progressive=True)


def load_rows():
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        return list(reader)


def main() -> int:
    if not CSV_PATH.exists():
        print(f"missing csv: {CSV_PATH}", file=sys.stderr)
        return 1
    rows = load_rows()
    if not rows:
        print("no rows in launch-batch.csv", file=sys.stderr)
        return 1

    made, skipped = 0, 0
    for row in rows:
        pin_id = (row.get("pin_id") or "").strip()
        if not pin_id:
            continue
        source = SOURCE_DIR / f"{pin_id.lower()}.jpg"
        if not source.exists():
            print(f"skip {pin_id}: missing source {source.name}", file=sys.stderr)
            skipped += 1
            continue
        out = OUT_DIR / f"{pin_id.lower()}.jpg"
        board = (row.get("board") or "").strip()
        headline = (row.get("overlay_headline") or row.get("title") or "").strip()
        subhead = (row.get("overlay_subhead") or "").strip()
        build_pin(source, board or "stackgeist", headline, subhead, out)
        made += 1
        print(f"wrote {out.relative_to(ROOT)} ({out.stat().st_size} bytes)")

    print(f"done. built={made} skipped={skipped}")
    return 0 if made > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
