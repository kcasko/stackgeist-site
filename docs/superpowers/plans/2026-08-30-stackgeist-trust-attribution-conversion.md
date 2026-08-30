# StackGeist Trust, Attribution, and Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a credible ownership/evidence system, privacy-preserving Pinterest-to-affiliate attribution, and a stronger owned-product shortlist on StackGeist.

**Architecture:** Shared Astro components and layouts own editorial evidence and browser instrumentation. A Cloudflare Pages Function validates a minimal event payload and writes it to Workers Analytics Engine; a standalone Node report queries aggregate results. Existing product routes, Amazon tags, navigation rules, and visual language remain intact.

**Tech Stack:** Astro 5, TypeScript, Cloudflare Pages Functions, Workers Analytics Engine, Node.js test runner, Wrangler 4.

**Spec:** `docs/superpowers/specs/2026-08-30-stackgeist-trust-attribution-conversion.md`

## Global Constraints

- Preserve untracked `.env.pinterest`; never stage, print, edit, or delete it.
- Preserve the exact Amazon tracking tag `deskrespawn-20`.
- Capture no names, email addresses, IP addresses, user agents, full referrers, cookies, full query strings, or persistent visitor identifiers.
- Keep attribution only in `sessionStorage`.
- Preserve the terminal/operator design aesthetic and hub navigation rules.
- Do not invent product observations, measurements, ownership, urgency, prices, discounts, ratings, or popularity.
- Every implementation behavior starts with a failing test and ends with the full suite green.

---

### Task 1: Editorial provenance and legal accuracy

**Files:**
- Create: `src/components/EvidencePanel.astro`
- Create: `src/pages/editorial-methodology.astro`
- Modify: `src/components/SiteFooter.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/pages/affiliate-disclosure.astro`
- Modify: five featured product pages under `src/pages/gear/budget-tech/`
- Test: `tests/usability.test.mjs`

**Interfaces:**
- Consumes: existing `ContentLayout.astro` and content CSS tokens.
- Produces: `EvidencePanel` props `{ status: 'owned-and-used' | 'researched'; reviewed: string; sources: {label:string; href:string}[] }` and a public `/editorial-methodology` route.

- [ ] **Step 1: Write failing provenance tests**

