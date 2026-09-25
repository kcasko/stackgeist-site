# StackGeist affiliate conversion push — 2026-09-25

## Baseline (30 days ending 2026-09-25)

- Landings: 63
- Affiliate clicks: 1 (synthetic test, `synthetic_20260912`)
- Real user affiliate clicks: **0**
- Traffic distribution: 46% homepage, remainder long-tail
- Top pages: `/` (29), `/setups/small-bedroom-gaming/` (7), `/gear/monitor-support/ergotron-lx/` (6)

Full baseline: `reports/baseline/analytics-2026-09-25-pre-conversion-fixes.json`,
`reports/baseline/kits-weekly-2026-09-25.md`.

## Diagnosis

Every high-intent page had the same defect:

- Homepage: 4 equal-weight cards, no measurable placement attribution.
- Setup pages: SetupHero illustration pushed first Amazon CTA 2000+ px below the fold.
- Gear product pages: primary Amazon button below the fold; multiple naked `amazon.com/dp/...` links missing `?tag=deskrespawn-20` (missed commission).
- Compare pages: 3268 px total height, first Amazon CTA at y=2652.

Zero-click month wasn't a "no traffic" problem in the usual sense —
it was a "traffic arrived at pages that had no clickable path to
purchase in the first screen" problem.

## Fixes shipped (2026-09-25)

Commit chain: `f5e6c7d → a55ec37 → 4beaef1 → f552ec4 → 4f82cae → 93bb9d5`

- **Gear pages** (38): new `hero-cta` placement above the fold via `ProductDetailSimple`. Ergotron CTA moved y=1127 → y=383.
- **Naked Amazon links** patched on 6 gear pages + Ergotron. Every clickable Amazon URL in the affected files now carries `?tag=deskrespawn-20` and `rel="sponsored nofollow noopener noreferrer"`.
- **Duplicate CTA** removed on `amazon-basics-dual-monitor-arm` (was rendering the same Amazon URL twice).
- **Setup pages** (all 15): new `SetupShopList` component renders 4 sweet-spot picks above the SetupHero illustration. First Amazon CTA now at y~442. Placements: `setup-<slug>-shoplist-<category>`.
- **Homepage hero**: 4 cards instrumented with `data-affiliate-placement=home-featured-<slug>` and UTM tagging so we can attribute the click chain home → kit → Amazon. CTA copy fixed ("Open the kit →" vs "See the setup →").
- **Compare pages** (10): new `quickpick` variant of `ComparisonAffiliateCta` renders side-by-side Amazon CTAs immediately after the page lead. First Amazon CTA moved from y=2652 to y=507. Distinct placement `comparison-quickpick` vs bottom `comparison-verdict`.

## New placements introduced

| Placement | Where |
|---|---|
| `hero-cta` | Every `/gear/*/*` product page (via `ProductDetailSimple`) |
| `setup-<slug>-shoplist-<category>` | Every `/setups/*` page |
| `home-featured-<slug>` | Homepage 4 hero cards |
| `comparison-quickpick` | Above-fold on `/gear/budget-tech/compare/*` |
| `comparison-verdict` | Existing bottom CTA on `/gear/budget-tech/compare/*` (unchanged) |

## Success criteria (measure 2026-10-10)

Re-run `npm run analytics:report -- --days 15` and check:

1. **Any real (non-synthetic) affiliate click** — even one confirms the funnel is unblocked.
2. **`hero-cta` or `comparison-quickpick` clicks** relative to their equivalent below-fold placements — proves above-fold placement matters here as it does everywhere else in the niche.
3. **`home-featured-*` clicks** — tells us which of the 4 homepage cards actually drives interest. Kill the losers, promote the winner.

If clicks stay at zero: the problem isn't the site anymore, it's traffic volume. Escalate: Pinterest posting cadence + Search Console title/meta pass.

## What was NOT changed

- No backend / SAM / Cloudflare Pages configuration changes.
- No changes to the D1 events schema.
- No new tests removed; all 42 existing pass.
- Analytics privacy contract preserved (no changes to `affiliate-attribution.ts`, `events.ts`, `PinterestConsent.astro`, `privacy.astro`).
- Terminal aesthetic preserved on every touched page.

## Screenshots

- `reports/screenshots/setup-small-bedroom-shoplist-live.png` — production shoplist strip on the second-highest-traffic page.
