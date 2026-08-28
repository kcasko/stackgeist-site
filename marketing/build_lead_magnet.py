"""Generate the Budget Tech cheat-sheet PDF lead magnet for stackgeist.dev."""
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable
from pathlib import Path

OUT = Path(r"E:\Repos\stackgeist\stackgeist-site\public\downloads\budget-tech-cheat-sheet.pdf")
OUT.parent.mkdir(parents=True, exist_ok=True)

VIOLET = colors.HexColor("#9b5cff")
DARK = colors.HexColor("#08070c")
MUTED = colors.HexColor("#5b5765")

styles = getSampleStyleSheet()
title = ParagraphStyle('t', parent=styles['Title'], textColor=DARK, fontSize=28, spaceAfter=6, leading=32)
kicker = ParagraphStyle('k', parent=styles['Normal'], textColor=VIOLET, fontSize=10, spaceAfter=4, fontName='Helvetica-Bold', leading=12)
sub = ParagraphStyle('s', parent=styles['Normal'], textColor=MUTED, fontSize=12, spaceAfter=18, leading=16)
h2 = ParagraphStyle('h2', parent=styles['Heading2'], textColor=DARK, fontSize=16, spaceBefore=14, spaceAfter=4, leading=20)
body = ParagraphStyle('b', parent=styles['Normal'], textColor=DARK, fontSize=11, spaceAfter=8, leading=15)
foot = ParagraphStyle('f', parent=styles['Normal'], textColor=MUTED, fontSize=9, alignment=1)

FIXES = [
    ("USB-C cable that actually charges fast", "A 240W INIU USB-C cable delivers full-speed charging on phones and laptops. Cheap cables lie about wattage; this one does not.", "$10"),
    ("Precision screwdriver kit (140-in-1)", "Strips one screw on a laptop, phone, or controller and you've paid for the kit. Keep one in the drawer.", "$18"),
    ("Flat-plug surge protector with USB", "Eight outlets spaced for bulky bricks, USB ports built in, a flat plug that hides behind furniture.", "$22"),
    ("9-in-1 USB-C hub", "HDMI, USB, SD, and pass-through charge from one port. Modern laptops removed ports; this puts them back.", "$20"),
    ("SATA-to-USB adapter cable", "Pull a drive out of a dead laptop, plug it into any USB port, read the files. No enclosure needed.", "$10"),
    ("Microfiber cleaning cloths (18-pack)", "Screens, glasses, camera lenses. Paper towels scratch. These do not. Buy the pack, not one.", "$8"),
    ("Adjustable phone stand", "Stops the daily reach-for-the-propped-up-phone. Under $10, replaces a dozen bad habits.", "$9"),
    ("USB to 3.5mm audio adapter", "When the jack dies or the port never existed. Cheap fix for laptops, consoles, docks.", "$8"),
    ("USB-C to USB-A adapter (2-pack)", "Every old flash drive, mouse, keyboard still uses USB-A. Two adapters solves it forever.", "$8"),
    ("Clamp-on LED desk lamp", "Puts light exactly where you need it without eating desk space. Adjustable warmth for eye comfort.", "$22"),
    ("SanDisk Ultra 128GB microSD (2-pack)", "Reliable storage that works in phones, cameras, Switches. Two cards is more useful than one big one.", "$18"),
    ("Logitech C920x HD webcam", "Built-in laptop webcams look bad. This just works, in Zoom, Teams, OBS, without drivers.", "$60"),
]

def build():
    doc = SimpleDocTemplate(str(OUT), pagesize=letter, leftMargin=0.75*inch, rightMargin=0.75*inch, topMargin=0.75*inch, bottomMargin=0.75*inch, title="Budget Tech Cheat Sheet")
    story = []
    story.append(Paragraph("STACKGEIST", kicker))
    story.append(Paragraph("The 12 Budget Tech Fixes", title))
    story.append(Paragraph("That actually stop wasting your time. Each one under $75. None of them AI-slop affiliate garbage.", sub))
    story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceBefore=0, spaceAfter=14))

    for i, (name, why, price) in enumerate(FIXES, 1):
        story.append(Paragraph(f"{i:02}. {name} &nbsp;&nbsp; <font color='#9b5cff'>{price}</font>", h2))
        story.append(Paragraph(why, body))

    story.append(Spacer(1, 18))
    story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceBefore=8, spaceAfter=12))
    story.append(Paragraph("See every product with real ASIN, Amazon link, and honest tradeoff notes at <b>stackgeist.dev/gear/budget-tech</b>", body))
    story.append(Spacer(1, 24))
    story.append(Paragraph("StackGeist \u2022 stackgeist.dev \u2022 As an Amazon Associate I earn from qualifying purchases.", foot))

    doc.build(story)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")

if __name__ == "__main__":
    build()
