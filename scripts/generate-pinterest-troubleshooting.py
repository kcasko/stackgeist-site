#!/usr/bin/env python3
from __future__ import annotations

import csv
import pathlib
import textwrap
from datetime import datetime, timedelta, timezone
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_IMG = ROOT / "public" / "pinterest" / "troubleshooting-guides-v1"
OUT_CSV = ROOT / "marketing" / "pinterest" / "pinterest-troubleshooting-guides-v1.csv"
OUT_PROVENANCE = ROOT / "marketing" / "pinterest" / "pinterest-troubleshooting-guides-v1-provenance.md"
CAMPAIGN = "troubleshooting_guides_v1"
DOMAIN = "https://stackgeist.dev"

W, H = 1000, 1500
BG = (6, 9, 14)
PANEL = (13, 20, 31)
PANEL2 = (18, 28, 43)
GRID = (28, 44, 64)
TEXT = (236, 244, 255)
MUTED = (149, 166, 190)
GREEN = (36, 255, 143)
CYAN = (92, 210, 255)
AMBER = (255, 194, 84)
RED = (255, 97, 112)
PURPLE = (190, 136, 255)

FONT_CANDIDATES = [
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
BOLD_CANDIDATES = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
MONO_CANDIDATES = [
    "C:/Windows/Fonts/consola.ttf",
    "C:/Windows/Fonts/cour.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]

def font(size: int, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    candidates = MONO_CANDIDATES if mono else (BOLD_CANDIDATES if bold else FONT_CANDIDATES)
    for p in candidates:
        if pathlib.Path(p).exists():
            return ImageFont.truetype(p, size=size)
    return ImageFont.load_default()

F_BRAND = font(30, mono=True)
F_KICKER = font(34, bold=True, mono=True)
F_TITLE = font(82, bold=True)
F_TITLE_SMALL = font(72, bold=True)
F_BODY = font(36)
F_BODY_BOLD = font(38, bold=True)
F_MONO = font(29, mono=True)
F_BADGE = font(26, bold=True, mono=True)
F_FOOT = font(28, mono=True)

GUIDES = [
    {
        "slug": "usb-c-dock-only-one-monitor",
        "board": "Desk Setup Guides",
        "category": "USB-C / DOCK",
        "keywords": "usb c dock, docking station, dual monitors, thunderbolt dock, monitor not detected",
        "angles": [
            ("USB-C Dock Only Detecting One Monitor?", "Check cable lanes, DisplayLink limits, MST support, and refresh-rate bandwidth before buying another dock.", "DOCK DIAG"),
            ("Your Dock Probably Is Not Dead", "The common failure path is cable capability, port mode, or monitor bandwidth. Test those first.", "FIX ORDER"),
            ("Dual Monitors Over USB-C: The Real Checklist", "A quick compatibility pass for laptops, docks, hubs, and displays that refuse to cooperate.", "DISPLAY CHECK"),
        ],
    },
    {
        "slug": "usb-c-cable-charging-slow",
        "board": "Cable Management",
        "category": "USB-C / CABLES",
        "keywords": "usb c cable, slow charging, laptop charger, fast charging, cable troubleshooting",
        "angles": [
            ("USB-C Cable Charging Slow?", "Check wattage rating, e-marker support, charger output, and the laptop port before blaming the brick.", "POWER CHECK"),
            ("That USB-C Cable May Be the Bottleneck", "Not every cable carries 100W or 240W. Some are data-first, some are charge-first, some are just chaos in rubber.", "CABLE AUDIT"),
            ("Fast Charger, Slow Laptop? Start Here", "The fix usually lives in the cable, PD profile, port choice, or battery protection mode.", "PD FIX"),
        ],
    },
    {
        "slug": "gan-charger-not-charging-laptop-full-speed",
        "board": "Cable Management",
        "category": "GAN CHARGER",
        "keywords": "gan charger, laptop charger, usb c power delivery, slow laptop charging, anker charger",
        "angles": [
            ("GaN Charger Not Hitting Full Speed?", "Multi-port sharing, cable limits, and USB-C PD profiles can quietly cut your laptop wattage in half.", "WATTAGE CHECK"),
            ("Your 100W Charger Might Not Be Giving 100W", "If another port is plugged in, the power budget may split. Classic tiny-brick treachery.", "PORT SPLIT"),
            ("Laptop Charging Slow on USB-C?", "Use this order: charger rating, cable rating, single-port test, laptop PD limit, battery mode.", "LAPTOP POWER"),
        ],
    },
    {
        "slug": "portable-usb-c-monitor-no-signal",
        "board": "Desk Setup Guides",
        "category": "PORTABLE MONITOR",
        "keywords": "portable monitor, usb c monitor, no signal, displayport alt mode, laptop display",
        "angles": [
            ("Portable Monitor Says No Signal?", "The usual culprits are no DisplayPort Alt Mode, charge-only cables, or not enough power.", "NO SIGNAL"),
            ("USB-C Monitor Blank Screen Checklist", "One cable does not guarantee video. Check Alt Mode, cable type, power draw, and source settings.", "ALT MODE"),
            ("Before You Return That Portable Monitor", "Run the basic cable, port, and power tests. It might be the laptop, not the screen.", "DISPLAY FIX"),
        ],
    },
    {
        "slug": "extension-cord-getting-hot",
        "board": "Cable Management",
        "category": "POWER SAFETY",
        "keywords": "extension cord hot, power safety, home office power, cord overheating, electrical safety",
        "angles": [
            ("Extension Cord Getting Hot? Stop and Check This", "Warm cords can mean overloaded wire gauge, coiled cable heat, loose plugs, or too much continuous load.", "SAFETY CHECK"),
            ("When a Warm Extension Cord Is a Problem", "Know the difference between normal warmth and the kind of heat that says unplug this thing before it auditions for Backdraft.", "HEAT WARNING"),
            ("Home Office Power Check", "Before adding another monitor, charger, or lamp, check the cord rating and load path.", "CORD LOAD"),
        ],
    },
    {
        "slug": "surge-protector-clicking",
        "board": "Cable Management",
        "category": "POWER STRIP",
        "keywords": "surge protector clicking, power strip clicking, home office power, electrical noise, surge protector",
        "angles": [
            ("Surge Protector Clicking?", "It could be relay noise, overload protection, a failing switch, or a device cycling power. Do not ignore repeated clicks.", "CLICK DIAG"),
            ("Power Strip Making Noise?", "Unplug high-draw devices, test another outlet, and stop using it if clicking repeats under load.", "POWER NOISE"),
            ("Desk Power Acting Weird?", "Clicks, heat, buzzing, and random resets are signs to audit the whole chain, not just the strip.", "DESK POWER"),
        ],
    },
    {
        "slug": "alfa-ac1900-slow-speed-fix",
        "board": "Desk Setup Guides",
        "category": "WI-FI ADAPTER",
        "keywords": "alfa ac1900, wifi adapter, slow wifi, rtl8814au, linux wifi",
        "angles": [
            ("Alfa AC1900 Running Slow?", "Driver, USB mode, channel width, signal quality, and power management can all throttle the adapter.", "WI-FI FIX"),
            ("USB Wi-Fi Adapter Speed Checklist", "Before blaming the antenna, check USB 3 mode, driver support, router band, and distance.", "ADAPTER DIAG"),
            ("Linux Wi-Fi Adapter Acting Weak?", "The boring driver and power settings are usually the boss fight. Start there.", "LINUX WIFI"),
        ],
    },
    {
        "slug": "monitor-arm-sagging-fix",
        "board": "Desk Setup Guides",
        "category": "MONITOR ARM",
        "keywords": "monitor arm sagging, desk setup, monitor mount, vesa mount, office setup",
        "angles": [
            ("Monitor Arm Sagging?", "Check weight rating, tension adjustment, clamp grip, VESA fit, and desk thickness before replacing it.", "ARM FIX"),
            ("Your Monitor Mount Needs Tension", "Most sagging arms are not broken. They are under-adjusted, overloaded, or mounted on a weak desk edge.", "TENSION"),
            ("Stop the Monitor Droop", "A quick desk setup checklist for clamp strength, hinge tension, cable pull, and display weight.", "DROOP FIX"),
        ],
    },
    {
        "slug": "logitech-brio-not-detected-windows-11",
        "board": "Desk Setup Guides",
        "category": "WEBCAM",
        "keywords": "logitech brio, webcam not detected, windows 11 webcam, video calls, usb camera",
        "angles": [
            ("Logitech Brio Not Detected on Windows 11?", "Check privacy permissions, USB bandwidth, firmware tools, app conflicts, and Device Manager before swapping webcams.", "WEBCAM FIX"),
            ("Webcam Gone Missing?", "Windows privacy toggles and background apps can make a good camera look dead. Classic Windows goblin behavior.", "CAMERA CHECK"),
            ("Video Call Camera Not Showing?", "Use this order: permissions, cable, port, app lock, firmware, Device Manager cleanup.", "CALL READY"),
        ],
    },
    {
        "slug": "mx-master-3s-scroll-wheel-not-working",
        "board": "Desk Setup Guides",
        "category": "MOUSE",
        "keywords": "mx master 3s, logitech mouse, scroll wheel, productivity mouse, mouse troubleshooting",
        "angles": [
            ("MX Master 3S Scroll Wheel Acting Weird?", "Check MagSpeed mode, Logi Options settings, app profiles, debris, and Bluetooth receiver placement.", "SCROLL FIX"),
            ("That Scroll Wheel May Not Be Broken", "Logitech software profiles can make the wheel feel haunted. Check settings before declaring hardware death.", "MAGSPEED"),
            ("Productivity Mouse Troubleshooting", "For scroll skips, lag, and weird app behavior, test receiver distance, software profiles, and wheel mode first.", "MOUSE DIAG"),
        ],
    },
    {
        "slug": "benq-screenbar-flickering",
        "board": "Desk Setup Guides",
        "category": "DESK LIGHT",
        "keywords": "benq screenbar, monitor light bar, desk lighting, flickering light, usb power",
        "angles": [
            ("BenQ ScreenBar Flickering?", "Weak USB power, hub sharing, loose cables, and auto-dimming can all cause desk light flicker.", "LIGHT FIX"),
            ("Monitor Light Bar Flicker Checklist", "Move it off the overloaded hub, test a wall adapter, and check the sensor path before replacing it.", "USB POWER"),
            ("Desk Light Acting Possessed?", "It is usually power delivery, not ghosts. Though your cable drawer does look cursed.", "FLICKER DIAG"),
        ],
    },
    {
        "slug": "keychron-v6-max-bluetooth-not-connecting",
        "board": "Desk Setup Guides",
        "category": "KEYBOARD",
        "keywords": "keychron v6 max, bluetooth keyboard, mechanical keyboard, keyboard not connecting, 2.4ghz keyboard",
        "angles": [
            ("Keychron V6 Max Bluetooth Not Connecting?", "Check mode switch position, saved pairings, battery level, OS Bluetooth cache, and 2.4GHz receiver placement.", "BT FIX"),
            ("Mechanical Keyboard Pairing Problems?", "Most failures are mode mismatch, old pairings, or receiver distance. Start there before reflashing anything.", "PAIRING"),
            ("Keychron Wireless Checklist", "Bluetooth, 2.4GHz, cable mode, firmware, and OS cache all have their own failure paths.", "KEYBOARD DIAG"),
        ],
    },
    {
        "slug": "sennheiser-momentum-4-wont-pair",
        "board": "Desk Setup Guides",
        "category": "HEADPHONES",
        "keywords": "sennheiser momentum 4, bluetooth headphones, headphones wont pair, wireless audio, headset troubleshooting",
        "angles": [
            ("Momentum 4 Won't Pair?", "Clear stale Bluetooth pairings, force pairing mode, check multipoint, update firmware, and test another device.", "PAIR FIX"),
            ("Bluetooth Headphones Stuck?", "Multipoint connections can hijack pairing like a clingy ex. Clear old devices first.", "BT RESET"),
            ("Wireless Headphone Pairing Checklist", "Use a clean reset path before assuming the headphones or laptop Bluetooth stack is toast.", "AUDIO FIX"),
        ],
    },
    {
        "slug": "govee-strip-lights-not-connecting-wifi",
        "board": "Desk Setup Guides",
        "category": "SMART LIGHTS",
        "keywords": "govee lights, smart lights, wifi not connecting, 2.4ghz wifi, led strip lights",
        "angles": [
            ("Govee Lights Won't Connect to Wi-Fi?", "Check 2.4GHz, app permissions, Bluetooth setup, router band steering, and device reset order.", "SMART FIX"),
            ("Smart Lights Hate Weird Wi-Fi", "Band steering, 5GHz-only networks, and weak setup Bluetooth can stop pairing before it starts.", "2.4GHZ"),
            ("LED Strip Offline Again?", "Run the router, app, reset, and placement checks before blaming the strip controller.", "WIFI DIAG"),
        ],
    },
    {
        "slug": "raspberry-pi-5-wont-boot",
        "board": "Desk Setup Guides",
        "category": "RASPBERRY PI",
        "keywords": "raspberry pi 5, pi 5 wont boot, microSD, raspberry pi power, sbc troubleshooting",
        "angles": [
            ("Raspberry Pi 5 Won't Boot?", "Check power supply, microSD image, display timing, EEPROM, and activity LEDs before rebuilding the whole setup.", "PI BOOT"),
            ("Pi 5 Boot Failure Checklist", "Power problems and bad images are more common than dead boards. The tiny computer is dramatic, not always doomed.", "SBC FIX"),
            ("Red Light, No Boot?", "Read the LEDs, test known-good power, reflash the card, and isolate USB devices.", "PI DIAG"),
        ],
    },
    {
        "slug": "microsd-card-not-detected",
        "board": "Desk Setup Guides",
        "category": "STORAGE",
        "keywords": "microsd card not detected, sd card not showing, storage troubleshooting, windows storage, card reader",
        "angles": [
            ("microSD Card Not Detected?", "Check adapter lock, card reader, Disk Management, filesystem format, and another device before formatting anything.", "CARD FIX"),
            ("Do Not Format Yet", "If Windows cannot see the card, test the reader and Disk Management first. Formatting is the nuclear option.", "DATA CHECK"),
            ("SD Card Missing in Windows?", "The card, adapter, reader, driver, and partition table can all be the problem. Work down the chain.", "STORAGE DIAG"),
        ],
    },
    {
        "slug": "wd-elements-not-showing-up",
        "board": "Desk Setup Guides",
        "category": "EXTERNAL DRIVE",
        "keywords": "wd elements, external hard drive not showing, usb drive, data backup, storage troubleshooting",
        "angles": [
            ("WD Elements Not Showing Up?", "Check cable, USB port power, Disk Management, drive letter assignment, and SMART status before panic mode.", "DRIVE FIX"),
            ("External Drive Missing?", "Do not start clicking random format prompts like it is a loot box. Check drive letter and health first.", "DATA SAFE"),
            ("USB Hard Drive Troubleshooting", "Power, cable, enclosure, partition, and filesystem issues can all make a working drive disappear.", "HDD DIAG"),
        ],
    },
    {
        "slug": "office-chair-gas-cylinder-replacement",
        "board": "Desk Setup Guides",
        "category": "OFFICE CHAIR",
        "keywords": "office chair gas cylinder, chair sinking, desk chair repair, home office chair, chair replacement",
        "angles": [
            ("Office Chair Keeps Sinking?", "The gas cylinder is usually the failure point. Measure, remove, replace, and stop doing the slow elevator of shame.", "CHAIR FIX"),
            ("Replace the Cylinder, Not the Whole Chair", "If the seat sinks but the frame is fine, a cylinder swap can save the chair.", "REPAIR"),
            ("Desk Chair Gas Lift Checklist", "Before buying parts, check cylinder size, base fit, removal tools, and whether the seat plate is worth saving.", "FIT CHECK"),
        ],
    },
]

ACCENTS = [GREEN, CYAN, AMBER, PURPLE, RED]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def draw_terminal_grid(draw: ImageDraw.ImageDraw) -> None:
    for x in range(0, W, 80):
        draw.line((x, 0, x, H), fill=GRID, width=1)
    for y in range(0, H, 80):
        draw.line((0, y, W, y), fill=GRID, width=1)
    for y in range(120, H, 240):
        draw.line((0, y, W, y), fill=(18, 30, 43), width=2)


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill, outline=None, width=1, radius=36) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_pin(title: str, sub: str, badge: str, category: str, slug: str, idx: int, out_path: pathlib.Path) -> None:
    accent = ACCENTS[(idx - 1) % len(ACCENTS)]
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw_terminal_grid(draw)

    rounded(draw, (70, 80, 930, 1420), PANEL, outline=(38, 59, 81), width=3, radius=46)
    rounded(draw, (110, 130, 890, 250), PANEL2, outline=(45, 68, 92), width=2, radius=28)
    draw.text((145, 170), "STACKGEIST", font=F_BRAND, fill=GREEN)
    draw.text((668, 170), category, font=F_KICKER, fill=MUTED)

    rounded(draw, (120, 305, 400, 365), (18, 35, 44), outline=accent, width=2, radius=24)
    draw.text((148, 321), badge, font=F_BADGE, fill=accent)

    title_font = F_TITLE if len(title) < 38 else F_TITLE_SMALL
    y = 420
    for line in wrap_text(draw, title, title_font, 760):
        draw.text((120, y), line, font=title_font, fill=TEXT)
        y += 92 if title_font == F_TITLE else 82

    y += 26
    for line in wrap_text(draw, sub, F_BODY, 760):
        draw.text((124, y), line, font=F_BODY, fill=MUTED)
        y += 50

    checklist_y = 990
    rounded(draw, (120, checklist_y, 880, 1228), (8, 16, 24), outline=(37, 63, 83), width=2, radius=28)
    checks = ["check the boring stuff first", "avoid replacing good gear", "full checklist on StackGeist"]
    yy = checklist_y + 36
    for i, item in enumerate(checks):
        color = [GREEN, CYAN, AMBER][i]
        draw.text((158, yy), f"0{i+1}>", font=F_MONO, fill=color)
        draw.text((250, yy), item, font=F_BODY_BOLD, fill=TEXT)
        yy += 62

    draw.line((120, 1300, 880, 1300), fill=(44, 68, 88), width=2)
    draw.text((120, 1340), "stackgeist.dev/guides", font=F_FOOT, fill=GREEN)
    draw.text((120, 1378), slug[:41], font=F_MONO, fill=MUTED)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, format="PNG", optimize=True)


def main() -> None:
    OUT_IMG.mkdir(parents=True, exist_ok=True)
    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    rows = []
    schedule_start = datetime(2026, 10, 1, 12, 0, tzinfo=timezone.utc)
    pin_num = 1
    for guide in GUIDES:
        for angle_idx, (title, sub, badge) in enumerate(guide["angles"], start=1):
            content_id = f"tg{pin_num:02d}"
            filename = f"{content_id}-{guide['slug']}.png"
            out_path = OUT_IMG / filename
            draw_pin(title, sub, badge, guide["category"], guide["slug"], pin_num, out_path)
            media_url = f"{DOMAIN}/pinterest/troubleshooting-guides-v1/{filename}"
            link = f"{DOMAIN}/guides/{guide['slug']}/?utm_source=pinterest&utm_medium=organic&utm_campaign={CAMPAIGN}&utm_content={content_id}"
            pub = schedule_start + timedelta(days=pin_num - 1)
            desc = f"{sub} Full practical checklist: {DOMAIN}/guides/{guide['slug']}/"
            rows.append({
                "Title": title,
                "Media URL": media_url,
                "Pinterest board": guide["board"],
                "Thumbnail": "",
                "Description": desc,
                "Link": link,
                "Publish date": pub.strftime("%Y-%m-%dT%H:%M:%S"),
                "Keywords": guide["keywords"],
            })
            pin_num += 1

    with OUT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["Title", "Media URL", "Pinterest board", "Thumbnail", "Description", "Link", "Publish date", "Keywords"])
        writer.writeheader()
        writer.writerows(rows)

    board_counts = {}
    for row in rows:
        board_counts[row["Pinterest board"]] = board_counts.get(row["Pinterest board"], 0) + 1
    provenance = [
        "# Pinterest troubleshooting guides v1 provenance",
        "",
        f"Campaign: `{CAMPAIGN}`",
        f"Rows: {len(rows)}",
        f"Schedule: {rows[0]['Publish date']} through {rows[-1]['Publish date']} UTC, one pin per day",
        "",
        "## Media provenance",
        "",
        "All images in `public/pinterest/troubleshooting-guides-v1/` were generated locally with Pillow by `scripts/generate-pinterest-troubleshooting.py`.",
        "No third-party photography, product renders, logos, or external image assets were used.",
        "The design uses text, simple drawn panels, grid lines, and StackGeist branding only.",
        "",
        "## Boards",
        "",
    ]
    for board, count in sorted(board_counts.items()):
        provenance.append(f"- {board}: {count}")
    provenance += [
        "",
        "## Tracking",
        "",
        "Every destination URL uses:",
        "",
        "- `utm_source=pinterest`",
        "- `utm_medium=organic`",
        f"- `utm_campaign={CAMPAIGN}`",
        "- `utm_content=tgXX`",
    ]
    OUT_PROVENANCE.write_text("\n".join(provenance) + "\n", encoding="utf-8")
    print(f"Generated {len(rows)} PNGs")
    print(f"CSV: {OUT_CSV}")
    print(f"Provenance: {OUT_PROVENANCE}")

if __name__ == "__main__":
    main()
