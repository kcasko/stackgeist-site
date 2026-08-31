#!/usr/bin/env python
"""Fetch Amazon search-result product images for setup-page picks.

Reads scripts/_image_hunt.json, hits amazon.com/s for each unique search
query, extracts the first .s-image tile, writes URLs to scripts/_image_urls.json.
Downloads each image to public/gear/amz/<hash>.jpg for local hosting.
"""
import urllib.request, urllib.parse, re, ssl, gzip, time, random, json, os, hashlib, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INFO = os.path.join(ROOT, "scripts", "_image_hunt.json")
OUT_URLS = os.path.join(ROOT, "scripts", "_image_urls.json")
IMG_DIR = os.path.join(ROOT, "public", "gear", "amz")
os.makedirs(IMG_DIR, exist_ok=True)

ctx = ssl.create_default_context()
HDR_POOL = [
  {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"},
  {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15"},
  {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36"},
  {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0"},
]
def _hdr():
    h = dict(random.choice(HDR_POOL))
    h["Accept-Language"] = "en-US,en;q=0.9"
    h["Accept-Encoding"] = "gzip"
    h["Accept"] = "text/html,application/xhtml+xml"
    return h
HDR = _hdr()  # legacy default

def amazon_first_image(query, timeout=15):
    url = f"https://www.amazon.com/s?k={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers=_hdr())
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=timeout) as r:
            raw = r.read()
            if r.headers.get("Content-Encoding") == "gzip":
                raw = gzip.decompress(raw)
            html = raw.decode("utf-8", errors="ignore")
    except Exception as e:
        return None, f"http:{e}"
    m = re.search(r'<img[^>]+class="[^"]*s-image[^"]*"[^>]+src="(https://m\.media-amazon\.com/images/I/[^"]+)"', html)
    if not m:
        m = re.search(r'<img[^>]+src="(https://m\.media-amazon\.com/images/I/[^"]+)"[^>]+class="[^"]*s-image', html)
    if not m:
        # Newer Amazon layout: image lives inside s-product-image-container
        m = re.search(r's-product-image-container[^>]*>.*?<img[^>]+src="(https://m\.media-amazon\.com/images/I/[^"]+)"', html, re.DOTALL)
    if not m: return None, "no-match"
    u = re.sub(r'\._(AC_UY|AC_UL|AC_SX|AC_SY|AC_UF|CR)[^.]*\.', '._AC_SL500_.', m.group(1))
    return u, "ok"

def download(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 200:
        return True
    req = urllib.request.Request(url, headers={"User-Agent": HDR["User-Agent"]})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=20) as r:
            data = r.read()
        if len(data) < 200: return False
        open(dest, "wb").write(data)
        return True
    except Exception as e:
        print(f"  DL FAIL {url}: {e}", flush=True)
        return False

picks = json.load(open(INFO, encoding="utf-8"))
queries = sorted({p["search"] for p in picks if p["search"]})

results = {}
if os.path.exists(OUT_URLS):
    try: results = json.load(open(OUT_URLS, encoding="utf-8"))
    except: results = {}

to_do = [q for q in queries if q not in results or not results[q].get("image")]
print(f"[hunt] {len(queries)} unique queries, {len(to_do)} remaining", flush=True)

for i, q in enumerate(to_do, 1):
    img, status = amazon_first_image(q)
    entry = {"image": img, "status": status}
    if img:
        h = hashlib.md5(q.encode()).hexdigest()[:12]
        ext = ".png" if img.lower().endswith(".png") else ".jpg"
        dest = os.path.join(IMG_DIR, h + ext)
        if download(img, dest):
            entry["local"] = f"/gear/amz/{h}{ext}"
    results[q] = entry
    print(f"[{i}/{len(to_do)}] {status:8s} {q[:55]:55s} -> {entry.get('local') or img and img[:60] or 'MISS'}", flush=True)
    # persist every 5
    if i % 5 == 0:
        json.dump(results, open(OUT_URLS, "w", encoding="utf-8"), indent=2)
    time.sleep(2.5 + random.random() * 1.5)

json.dump(results, open(OUT_URLS, "w", encoding="utf-8"), indent=2)
ok = sum(1 for v in results.values() if v.get("local"))
print(f"[done] {ok}/{len(queries)} downloaded locally", flush=True)