Add Node tests asserting the methodology route exists and contains `Owned & used`, `Researched`, `Corrections`, and `Affiliate independence`; About and disclosure contain the accurate purchased/used boundary; the footer links `/editorial-methodology`; and each featured page imports `EvidencePanel`, passes `status="owned-and-used"`, and includes at least one source URL.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- --test-name-pattern="editorial provenance"`
Expected: FAIL because the methodology page and component do not exist.

- [ ] **Step 3: Implement the component and editorial pages**

Create a terminal-styled evidence panel. Publish methodology copy that explains the two evidence states, selection criteria, source hierarchy, update policy, corrections, and affiliate independence. Update About and disclosure with this exact boundary: the TaurusTech-migrated catalog was personally purchased and used, while ownership does not imply laboratory testing and sourced specifications remain identified separately.

- [ ] **Step 4: Add evidence panels to the five featured pages**

Use `owned-and-used`, reviewed date `2026-08-30`, and only source URLs already present in the page or an exact manufacturer/product documentation URL verified during implementation. Do not write new subjective observations.

- [ ] **Step 5: Run focused and full tests**

Run: `npm test -- --test-name-pattern="editorial provenance" && npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/EvidencePanel.astro src/components/SiteFooter.astro src/pages/editorial-methodology.astro src/pages/about.astro src/pages/affiliate-disclosure.astro src/pages/gear/budget-tech tests/usability.test.mjs
git commit -m "feat: add editorial evidence standards"
```

### Task 2: Minimal attribution contract and Pages endpoint

**Files:**
- Create: `src/scripts/affiliate-attribution.ts`
- Create: `functions/api/events.ts`
- Modify: `src/layouts/Layout.astro`
- Modify: `src/layouts/ContentLayout.astro`
- Modify: `wrangler.jsonc`
- Modify: `worker-configuration.d.ts`
- Test: `tests/analytics.test.mjs`

**Interfaces:**
- Consumes: anchors marked `data-affiliate-link` and `data-affiliate-placement`.
- Produces: `POST /api/events` payload `{eventType,pagePath,utmSource,utmMedium,utmCampaign,utmContent,placement,productId,schemaVersion}` and `AFFILIATE_ANALYTICS: AnalyticsEngineDataset`.

- [ ] **Step 1: Write failing contract tests**

Create source-level and importable-unit tests proving only `landing` and `affiliate_click` are accepted; values are strings with bounded lengths; unknown keys do not reach Analytics Engine; invalid methods/media types/payloads return `405`/`415`/`400`; accepted events return `204`; the browser script uses `sessionStorage`, strips the Amazon ASIN to a product identifier, and never references cookies, IP, user agent, or full referrer.

- [ ] **Step 2: Run analytics tests and verify RED**

Run: `node --test tests/analytics.test.mjs`
Expected: FAIL because the endpoint and browser module do not exist.

- [ ] **Step 3: Implement the endpoint**

Export the validator for direct tests and implement `onRequestPost`. Write ordered blobs `[eventType,pagePath,utmSource,utmMedium,utmCampaign,utmContent,placement,productId,schemaVersion]`, `doubles:[1]`, and `indexes:[eventType + ':' + YYYY-MM-DD]`. Set `Cache-Control: no-store`, reject bodies over 4 KiB, and permit same-origin JSON requests only.

- [ ] **Step 4: Implement browser attribution**

On first load, copy only `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` into one session key. Emit one landing event per path per session. Attach click listeners to `data-affiliate-link`; use `navigator.sendBeacon` with a `fetch(...,{keepalive:true})` fallback. Fail silently.

- [ ] **Step 5: Load the script and configure the binding**

Import the script in both shared layouts. Add `analytics_engine_datasets` with binding `AFFILIATE_ANALYTICS` and dataset `stackgeist_affiliate_events` to `wrangler.jsonc`. Regenerate or minimally update worker types.

- [ ] **Step 6: Run focused and full tests**

Run: `node --test tests/analytics.test.mjs && npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add functions/api/events.ts src/scripts/affiliate-attribution.ts src/layouts/Layout.astro src/layouts/ContentLayout.astro wrangler.jsonc worker-configuration.d.ts tests/analytics.test.mjs
git commit -m "feat: add privacy-preserving affiliate attribution"
```

### Task 3: Privacy policy and aggregate reporting

**Files:**
- Modify: `src/pages/privacy.astro`
- Create: `scripts/affiliate-report.mjs`
- Modify: `package.json`
- Test: `tests/analytics.test.mjs`

**Interfaces:**
- Consumes: Analytics Engine dataset `stackgeist_affiliate_events`; environment variables `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`.
- Produces: `npm run analytics:report -- --days 30`, printing aggregates for campaign, landing page, CTA placement, and product identifier.

- [ ] **Step 1: Add failing privacy/report tests**

Assert the Privacy Policy names session storage, the exact captured fields, retention control by Cloudflare, no cookies/persistent visitor ID, and the `/api/events` purpose. Assert the report script refuses missing credentials without printing environment values and its SQL uses sampled-weight aggregation with `_sample_interval`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `node --test tests/analytics.test.mjs`
Expected: FAIL because policy and report command are absent.

- [ ] **Step 3: Update the Privacy Policy**

Replace the no-analytics claim before enabling the endpoint. State the minimal field list, session-only campaign storage, Cloudflare Analytics Engine processor, no sale of data, no first-party analytics cookies, and contact/correction path.

- [ ] **Step 4: Add the aggregate report command**

Build SQL from a strictly numeric `--days` value clamped to 1–365. POST SQL to Cloudflare's Analytics Engine API using bearer credentials from the environment. Print JSON aggregates and clear non-secret error messages. Add `"analytics:report": "node scripts/affiliate-report.mjs"`.

- [ ] **Step 5: Run focused and full tests**

Run: `node --test tests/analytics.test.mjs && npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/pages/privacy.astro scripts/affiliate-report.mjs package.json tests/analytics.test.mjs
git commit -m "feat: document and report affiliate analytics"
```

### Task 4: Owned-and-used conversion hierarchy

**Files:**
- Modify: `src/pages/gear/budget-tech/index.astro`
- Test: `tests/usability.test.mjs`

**Interfaces:**
- Consumes: the five existing product and comparison routes.
- Produces: a `data-owned-shortlist` section with five cards marked `Owned & used` and relevant comparison links.

- [ ] **Step 1: Write the failing shortlist test**

Assert the page contains `data-owned-shortlist`, exactly five `data-owned-pick` cards, the five approved product slugs, `Owned & used`, `/editorial-methodology`, and applicable comparison routes. Assert all thirty catalog cards remain and `deskrespawn-20` is unchanged across source files.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm test -- --test-name-pattern="owned shortlist"`
Expected: FAIL because the shortlist does not exist.

- [ ] **Step 3: Implement the shortlist and accurate catalog framing**

Replace imported-archive framing with personally purchased/used framing plus the ownership/testing boundary. Add a terminal-styled five-card section before the comparison section. Use only existing product summaries and links; add no unsupported experience claims.

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- --test-name-pattern="owned shortlist" && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/gear/budget-tech/index.astro tests/usability.test.mjs
git commit -m "feat: feature personally used budget tech picks"
```

### Task 5: Build, deploy, and verify

**Files:**
- Verify all changed files; no new production source is expected.

**Interfaces:**
- Consumes: Tasks 1–4.
- Produces: deployed canonical pages and verified event endpoint.

- [ ] **Step 1: Run all quality gates**

Run: `npm test && npm run build && npx wrangler pages functions build --outdir "$LOCALAPPDATA/Temp/stackgeist-functions-check"`
Expected: all commands exit 0 without source errors.

- [ ] **Step 2: Inspect intended diff and repository safety**

Run: `git status --short && git diff --check && git log -5 --oneline`
Expected: `.env.pinterest` remains untracked and no unintended file is staged or committed.

- [ ] **Step 3: Deploy with the established workflow**

Run: `npm run deploy`
Expected: Wrangler prints a concrete deployment URL and exits 0.

- [ ] **Step 4: Verify canonical pages**

Fetch `https://stackgeist.dev/editorial-methodology`, `/gear/budget-tech`, `/privacy`, and one featured product. Verify HTTP 200 and expected copy.

- [ ] **Step 5: Verify API behavior and ingestion acceptance**

GET `/api/events` must return `405`. POST invalid JSON must return `400`. POST a synthetic non-personal landing event with `utmSource="verification"` must return `204`.

- [ ] **Step 6: Query back when credentials are available**

Run: `npm run analytics:report -- --days 1` only if `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are present. Verify the `verification` aggregate appears. If credentials are absent, report query-back as blocked rather than claiming it succeeded.

- [ ] **Step 7: Push source synchronization when authenticated**

Run: `git push origin redesign/mindmap-premium`
Expected: remote branch advances to the verified commits. If authentication or branch protection blocks the push, report the exact blocker.
