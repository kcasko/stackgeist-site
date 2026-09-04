# StackGeist TikTok Operations

## Batches

- `launch-v1/`: first 3 shorts already posted.
- `launch-v2/`: EP04–EP14, 11 faceless 1080×1920 shorts.
- `content-calendar.md`: dates, captions, landing pages, and shot beats.

## Render

From the repository root:

    python scripts/render-tiktok-launch-v2.py

Requirements: Python, Pillow, and ffmpeg on PATH. The renderer creates terminal-style scenes, applies restrained Ken Burns motion and short crossfades, and writes `launch-v2/manifest.json`.

## Upload workflow

1. Open TikTok Studio at `https://www.tiktok.com/tiktokstudio/upload`.
2. Upload the day's MP4 from `marketing/tiktok/launch-v2/`.
3. Paste the matching caption from `content-calendar.md`.
4. Add a currently licensed native TikTok sound at low volume.
5. Check the cover frame, website destination, and visibility before posting.

Do not reuse music files outside TikTok unless their license explicitly permits it.

## Analytics

After 24h and 7d, record views, average watch time, completion rate, likes, comments, shares, saves, profile visits, and follows in `performance.csv`. Optimize for completion + saves; raw views are secondary.
