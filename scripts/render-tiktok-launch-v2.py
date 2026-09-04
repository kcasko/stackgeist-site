#!/usr/bin/env python
"""Render StackGeist's first vertical TikTok batch from owned campaign art."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "marketing" / "tiktok" / "launch-v2"
SCENES = OUT / "_scenes"
W, H = 1080, 1920
BG = "#07050D"
SURFACE = "#151020"
PURPLE = "#A855F7"
PURPLE_LIGHT = "#C084FC"
TEXT = "#F7F3FB"
MUTED = "#A99FAF"
PHOSPHOR = "#A3E635"
AMBER = "#F2B872"
DISPLAY_FONT = Path("C:/Windows/Fonts/bahnschrift.ttf")
MONO_FONT = Path("C:/Windows/Fonts/CascadiaMono.ttf")

VIDEOS = [
    {
        'slug': 'lamp-vs-screenbar',
        'source': ROOT / "public/pinterest/comparison-v1/c03.png",
        'label': 'DESK LIGHTING / FIT',
        'title': 'Lamp or monitor light bar?',
        'tips': [
            ('01', 'CHECK DESK SPACE', 'A clamp lamp uses an edge. A light bar uses monitor space.'),
            ('02', 'CHECK GLARE CONTROL', 'Aim the light at the work surface, not the screen or your eyes.'),
            ('03', 'BUY FOR THE TASK', 'Choose reach and adjustment before brand or RGB.')
        ],
        'cta': 'LIGHT THE WORK, NOT THE ROOM',
        'path': '/gear/budget-tech/compare/clamp-led-lamp-vs-screenbar',
        'utm': 'lamp_vs_screenbar',
        'caption': 'Clamp lamp or monitor light bar? Choose around desk space, aiming control, and the task—not brand hype. Full comparison at StackGeist.dev. #desksetup #desklighting #homeoffice #techtok #productivity'
    },
    {
        'slug': 'cheap-hub-vs-anker',
        'source': ROOT / "public/pinterest/comparison-v1/c01.png",
        'label': 'USB-C / CONNECTIVITY',
        'title': 'Which USB-C hub fits?',
        'tips': [
            ('01', 'CHECK THE HOST PORT', 'A hub cannot add video output your laptop does not support.'),
            ('02', 'COUNT REAL CONNECTIONS', 'List displays, Ethernet, cards, and USB devices before ports.'),
            ('03', 'PAY FOR THE GAP', 'Choose the cheaper hub unless the extra ports solve a real workflow.')
        ],
        'cta': 'TRACE THE SIGNAL PATH FIRST',
        'path': '/gear/budget-tech/compare/acodot-hub-vs-anker-553',
        'utm': 'cheap_hub_vs_anker',
        'caption': 'A USB-C hub cannot create capabilities your laptop port does not have. Check the host, then count the connections you actually use. #usbc #laptopsetup #desksetup #techtok #tech'
    },
    {
        'slug': 'gan-vs-wall-brick',
        'source': ROOT / "public/pinterest/comparison-v1/c04.png",
        'label': 'DESK POWER / CHARGING',
        'title': 'One charger or many?',
        'tips': [
            ('01', 'LIST EVERY DEVICE', 'Laptop, phone, tablet, and accessories create the real load.'),
            ('02', 'CHECK SHARED POWER', 'Multi-port chargers divide output when several devices connect.'),
            ('03', 'KEEP IT SIMPLE', 'A wall brick wins when only one device needs power.')
        ],
        'cta': 'SIZE POWER TO THE WORKLOAD',
        'path': '/gear/budget-tech/compare/gan-station-vs-wall-brick',
        'utm': 'gan_vs_wall_brick',
        'caption': 'One big number on a charger is not the whole story. Check per-port and shared output for the devices you connect together. #gancharger #usbcpd #desksetup #techtok #cablemanagement'
    },
    {
        'slug': 'usb-c-cable-check',
        'source': ROOT / "public/pinterest/comparison-v1/c05.png",
        'label': 'USB-C / CABLE CHECK',
        'title': 'USB-C shape proves nothing',
        'tips': [
            ('01', 'POWER IS ONE JOB', 'Match cable power support to the charger and device.'),
            ('02', 'DATA IS ANOTHER', 'Fast charging does not guarantee fast data transfer.'),
            ('03', 'VIDEO IS SEPARATE', 'Confirm display support before using a cable with a monitor or dock.')
        ],
        'cta': 'CHECK POWER, DATA, AND VIDEO',
        'path': '/gear/budget-tech/compare/iniu-cable-vs-generic-usb-c',
        'utm': 'usb_c_cable_check',
        'caption': 'USB-C describes the connector, not every capability. Check power, data, and video support separately. #usbc #cables #laptopsetup #techtok #desksetup'
    },
    {
        'slug': 'hdd-vs-ssd',
        'source': ROOT / "public/pinterest/comparison-v1/c10.png",
        'label': 'STORAGE / DECISION',
        'title': 'Portable HDD or SSD?',
        'tips': [
            ('01', 'HDD BUYS CAPACITY', 'Use it when cost per terabyte matters more than speed.'),
            ('02', 'SSD BUYS SPEED', 'Choose it for active projects, frequent transfers, and travel.'),
            ('03', 'BACKUP IS SEPARATE', 'Whichever you choose, one drive is not a complete backup plan.')
        ],
        'cta': 'MATCH STORAGE TO THE JOB',
        'path': '/gear/budget-tech/compare/wd-elements-vs-samsung-t7',
        'utm': 'hdd_vs_ssd',
        'caption': 'Portable hard drive or SSD? Capacity and price versus speed, silence, and travel durability. One drive is not a backup plan. #ssd #harddrive #backup #techtok #desksetup'
    },
    {
        'slug': 'dual-monitor-arm-check',
        'source': ROOT / "public/pinterest/setup-expansion-v1/e10.png",
        'label': 'MONITORS / MOUNTING',
        'title': 'Before buying a monitor arm',
        'tips': [
            ('01', 'CHECK VESA SUPPORT', 'Confirm the display has a compatible mounting pattern.'),
            ('02', 'CHECK REAL WEIGHT', 'Include the panel and anything attached to it.'),
            ('03', 'CHECK THE DESK', 'Clamp thickness, edge shape, wall clearance, and arm reach all matter.')
        ],
        'cta': 'MEASURE THE MOUNTING SYSTEM',
        'path': '/setups/dual-monitor-productivity',
        'utm': 'dual_monitor_arm_check',
        'caption': 'A monitor arm is a fit problem first: VESA pattern, panel weight, desk clamp, wall clearance, and reach. #monitorarm #dualmonitor #desksetup #productivity #techtok'
    },
    {
        'slug': 'console-tv-height',
        'source': ROOT / "public/pinterest/setup-expansion-v1/e03.png",
        'label': 'CONSOLE / LIVING ROOM',
        'title': 'Fix TV height before accessories',
        'tips': [
            ('01', 'START FROM THE SEAT', 'Plan the screen around the couch, not an empty wall.'),
            ('02', 'KEEP THE CENTER COMFORTABLE', 'Avoid a placement that forces a constant upward neck angle.'),
            ('03', 'ROUTE THE WHOLE SYSTEM', 'Power, HDMI, speakers, controllers, and ventilation need a path.')
        ],
        'cta': 'BUILD FROM THE SEAT OUTWARD',
        'path': '/setups/console-living-room',
        'utm': 'console_tv_height',
        'caption': 'Console setup starts with the seat and TV position—not RGB accessories. Then route power, HDMI, audio, controllers, and airflow. #gamingsetup #ps5setup #xboxsetup #livingroom #techtok'
    },
    {
        'slug': 'handheld-dock-check',
        'source': ROOT / "public/pinterest/setup-expansion-v1/e04.png",
        'label': 'HANDHELD / DOCKING',
        'title': 'Buying a handheld dock?',
        'tips': [
            ('01', 'MATCH THE DISPLAY', 'Check the resolution and refresh target you actually use.'),
            ('02', 'MATCH THE CHARGER', "Dock and charger must support the handheld's power needs."),
            ('03', 'COUNT THE REAL PORTS', 'Ethernet, storage, controls, and audio decide the dock—not looks.')
        ],
        'cta': 'DOCK THE WORKFLOW, NOT THE LOGO',
        'path': '/setups/handheld-steam-deck',
        'utm': 'handheld_dock_check',
        'caption': 'Choose a Steam Deck or handheld dock around the display, charger, Ethernet, storage, controls, and audio you actually use. #steamdeck #handheldgaming #usbc #gamingsetup #techtok'
    },
    {
        'slug': 'wfh-setup-order',
        'source': ROOT / "public/pinterest/setup-expansion-v1/e06.png",
        'label': 'WORK FROM HOME / FIT',
        'title': 'Upgrade your desk in this order',
        'tips': [
            ('01', 'FIX SEATING AND REACH', 'Set chair, desk, keyboard, and mouse positions before accessories.'),
            ('02', 'FIX SCREEN POSITION', 'Place the display for your real viewing distance and posture.'),
            ('03', 'FIX LIGHT AND AUDIO', 'Solve calls and eye-level tasks before decorative upgrades.')
        ],
        'cta': 'REMOVE FRICTION BEFORE DECOR',
        'path': '/setups/work-from-home-pro',
        'utm': 'wfh_setup_order',
        'caption': 'Home-office upgrade order: seating and reach, screen position, then light and audio. Decor comes after daily friction. #homeoffice #desksetup #productivity #workfromhome #techtok'
    },
    {
        'slug': 'home-lab-network-first',
        'source': ROOT / "public/pinterest/setup-expansion-v1/e08.png",
        'label': 'HOME LAB / FOUNDATION',
        'title': 'Home lab? Network first',
        'tips': [
            ('01', 'WIRE THE CORE', 'Build a dependable network path before adding more compute.'),
            ('02', 'PLAN STORAGE AND BACKUP', 'A NAS is not automatically a backup; plan copies and recovery.'),
            ('03', 'PLAN POWER AND NOISE', 'UPS coverage, idle draw, heat, and sound belong in the design.')
        ],
        'cta': 'BUILD THE FOUNDATION FIRST',
        'path': '/setups/home-lab-dev-workstation',
        'utm': 'home_lab_network_first',
        'caption': 'Before buying more mini PCs: wire the network, plan storage and recovery, then check power, heat, and noise. #homelab #nas #networking #desksetup #techtok'
    },
    {
        'slug': 'podcast-room-first',
        'source': ROOT / "public/pinterest/setup-expansion-v1/e16.png",
        'label': 'PODCAST / AUDIO',
        'title': 'Fix the room before the mic',
        'tips': [
            ('01', 'GET CLOSER', 'Close mic placement improves voice-to-room balance.'),
            ('02', 'REDUCE REFLECTIONS', 'Change the room and position before buying a premium microphone.'),
            ('03', 'MONITOR A REAL TAKE', 'Record speech, silence, keyboard, and HVAC—then listen back.')
        ],
        'cta': 'CONTROL THE ROOM FIRST',
        'path': '/setups/podcasting-audio',
        'utm': 'podcast_room_first',
        'caption': 'A premium microphone still records a bad room. Start with distance, reflections, and a real test recording. #podcastsetup #microphone #audiotips #homestudio #techtok'
    }
]



def font(path: Path, size: int):
    return ImageFont.truetype(str(path), size=size)


def cover(im: Image.Image, size=(W, H)) -> Image.Image:
    ratio = max(size[0] / im.width, size[1] / im.height)
    scaled = im.resize((round(im.width * ratio), round(im.height * ratio)), Image.Resampling.LANCZOS)
    left = (scaled.width - size[0]) // 2
    top = (scaled.height - size[1]) // 2
    return scaled.crop((left, top, left + size[0], top + size[1]))


def contain(im: Image.Image, size=(W, H)) -> Image.Image:
    ratio = min(size[0] / im.width, size[1] / im.height)
    return im.resize((round(im.width * ratio), round(im.height * ratio)), Image.Resampling.LANCZOS)


def wrap(draw: ImageDraw.ImageDraw, text: str, face, max_width: int) -> list[str]:
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = word if not current else current + " " + word
        if draw.textbbox((0, 0), candidate, font=face)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def multiline(draw, xy, text, face, fill, max_width, spacing=12):
    x, y = xy
    for line in wrap(draw, text, face, max_width):
        draw.text((x, y), line, font=face, fill=fill)
        y += draw.textbbox((x, y), line, font=face)[3] - draw.textbbox((x, y), line, font=face)[1] + spacing
    return y


def add_chrome(draw: ImageDraw.ImageDraw, label: str, index: str):
    draw.rectangle((0, 0, W, 120), fill=BG)
    draw.rectangle((0, 120, W, 126), fill=PURPLE)
    draw.text((64, 36), "STACKGEIST // FIELD GUIDE", font=font(MONO_FONT, 28), fill=TEXT)
    draw.text((64, 151), label, font=font(MONO_FONT, 25), fill=MUTED)
    draw.text((904, 151), index, font=font(MONO_FONT, 25), fill=PHOSPHOR)
    draw.rectangle((0, H - 150, W, H), fill=BG)
    draw.rectangle((0, H - 156, W, H - 150), fill="#332247")
    draw.rectangle((64, H - 96, 86, H - 74), fill=PURPLE)
    draw.text((106, H - 111), "STACKGEIST.DEV", font=font(DISPLAY_FONT, 34), fill=TEXT)


def hook_scene(item: dict) -> Image.Image:
    src = Image.open(item["source"]).convert("RGB")
    bg = cover(src).filter(ImageFilter.GaussianBlur(28))
    bg = ImageEnhance.Brightness(bg).enhance(0.35)
    canvas = bg
    poster = contain(src, (W, H - 200))
    x = (W - poster.width) // 2
    y = (H - poster.height) // 2
    canvas.paste(poster, (x, y))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, W, 40), fill=PURPLE)
    draw.text((50, 48), "[ SWIPE-STOP / 00 ]", font=font(MONO_FONT, 24), fill=PHOSPHOR)
    return canvas


def tip_scene(item: dict, number: str, headline: str, body: str, scene_index: int) -> Image.Image:
    src = Image.open(item["source"]).convert("RGB")
    bg = cover(src).filter(ImageFilter.GaussianBlur(34))
    bg = ImageEnhance.Brightness(bg).enhance(0.20)
    tint = Image.new("RGB", (W, H), BG)
    canvas = Image.blend(bg, tint, 0.58)
    draw = ImageDraw.Draw(canvas)
    add_chrome(draw, item["label"], f"0{scene_index}/04")

    draw.rounded_rectangle((58, 275, W - 58, 1430), radius=24, fill=SURFACE, outline="#4A3267", width=3)
    draw.text((92, 315), f"STEP_{number}", font=font(MONO_FONT, 34), fill=PHOSPHOR)
    draw.rectangle((92, 380, 300, 388), fill=PURPLE)
    y = multiline(draw, (92, 445), headline, font(DISPLAY_FONT, 92), TEXT, W - 184, 8)
    y += 60
    multiline(draw, (92, y), body, font(DISPLAY_FONT, 46), MUTED, W - 184, 16)

    draw.text((92, 1280), "BUY LATER. FIX THE BOTTLENECK NOW.", font=font(MONO_FONT, 24), fill=AMBER)
    return canvas


def cta_scene(item: dict) -> Image.Image:
    canvas = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(canvas)
    for i in range(8):
        x = 64 + i * 128
        draw.line((x, 0, x - 220, H), fill="#151020", width=2)
    draw.rectangle((0, 0, 22, H), fill=PURPLE)
    draw.text((72, 170), "DECISION COMPLETE", font=font(MONO_FONT, 29), fill=PHOSPHOR)
    y = multiline(draw, (72, 310), item["cta"], font(DISPLAY_FONT, 105), TEXT, W - 144, 12)
    draw.rectangle((72, y + 60, W - 72, y + 68), fill=PURPLE)
    draw.text((72, y + 125), "FULL GUIDE", font=font(MONO_FONT, 28), fill=MUTED)
    draw.text((72, y + 190), "STACKGEIST.DEV", font=font(DISPLAY_FONT, 52), fill=PURPLE_LIGHT)
    draw.text((72, y + 260), "LINK IN BIO", font=font(MONO_FONT, 28), fill=PHOSPHOR)
    draw.rounded_rectangle((72, 1480, W - 72, 1685), radius=20, fill=SURFACE, outline="#4A3267", width=3)
    draw.text((108, 1535), "SAVE THIS CHECKLIST", font=font(DISPLAY_FONT, 55), fill=TEXT)
    draw.text((108, 1615), "FOLLOW FOR FIT-FIRST SETUPS", font=font(MONO_FONT, 25), fill=PHOSPHOR)
    draw.text((72, H - 105), "STACKGEIST // BUILD BY FIT", font=font(MONO_FONT, 28), fill=MUTED)
    return canvas


def render_video(item: dict):
    item_dir = SCENES / item["slug"]
    item_dir.mkdir(parents=True, exist_ok=True)
    frames = [hook_scene(item)]
    for idx, (num, headline, body) in enumerate(item["tips"], start=1):
        frames.append(tip_scene(item, num, headline, body, idx))
    frames.append(cta_scene(item))
    paths = []
    for i, frame in enumerate(frames):
        p = item_dir / f"scene-{i:02d}.png"
        frame.save(p, optimize=True)
        paths.append(p)

    out = OUT / f"{item['slug']}.mp4"
    durations = [2.6, 2.5, 2.5, 2.5, 2.9]
    transition = 0.28
    cmd = ["ffmpeg", "-y"]
    for p in paths:
        cmd += ["-i", str(p)]
    filters = []
    for i, duration in enumerate(durations):
        total_frames = round(duration * 30)
        zoom_delta = "0.00018" if i % 2 == 0 else "0.00012"
        filters.append(
            f"[{i}:v]scale=1080:1920,zoompan=z='min(zoom+{zoom_delta},1.035)':"
            f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={total_frames}:s=1080x1920:fps=30,"
            f"format=yuv420p,setpts=PTS-STARTPTS[v{i}]"
        )
    offset = durations[0] - transition
    previous = "v0"
    for i in range(1, len(durations)):
        output = "vout" if i == len(durations) - 1 else f"x{i}"
        filters.append(f"[{previous}][v{i}]xfade=transition=fade:duration={transition}:offset={offset:.2f}[{output}]")
        previous = output
        offset += durations[i] - transition
    cmd += [
        "-filter_complex", ";".join(filters), "-map", "[vout]",
        "-c:v", "libx264", "-preset", "medium", "-crf", "19",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", str(out)
    ]
    subprocess.run(cmd, check=True)
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rendered = []
    for item in VIDEOS:
        path = render_video(item)
        rendered.append({
            "slug": item["slug"],
            "file": path.name,
            "destination": "https://stackgeist.dev" + item["path"] +
                "?utm_source=tiktok&utm_medium=organic&utm_campaign=tiktok_launch_v2&utm_content=" + item["utm"],
            "caption": item["caption"],
            "audio": "Add a currently licensed native TikTok sound at low volume; keep text fully readable.",
        })
    (OUT / "manifest.json").write_text(json.dumps(rendered, indent=2), encoding="utf-8")
    print(json.dumps(rendered, indent=2))


if __name__ == "__main__":
    main()
