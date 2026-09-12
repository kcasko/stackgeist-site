#!/usr/bin/env python3
"""
Submit URLs to Google's Indexing API for stackgeist.dev.

Auth: service account JSON at $GSC_SA_KEY (default:
C:/Users/keith/AppData/Local/hermes/secrets/gsc-service-account.json).
The SA email must be an Owner on the GSC property.

Usage:
    python scripts/submit-to-google.py URL [URL ...]
    python scripts/submit-to-google.py --file urls.txt
    python scripts/submit-to-google.py --guides-index    # every /guides/* on disk
"""
import argparse
import json
import os
import pathlib
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

DEFAULT_KEY = "C:/Users/keith/AppData/Local/hermes/secrets/gsc-service-account.json"
SCOPES = ["https://www.googleapis.com/auth/indexing"]


def load_service(key_path: str):
    creds = service_account.Credentials.from_service_account_file(
        key_path, scopes=SCOPES
    )
    return build("indexing", "v3", credentials=creds, cache_discovery=False)


def submit(service, url: str, action: str = "URL_UPDATED") -> tuple[bool, str]:
    body = {"url": url, "type": action}
    try:
        r = service.urlNotifications().publish(body=body).execute()
        ts = r.get("urlNotificationMetadata", {}).get("latestUpdate", {}).get(
            "notifyTime", "?"
        )
        return True, ts
    except HttpError as e:
        return False, f"HTTP {e.resp.status}: {e.error_details or e._get_reason()}"


def collect_guide_urls(site_root: pathlib.Path) -> list[str]:
    root = site_root / "src/pages/guides"
    urls = []
    for f in sorted(root.glob("*.astro")):
        if f.name == "index.astro":
            continue
        urls.append(f"https://stackgeist.dev/guides/{f.stem}/")
    return urls


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("urls", nargs="*")
    ap.add_argument("--file", help="File with one URL per line")
    ap.add_argument(
        "--guides-index",
        action="store_true",
        help="Submit every /guides/<slug>/ from the repo",
    )
    ap.add_argument(
        "--site-root",
        default="E:/Repos/stackgeist/stackgeist-site",
        help="Repo root (used with --guides-index)",
    )
    ap.add_argument("--key", default=os.environ.get("GSC_SA_KEY", DEFAULT_KEY))
    ap.add_argument(
        "--action",
        choices=["URL_UPDATED", "URL_DELETED"],
        default="URL_UPDATED",
    )
    args = ap.parse_args()

    urls: list[str] = list(args.urls)
    if args.file:
        urls += [
            ln.strip()
            for ln in pathlib.Path(args.file).read_text().splitlines()
            if ln.strip() and not ln.startswith("#")
        ]
    if args.guides_index:
        urls += collect_guide_urls(pathlib.Path(args.site_root))

    urls = sorted(set(urls))
    if not urls:
        print("No URLs given.", file=sys.stderr)
        sys.exit(2)

    print(f"Submitting {len(urls)} URL(s) via Indexing API ({args.action}) ...")
    service = load_service(args.key)

    ok = fail = 0
    for u in urls:
        good, msg = submit(service, u, args.action)
        marker = "OK " if good else "FAIL"
        print(f"  {marker}  {u}  {msg}")
        (globals().__setitem__("ok", ok + 1) if good else globals().__setitem__("fail", fail + 1))
        if good:
            ok += 1
        else:
            fail += 1

    print(f"\nDone. ok={ok} fail={fail}")
    sys.exit(0 if fail == 0 else 1)


if __name__ == "__main__":
    main()
