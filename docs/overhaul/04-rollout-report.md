# Rollout report: new identity applied sitewide

Branch `redesign/editorial-overhaul`. Nothing is deployed.

## What changed

**Articles (every guide, lab, certification page, and course review: 53 pages)**
ContentLayout now applies the article treatment automatically to any catalog page with an article format. No page markup was rewritten for it. It adds:

- Breadcrumbs built from the catalog: Fixes / topic, Learning / WGU degree, and so on.
- The section slab, with the page's own kicker text kept.
- A byline, last-updated date, step count, and format label.
- A summary box labeled by format: Quick fix, Lab summary, The short version, At a glance, or Short answer.
- Numbered blocks for "Step NN" sections and anchored headings.
- A rail with the contents list and related pages. On phones the contents list sits under the summary.

All of it is built at build time, so nothing shifts on load.

**Section fronts**
- **Fixes `/guides/`:**
  - A topic index with counts.
  - A dark numbered "Start here" panel.
  - The fix-first diagram.
  - A ruled two-column list for each topic, with dates.
- **Labs `/labs/`:**
  - A captioned generated photo.
  - Write-ups numbered "Lab 01…".
  - The topology diagram.
  - Lab hardware guides.
- **Learning `/learning/`:** WGU (firsthand) and certifications (researched), in separate lists.
- **Gear `/gear/`:**
  - Owned products shown larger, with an "Owned and used" stamp in place of a retailer photo.
  - Researched products with self-hosted images.
  - "Before you buy" guides.
  - Buying lists.

**Other templates**
- **Topic hubs:** new header. The decorative topic art is gone.
- **Product pages, buying lists, setups, and the evidence panel:**
  - The section slab.
  - Terminal labels removed. The `$ inspect --product`, `$ shoplist`, `#` and `//` prefixes are gone.
  - Monospace labels set back in the main typeface.
  - Square corners.
  - Text set at 10–12 px raised to readable sizes.
- **Breadcrumbs:** every hand-written breadcrumb now uses Fixes, Learning, and Buying lists, and the links have trailing slashes. The breadcrumb structured data uses the same names.
- **Diagrams:**
  - The illustration generator now draws ink line art on white with Geist-yellow highlights. All 18 SVGs were regenerated.
  - The inline diagram components were recoloured to match.
  - The Figure frame was restyled.
- **404:** points to Fixes and Search instead of the archived gaming setups.

**Removed**
- Unused components: `ComparisonAffiliateCta`, `FeaturedSetup`, `Welcome`, `MindMap`.
- Template assets: `src/assets/*.svg`.
- Two tests that only read the deleted MindMap source.

## Verification

- `npm run build`: 197 pages, no errors.
- `npm test`: 53/53 pass. Earlier there were 54; the difference is the removed MindMap test. Tests that checked old markup now check the same intent against the new structure.
- `node scripts/check-links.mjs`, a new script: 10,117 internal references across 197 pages, 0 broken. It checks against built files and `_redirects`.
- No horizontal overflow at 1440 px or 390 px on the sampled pages, which cover every template type.
- Screenshots are in [review/](review/), at desktop and mobile widths, including dark mode for the homepage and USB-C article.

## Missing image assets

- Everything in [02-image-brief.md](02-image-brief.md) is still outstanding. The current generated images are about 980 px wide, which is soft on high-density screens.
- A **real photo of the owned WD Elements drive** would replace the Gear stamp and the Amazon image the WD product page still hotlinks.
- A **real photo of the home lab** would let the Labs front show the actual lab instead of a generated rack.
- **Real screenshots** for the AD lab (ADUC, DNS) and the Network+ lab outputs.

## Unresolved concerns

1. **The catalog is the single source of truth.** A new page has to be added to `src/data/catalog.ts` to show up on the section fronts, in search, in related links, the footer, and the RSS feed. The RSS feed now reads the catalog too: newest first, with dates. `labs.ts` was removed.
2. **Archived pages:**
   - The archived budget-tech product pages and compare pages, and the noindexed setups pages, were spot-checked at desktop and mobile width and pass the contrast check.
   - They still use their older layouts in the new styling.
   - The desk-lighting page's product art is dark placeholder-style renders.
3. **Amazon images:**
   - The four indexed product pages, plus four archived ones that had local copies, now use self-hosted images.
   - The WD page shows no retailer image. It's waiting on a real photo.
   - **20 archived budget-tech pages and the budget-tech catalog still load images from `m.media-amazon.com`.** Removing those images, or self-hosting copies, is a decision about the Amazon Associates image rules. It's left to the owner.
4. **Content:** the indexed "Home lab / dev workstation" setup lists a gaming chair, a 165 Hz monitor, and a gaming headset. That doesn't match its home-lab topic. No copy was rewritten in this pass, and Phase 8 (content cleanup) is not done.
5. **Retro-desk image:** the pixel ghost on the mug resembles an arcade character.

## Deployment readiness

Ready for review on a preview deploy. The build is clean, tests pass, there are no broken internal links, every route is kept, and the redirects are unchanged.

To publish:

```bash
npm run deploy
```

That runs `astro build && wrangler pages deploy`. Run it only once you've approved it. A Cloudflare Pages preview branch deploy is the safer first step.
