# Google Search Console setup

The SeoHead component already renders `<meta name="google-site-verification">`
whenever `PUBLIC_GOOGLE_SITE_VERIFICATION` is set at build time. Bing +
Pinterest are already verified; Google is the one remaining property.

Without GSC we have **zero query/impression data from Google** — we can't
tell which keywords rank, which pages get impressions but no clicks, which
pages were deindexed, or what Google thinks the site is about. First-party
D1 analytics only sees traffic that already arrived.

## Verify the property

Two independent methods are supported. Use either (or both).

### Method 1 — meta tag via env var

1. Visit https://search.google.com/search-console and add `stackgeist.dev`
   as a **URL prefix** property (not Domain — the apex alone is fine; we
   don't have www.).
2. Pick the **HTML tag** verification option.
3. Copy the `content="..."` value (looks like `abc123XYZ…`).
4. In Cloudflare Pages → stackgeist-site project → Settings → Environment
   variables, add:
   - name: `PUBLIC_GOOGLE_SITE_VERIFICATION`
   - value: *the token*
   - environment: Production (and Preview if you want it on previews)
5. Trigger a redeploy (any commit to `master` works, or use the Retry
   deployment button).
6. In GSC, click Verify. Googlebot refetches `/` and reads the meta tag.

### Method 2 — HTML file

Google also accepts a file at `/<token>.html` returning the token in the body.

1. Same step 1–2 as above, but pick **HTML file** verification.
2. Google gives you a filename like `google1234567890abcdef.html`.
3. Save that file at `public/google1234567890abcdef.html` with the single
   line Google provides as its content.
4. Commit, push, let Cloudflare Pages deploy, then click Verify in GSC.

Keep whichever method you use committed so re-verification survives a
redeploy from a fresh Cloudflare account. Both can coexist safely.

## After verification

- Submit the sitemap: in GSC → Sitemaps → add `sitemap.xml`.
- Wait 1–3 days for the first indexing report. Early signals to watch:
  - Pages → **Not indexed → Discovered but not indexed**: pages Google
    knows about but has not crawled. Usually a crawl-budget signal — thin
    pages, low internal link count, or Google deprioritizing the site.
  - Pages → **Not indexed → Crawled but not indexed**: Google crawled and
    chose not to index. Usually a quality/duplication signal.
  - Performance → Queries: real impressions and position per keyword. This
    is what we were missing before verification.
- Bing Webmaster is already verified via `msvalidate.01`; mirror the
  sitemap submission there too for the same reason.

## Why both methods are listed

The env-var path is the clean one, but a stale CF Pages env var or a
different-account redeploy can quietly drop the meta tag with no error.
The HTML-file path survives environment misconfiguration because it ships
as a static asset. Dual coverage costs nothing.
