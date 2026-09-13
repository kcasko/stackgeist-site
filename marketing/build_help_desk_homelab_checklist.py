"""Generate the Help Desk Homelab Starter Checklist PDF lead magnet.

Referenced by the help-desk-homelab-starter-kit page at
/downloads/help-desk-homelab-starter-checklist.pdf (see src/data/incomeKits.ts).
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer

OUT = Path(__file__).resolve().parents[1] / "public" / "downloads" / "help-desk-homelab-starter-checklist.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

VIOLET = colors.HexColor("#9b5cff")
PHOSPHOR = colors.HexColor("#4d8b1a")  # darker phosphor for print legibility
DARK = colors.HexColor("#08070c")
MUTED = colors.HexColor("#5b5765")

styles = getSampleStyleSheet()
title = ParagraphStyle('t', parent=styles['Title'], textColor=DARK, fontSize=26, spaceAfter=6, leading=30)
kicker = ParagraphStyle('k', parent=styles['Normal'], textColor=VIOLET, fontSize=10, spaceAfter=4, fontName='Helvetica-Bold', leading=12)
sub = ParagraphStyle('s', parent=styles['Normal'], textColor=MUTED, fontSize=12, spaceAfter=14, leading=16)
h2 = ParagraphStyle('h2', parent=styles['Heading2'], textColor=DARK, fontSize=15, spaceBefore=14, spaceAfter=6, leading=19)
step = ParagraphStyle('st', parent=styles['Normal'], textColor=DARK, fontSize=11, spaceAfter=6, leading=15, leftIndent=18, bulletIndent=0)
body = ParagraphStyle('b', parent=styles['Normal'], textColor=DARK, fontSize=11, spaceAfter=8, leading=15)
note = ParagraphStyle('n', parent=styles['Normal'], textColor=MUTED, fontSize=10, spaceAfter=8, leading=14, leftIndent=18)
foot = ParagraphStyle('f', parent=styles['Normal'], textColor=MUTED, fontSize=9, alignment=1)

# Ordered so cheap-and-important comes first, always-on gear last.
STAGES = [
    (
        "01. Use the computer you already own until it blocks the lab",
        [
            "Confirm the existing laptop or desktop can boot to BIOS/UEFI and install updates.",
            "Enable virtualization (Intel VT-x / AMD-V) in firmware for later Docker / VM work.",
            "Free 40 GB of disk and confirm it can run one small VM before buying anything.",
        ],
        "Buying hardware before you've used what you own is how homelabs turn into shelves of dust.",
    ),
    (
        "02. Add storage and adapters that make recovery practice safe",
        [
            "One external drive (WD Elements 2TB+) reserved for lab backups and recovery drills.",
            "SATA-to-USB adapter cable to read old drives and practice pulling files off dead machines.",
            "Two USB flash drives (32 GB+) for bootable installers (Ventoy on one, imaging tool on the other).",
        ],
        "One external drive is not a backup plan on its own — it's the first copy. Add a second target before you rely on it.",
    ),
    (
        "03. Wire the network before buying more compute",
        [
            "TP-Link 8-port unmanaged gigabit switch under the desk.",
            "Two short (0.5-1m) Cat6 patch cables for the switch <-> router run and the primary lab host.",
            "Label both ends of every cable. Sharpie on a strip of masking tape is enough.",
        ],
        "Wi-Fi will make you doubt everything else. Wire the lab so failures point at the lab, not the router.",
    ),
    (
        "04. Add a mini PC only when you need a dedicated always-on host",
        [
            "N100 or Ryzen mini PC with 16 GB RAM and a 512 GB NVMe.",
            "Install Proxmox, Debian, or Ubuntu Server — pick one and stick with it for 30 days.",
            "Set up SSH key auth and disable password login on day one.",
        ],
        "Buy for idle wattage and quiet fans before benchmark scores. Homelab machines run 24/7.",
    ),
    (
        "05. Add a UPS when storage, DNS, or self-hosted services matter",
        [
            "CyberPower CP1500PFCLCD (or equivalent pure sine-wave 1500VA).",
            "Plug in: mini PC, switch, external drive dock. Nothing else.",
            "Install NUT or the vendor daemon and test one automatic shutdown before you need it.",
        ],
        "A UPS is insurance, not a battery bank. If you don't have anything worth protecting yet, skip it.",
    ),
]

SKILL_DRILLS = [
    "Image a laptop drive to the external drive, wipe the laptop, and restore. Time it.",
    "Break DNS on a VM (bad /etc/resolv.conf), then diagnose with dig, nslookup, and ping in that order.",
    "Set a static IP on the mini PC, confirm it survives a reboot, then document your subnet on paper.",
    "Snapshot a VM, break something on purpose (delete /etc/nginx), restore from snapshot.",
    "Write a one-page ticket for a fake user issue you just caused. Include repro steps and resolution.",
]

DO_NOT_BUY_YET = [
    "A rack. Racks come after you have three things worth racking.",
    "A managed switch. Unmanaged is enough until you actually need VLANs.",
    "A NAS appliance. Learn on a mini PC + external drive first.",
    "10GbE anything. Your gigabit uplink is fine for a starter lab.",
    "RGB fans. They are not the reason the lab isn't working.",
]


def build():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title="Help Desk Homelab Starter Checklist",
        author="StackGeist",
    )
    story = []
    story.append(Paragraph("STACKGEIST", kicker))
    story.append(Paragraph("Help Desk Homelab Starter Checklist", title))
    story.append(Paragraph(
        "Build a lab that teaches support skills instead of collecting noisy hardware trophies. "
        "Work top to bottom. Do not buy stage N+1 until stage N boots and stays up for a week.",
        sub,
    ))
    story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceBefore=0, spaceAfter=12))

    for heading, items, tip in STAGES:
        story.append(Paragraph(heading, h2))
        for item in items:
            story.append(Paragraph(f"[ ] &nbsp;{item}", step))
        story.append(Paragraph(f"<i>{tip}</i>", note))
        story.append(Spacer(1, 4))

    story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceBefore=8, spaceAfter=10))
    story.append(Paragraph("Skill drills once the base lab is up", h2))
    for drill in SKILL_DRILLS:
        story.append(Paragraph(f"[ ] &nbsp;{drill}", step))

    story.append(HRFlowable(width="100%", thickness=1, color=VIOLET, spaceBefore=8, spaceAfter=10))
    story.append(Paragraph("Do not buy these yet", h2))
    for item in DO_NOT_BUY_YET:
        story.append(Paragraph(f"\u2013 &nbsp;{item}", step))

    story.append(Spacer(1, 14))
    story.append(HRFlowable(width="100%", thickness=0.5, color=MUTED, spaceBefore=0, spaceAfter=6))
    story.append(Paragraph(
        "StackGeist \u2022 stackgeist.dev/kits/help-desk-homelab-starter-kit \u2022 "
        "As an Amazon Associate we earn from qualifying purchases.",
        foot,
    ))

    doc.build(story)
    print(f"Wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    build()
