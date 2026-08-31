# StackGeist Trust, Attribution, and Conversion Foundation

**Date:** 2026-08-30
**Status:** Approved

## Goal

Make StackGeist's affiliate funnel more trustworthy and measurable without changing its approved terminal/operator visual identity or publishing unsupported product claims.

## Scope

### 1. Editorial trust

- Publish `/editorial-methodology` describing product selection, ownership labels, source use, recommendation criteria, affiliate independence, update dates, and correction policy.
- Correct the About and Affiliate Disclosure pages to state that the products migrated from `taurustech.me/affiliate` were personally purchased and used by StackGeist's operator.
- Clearly distinguish `Owned & used` from `Researched` content. Ownership never implies a laboratory test or supports a precise performance claim by itself.
- Add a reusable evidence component to product pages with an evidence status, reviewed date, and source links.
- Use only exact claims already supported by an identified source. Do not invent observations, measurements, testing, popularity, urgency, prices, discounts, or review scores.

### 2. Privacy-preserving attribution

- Capture only two event types: `landing` and `affiliate_click`.
- Capture only page path, UTM source, UTM medium, UTM campaign, UTM content, CTA placement, product identifier, and event schema version.
- Do not intentionally capture names, email addresses, IP addresses, user agents, full referrers, full query strings, cookies, or persistent visitor IDs.
- Keep campaign attribution in browser `sessionStorage`, not cookies or persistent storage.
- POST events to `/api/events`; the Pages Function validates an allowlist and writes ordered fields to a Workers Analytics Engine dataset.
- Return `204` for accepted events and fail silently in the browser so analytics never blocks navigation.
- Update the Privacy Policy before analytics ships.

### 3. Conversion hierarchy

- Reframe `/gear/budget-tech` as a personally purchased and used catalog rather than an imported affiliate archive.
- Add a prominent `Owned & used` shortlist for five existing, higher-detail entries: INIU 240W cable, Acodot 9-in-1 hub, Logitech C920x, Sennheiser Momentum 4, and WD Elements.
- Preserve all thirty existing products and the current search/filter system.
- Connect featured products to applicable comparison pages.
- Do not add pop-ups, fake urgency, countdowns, intrusive sticky purchase controls, or unverified testimonials.
- Keep the existing Amazon tracking tag exactly as `deskrespawn-20` until additional tracking IDs are created in Associates Central.

## Architecture

- `src/components/EvidencePanel.astro` renders reusable provenance metadata.
- `src/scripts/affiliate-attribution.ts` owns campaign parsing, session attribution, event payload construction, and affiliate-link event listeners.
- Both shared layouts load that browser script so every landing page and affiliate CTA uses one implementation.
- `functions/api/events.ts` is a Cloudflare Pages Function with a narrow JSON contract and an `AFFILIATE_ANALYTICS` Analytics Engine binding.
- `wrangler.jsonc` declares the dataset binding `stackgeist_affiliate_events`.
- `scripts/affiliate-report.mjs` queries the Cloudflare Analytics Engine SQL API using environment-provided credentials and prints campaign/page/placement aggregates; credentials never enter source control.

## Event schema

Analytics Engine ordered blobs:

1. event type
2. page path
3. UTM source
4. UTM medium
5. UTM campaign
6. UTM content
7. CTA placement
8. product identifier
9. schema version

The single index is `event type + UTC day`. No personal identifier is used as the sampling index. `double1` is always `1` for count aggregation.

## Verification

- Node tests prove evidence labels, legal copy, instrumentation inclusion, payload minimization, endpoint validation, featured catalog links, and exact Amazon tag preservation.
- `npm test` passes.
- `npm run build` passes.
- Wrangler validates the Pages project and binding.
- Deployment is performed through the existing `npm run deploy` workflow.
- Live methodology, catalog, privacy, and API behavior are fetched after deployment.
- A synthetic event is submitted only after deployment; a successful `204` verifies ingestion acceptance. Dataset query-back is attempted if authenticated SQL API credentials are already available, otherwise that limitation is reported explicitly.

## Safety

- Preserve untracked `.env.pinterest`; never stage, print, edit, or delete it.
- Stage only intentional files.
- Do not expose Cloudflare or Amazon credentials.
- Do not claim a live deployment, analytics write, or query result without reading back the exact target.

## Deployment amendment — 2026-08-30

Cloudflare rejected the first deployment because Workers Analytics Engine was disabled and required an interactive dashboard action. The approved minimal schema is therefore stored in Cloudflare D1, which was available through the existing Wrangler session without a plan or payment change. The Pages Function deletes rows older than 90 days on every accepted write, then inserts only the same nine allowlisted fields. The aggregate report queries D1 through Wrangler; browser behavior and privacy constraints are unchanged.
