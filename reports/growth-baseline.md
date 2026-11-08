# Phase 1 Growth Baseline & Audit Report

## 1. D1 Analytics Baseline Overview
- Documented baseline from `reports/baseline/2026-09-25-conversion-push.md`:
  - Landings: 63 total landing events recorded in D1 (`affiliate_events`).
  - Synthetic Clicks: 1 synthetic click event recorded during automated verification testing (`utm_source=hermes`, `utm_medium=verification`, `utm_content=synthetic_%`).
  - Organic Clicks: 0 organic affiliate clicks.

## 2. Google Search Console (GSC) Audit
- Alert: October 7, 2026 GSC noindex sitemap alert `[WNC-20237597]`.
- Issue: Sitemap URL submissions blocked or returning noindex headers across specific generated dynamic routes.
- Action Required: Fix sitemap generation and headers in `sitemap.xml.ts` to clear indexing blocks and ensure crawlability.

## 3. Active Affiliate Tracking Configuration
Configured tracking IDs in `src/data/partnerOffers.ts` (and affiliate routing):
- Amazon Associates: `deskrespawn-20` tag attached across Amazon product links.
- Tutorials Dojo: Referral tracking ID `ref/379698`.
- UGREEN: Active affiliate tracking links enabled.
- AOMEI: Active partner/affiliate link parameters configured.

## 4. Top 10 Growth & Conversion Improvement Candidates
1. Sitemap & SEO Indexing (`[WNC-20237597]`): Resolve noindex directives on sitemaps to restore search engine discovery.
2. Schema & Structured Data: Inject Product, Review, and BreadcrumbList JSON-LD on high-intent tool and income kit landing pages.
3. Analytics Event Schema Alignment: Standardize D1 schema tracking to use landing and affiliate_click event types while excluding synthetic test traffic.
4. Income Kits Conversion CTAs: Redesign kit landing pages with high-visibility affiliate CTA buttons and comparison tables.
5. Amazon Link Localization & Tag Verification: Ensure deskrespawn-20 tag persistence across international Amazon redirects.
6. Tutorials Dojo Link Optimization: Embed context-relevant banners and direct deal buttons with ref/379698.
7. UGREEN Hardware Offer Integration: Match hardware review tools with UGREEN accessory offers.
8. AOMEI Backup/Disk Utility Promotions: Highlight AOMEI Partition Assistant and Backupper in system recovery tool guides.
9. Internal Link Architecture: Build contextual cross-links between relevant interactive tools and income kits.
10. Page Performance & Core Web Vitals: Optimize static assets and layout shift on tool landing pages to reduce drop-off.
