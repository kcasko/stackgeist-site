#!/usr/bin/env python
"""Render StackGeist's first vertical TikTok batch from owned campaign art."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "marketing" / "tiktok" / "launch-v1"
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
        "slug": "stream-audio-first",
        "source": ROOT / "public/pinterest/setup-expansion-v1/e01.png",
        "label": "STREAMING / AUDIO",
        "title": "Your stream sounds bad?",
        "tips": [
            ("01", "MOVE THE MIC CLOSER", "Improve voice-to-room balance before raising gain."),
            ("02", "LEAVE INPUT HEADROOM", "Speak normally. Do not maximize the level."),
            ("03", "RECORD THE REAL ROOM", "Check voice, keyboard, fan, and reflections before shopping."),
        ],
        "cta": "BUILD THE SETUP BY FIT",
        "path": "/setups/streaming-content-creator",
        "utm": "stream_audio_first",
        "caption": "A second PC will not fix distant, roomy audio. Start with placement, level, and a real test recording. Full fit-first streaming setup at StackGeist.dev. #streamingsetup #desksetup #microphone #pcsetup",
    },
    {
        "slug": "facecam-before-webcam",
        "source": ROOT / "public/pinterest/setup-expansion-v1/e02.png",
        "label": "VIDEO CALLS / FACECAM",
        "title": "Before you replace the webcam",
        "tips": [
            ("01", "RAISE IT TO EYE LEVEL", "Place the lens near the call window to reduce eye-line error."),
            ("02", "LIGHT YOUR FACE", "Move soft light in front and slightly to one side."),
            ("03", "FIX THE BACKGROUND", "Shade a bright window before increasing camera gain."),
        ],
        "cta": "FIX THE WEAKEST LINK FIRST",
        "path": "/guides/better-video-calls",
        "utm": "facecam_before_webcam",
        "caption": "Resolution is rarely the first problem. Fix camera height, front light, and the bright background before buying another webcam. Full guide at StackGeist.dev. #webcam #videocalls #streamingsetup #desksetup",
    },
    {
        "slug": "wifi-router-first",
        "source": ROOT / "public/pinterest/comparison-v1/c02.png",
        "label": "DESK NETWORK / WI-FI",
        "title": "Bad Wi-Fi? Do this first",
        "tips": [
            ("01", "MOVE THE ROUTER", "Center it, lift it off the floor, and get it out of the cabinet."),
            ("02", "TEST THE ACTUAL ROOM", "If calls and streams are stable, keep the built-in radio."),
            ("03", "ADD AN ADAPTER ONLY IF", "Placement cannot change and one device still has weak signal."),
        ],
        "cta": "COMPARE BEFORE YOU BUY",
        "path": "/gear/budget-tech/compare/alfa-adapter-vs-builtin-wifi",
        "utm": "wifi_router_first",
        "caption": "Router placement first. An external Wi-Fi adapter is useful only when placement cannot be fixed and one device still struggles. Full comparison at StackGeist.dev. #wifi #pctips #desksetup #tech",
    },
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
                "?utm_source=tiktok&utm_medium=organic&utm_campaign=tiktok_launch_v1&utm_content=" + item["utm"],
            "caption": item["caption"],
            "audio": "Add a currently licensed native TikTok sound at low volume; keep text fully readable.",
        })
    (OUT / "manifest.json").write_text(json.dumps(rendered, indent=2), encoding="utf-8")
    print(json.dumps(rendered, indent=2))


if __name__ == "__main__":
    main()
