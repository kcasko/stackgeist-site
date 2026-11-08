# StackGeist live browser audit | November 8, 2026

## Scope

- Production target: https://stackgeist.dev
- Browser: Playwright Chromium, automated headless navigation and interactive checks.
- Generated HTML routes tested: **197** (the Astro build reports 198 pages including the sitemap).
- Unique internal link targets checked over HTTP: **292**.
- Responsive viewport checks: **56** (14 representative routes x widths 320, 390, 768, 1440 CSS pixels).
- Additional full-load image and affiliate attributes checks: **8** (four representative routes at widths 390 and 1440).
- E2E interaction suite: **8/8 passing** after correcting a test expectation to match the site’s actual compatibility guidance.

## Verified passing checks

1. All 197 generated HTML routes navigated successfully; no failed navigation or HTTP error in the initial crawl.
2. All 292 discovered internal link targets resolved to HTTP success after redirects; no broken internal targets.
3. No missing page titles, h1-count problems, empty meta descriptions, or uncaught page JavaScript errors were flagged in the crawl.
4. No horizontal overflow detected during 56 responsive viewport checks.
5. No broken images detected during DOMContentLoaded crawl; the additional eight checks awaited image decoding and also found none.
6. Loaded affiliate links sampled from product/tool pages had the expected `sponsored` and `noopener` relationship attributes.
7. Desktop search filters results; an impossible query produces the empty-state message.
8. Mobile navigation exposes search and takes visitors to a focused search input.
9. The privacy consent dialog can be declined without loading the Pinterest tracking script.
10. USB-C checker reports uncertainty for unknown hardware and for a Thunderbolt 4 dual-monitor request rather than guaranteeing support.
11. Sample product pages have HTTPS affiliate destinations with sponsored link attributes.
12. The original three Playwright smoke tests still pass.

## Findings and priorities

### Medium: 14 retired buying-kit paths redirect to related content

Fourteen generated HTML routes under `/kits/` redirect to troubleshooting guides, labs, or certification content, rather than serving the built kit HTML. The redirects resolve successfully. This is consistent with intentional search consolidation, but users who expected a buying-list page may arrive at a different format. **Recommendation:** verify that current navigation and promotional links point directly to canonical destinations and review whether any high-value buying lists should be reinstated only if supported by search and sales evidence.

### Low: 107 internal link targets normalize missing trailing slashes

Of the 292 internal link targets, **107** redirect solely to add a trailing slash. All ultimately returned HTTP 200. **Recommendation:** normalize authored internal hrefs to canonical trailing-slash URLs when touching relevant templates, rather than bulk-editing unrelated pages.

### Measurement integrity: automated page visits affected first-party analytics

The initial production browser crawl did **not** use StackGeist's existing test-traffic opt-out; recorded 30-day landings rose from **165 before the crawl to 425 after it**. The increase includes automated page loads and should not be interpreted as new organic visitors. These events were not marked synthetic in the existing database, so they cannot safely be removed without potentially deleting legitimate traffic. Do **not** use that window as a clean baseline without accounting for the affected activity. Subsequently, the audit scripts and Playwright tests were updated to set `sessionStorage['stackgeist:affiliate:audit'] = '1'` before page scripts run.

## Artifacts

- `results.json`: page-by-page navigation, metadata, image/JS, link counts and responsive checks.
- `link-and-interaction-results.json`: all 292 HTTP link checks plus eight deeper image/link checks.
- `screenshots/`: 10 full-page desktop/mobile screenshots of five representative page types.
- `e2e/audit-interactions.spec.ts`: search, mobile navigation, consent, compatibility and affiliate-link tests.
- `scripts/playwright-live-audit.mjs` and `scripts/playwright-link-audit.mjs`: reproducible audit scripts (with test-traffic opt-out).

## Limitations

- Not a manual visual pixel review of all 197 routes. Screenshots were captured for ten representative combinations.
- Broken-image checks on the main crawl occurred at DOMContentLoaded; an additional sample waited for image decoding.
- No full accessibility WCAG audit, automated axe scan, real-user field Core Web Vitals assessment, or contrast analysis.
- Did not submit newsletter forms, make purchases, access merchant conversion data, or click external merchant purchase links.
- The production crawl uses the browser and current live website; the source code audit and all-page content-quality review are separate tasks.
- Site traffic may change while tests run; test windows do not represent customer demand.

**Conclusion:** No release-blocking functional errors detected in the audited paths. Prioritize fixing analytics attribution for audit traffic and use reliable clean traffic windows before drawing conversion conclusions.
