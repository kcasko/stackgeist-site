#!/usr/bin/env python3
"""
Pinterest no-API bulk upload helper for StackGeist.

This does not call the Pinterest developer API and does not require OAuth.
It validates a Pinterest bulk-upload CSV, verifies StackGeist media/destination
URLs are live, copies the CSV path to the Windows clipboard, and opens the
official Pinterest bulk-create UI in the default browser.

Manual step after this script opens Pinterest:
  Settings -> Import content -> Upload .csv or .txt file
  URL: https://www.pinterest.com/settings/bulk-create-pins/

Why manual? Pinterest's bulk uploader is the approved non-API route. Avoid
private web endpoints; they are brittle and can risk the account.
"""
from __future__ import annotations

import argparse
import csv
import os
import pathlib
import subprocess
import sys
import urllib.parse
import urllib.request
import webbrowser
from collections import Counter

DEFAULT_CSV = pathlib.Path("marketing/pinterest/pinterest-troubleshooting-guides-v1.csv")
REQUIRED_HEADERS = [
    "Title",
    "Media URL",
    "Pinterest board",
    "Thumbnail",
    "Description",
    "Link",
    "Publish date",
    "Keywords",
]
BULK_URL = "https://www.pinterest.com/settings/bulk-create-pins/"
SCHEDULED_URL = "https://www.pinterest.com/pin-builder/scheduled/"


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def head_status(url: str, timeout: int = 20) -> tuple[int | None, str]:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "StackGeist no-api validator/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.headers.get("content-type", "")
    except urllib.error.HTTPError as err:
        return err.code, err.headers.get("content-type", "")
    except Exception:
        # Some hosts block HEAD. Fall back to a small GET.
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "StackGeist no-api validator/1.0"})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.status, resp.headers.get("content-type", "")
        except Exception as exc:
            return None, str(exc)


def validate_csv(csv_path: pathlib.Path, skip_network: bool = False) -> list[dict[str, str]]:
    if not csv_path.exists():
        fail(f"CSV not found: {csv_path}")

    with csv_path.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames or []
        if headers != REQUIRED_HEADERS:
            fail(f"CSV headers do not match Pinterest import headers. Found: {headers}")
        rows = list(reader)

    if not rows:
        fail("CSV contains no rows")

    seen_media: set[str] = set()
    seen_links: set[str] = set()
    for i, row in enumerate(rows, start=2):
        for field in ("Title", "Media URL", "Pinterest board", "Description", "Link", "Publish date", "Keywords"):
            if not row.get(field, "").strip():
                fail(f"row {i} missing required field: {field}")
        if row["Media URL"] in seen_media:
            fail(f"row {i} duplicate Media URL: {row['Media URL']}")
        if row["Link"] in seen_links:
            fail(f"row {i} duplicate Link: {row['Link']}")
        seen_media.add(row["Media URL"])
        seen_links.add(row["Link"])

        media = urllib.parse.urlparse(row["Media URL"])
        link = urllib.parse.urlparse(row["Link"])
        if media.scheme != "https" or media.netloc != "stackgeist.dev":
            fail(f"row {i} Media URL must be public stackgeist.dev HTTPS: {row['Media URL']}")
        if link.scheme != "https" or link.netloc != "stackgeist.dev":
            fail(f"row {i} Link must be stackgeist.dev HTTPS: {row['Link']}")
        query = urllib.parse.parse_qs(link.query)
        expected = {
            "utm_source": "pinterest",
            "utm_medium": "organic",
        }
        for key, value in expected.items():
            if query.get(key) != [value]:
                fail(f"row {i} Link missing {key}={value}: {row['Link']}")
        if "utm_campaign" not in query or "utm_content" not in query:
            fail(f"row {i} Link missing utm_campaign or utm_content: {row['Link']}")

    if not skip_network:
        # Validate representative URLs instead of hammering all rows every run.
        checks = [rows[0], rows[len(rows) // 2], rows[-1]]
        for row in checks:
            media_status, media_type = head_status(row["Media URL"])
            if media_status != 200 or "image" not in media_type.lower():
                fail(f"media URL failed validation: {media_status} {media_type} {row['Media URL']}")
            link_status, _ = head_status(row["Link"])
            if link_status != 200:
                fail(f"destination URL failed validation: {link_status} {row['Link']}")

    return rows


def copy_to_clipboard(text: str) -> bool:
    try:
        subprocess.run("clip.exe", input=text, text=True, check=True)
        return True
    except Exception:
        return False


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate and open Pinterest bulk uploader without using Pinterest API.")
    parser.add_argument("csv", nargs="?", default=str(DEFAULT_CSV), help="Pinterest CSV path")
    parser.add_argument("--skip-network", action="store_true", help="Skip live URL validation")
    parser.add_argument("--no-open", action="store_true", help="Validate only; do not open browser")
    args = parser.parse_args()

    csv_path = pathlib.Path(args.csv).resolve()
    rows = validate_csv(csv_path, skip_network=args.skip_network)
    boards = Counter(row["Pinterest board"] for row in rows)

    copied = copy_to_clipboard(str(csv_path))

    print("Pinterest no-API package ready")
    print(f"CSV: {csv_path}")
    print(f"Rows: {len(rows)}")
    print("Boards:")
    for board, count in sorted(boards.items()):
        print(f"  - {board}: {count}")
    print(f"First publish date: {rows[0]['Publish date']}")
    print(f"Last publish date:  {rows[-1]['Publish date']}")
    print(f"Clipboard: {'CSV path copied' if copied else 'could not copy CSV path'}")
    print()
    print("Upload URL:")
    print(BULK_URL)
    print()
    print("After upload, verify scheduled pins here:")
    print(SCHEDULED_URL)

    if not args.no_open:
        webbrowser.open(BULK_URL)


if __name__ == "__main__":
    main()
