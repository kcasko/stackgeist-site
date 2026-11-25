# StackGeist

Static Astro publication for practical computer fixes, home labs, study notes and hardware decisions. The catalog in `src/data/catalog.ts` drives discovery, search and RSS. Keep established routes and the four-department visual identity.

## Local work

Use the Node version specified in package.json and install the lockfile with `npm ci`. Build with `npm run build`, then run `npm test`. Build before tests because route/link checks read `dist/`.

For the repository's background development server, use `npm run dev -- --background`; see AGENTS.md for status/log/stop commands. `npm run preview` builds and starts Cloudflare's local Pages preview. Do not run `npm run deploy` without release authorization.

## Review gates

- Check all affected routes at 320, 390, 768, 1024 and 1440 CSS pixels in both themes. Verify keyboard focus, storage-denied consent behavior and the browser console.
- Keep every indexable route discoverable and in the sitemap. Archived/noindexed routes stay available unless traffic, backlink and editorial evidence supports a change.
- Keep breadcrumbs tied to existing pages. JSON-LD must reflect real visible content. Never add invented ratings, reviews, prices or stock to satisfy a validator.
- See `docs/image-policy.md` before adding a product photo. Preserve source, license and credit information; label illustrations and example photos accurately.
- Protect readers before recommending purchases or repair commands. Use current primary sources, prerequisites, safe recovery steps and honest ownership/test claims.

## Analytics and privacy

For local browser QA, start at `/?audit=1`. This suppresses the first-party landing/click collector for the current tab session and survives navigation; `?audit=0` restores it. Still intercept third-party measurement in automated QA. Never click merchant tracking links or submit test purchases to verify a layout.

Partner offer identifiers occupy the existing `product_id` event field, alongside historical Amazon ASINs; no database migration is required. Only recognized configured paid destinations are counted. Keep approved network URLs and tracking identifiers intact.

Google's Indexing API is not for generic articles. The old submission script now refuses to submit URLs. Maintain crawlable links and the sitemap, and use read-only Search Console reports for evidence.

## Audit and fixes

The original evidence is in `reports/comprehensive-audit-2026-11-06/`. Implementation checks and remaining account/release gates are recorded separately in `reports/audit-fixes-2026-11-06/`.

## Agent development and creative standards

All coding agents should start with [AGENTS.md](AGENTS.md). [CLAUDE.md](CLAUDE.md) and [.github/copilot-instructions.md](.github/copilot-instructions.md) point to the same policy. These instructions preserve this publication's existing editorial controls and favor independent critique, original editorial design, small changes, security, test evidence and explicit approval before release.

- [Architecture and repository map](docs/ARCHITECTURE.md)
- [Visual identity and design standards](docs/DESIGN_GUIDELINES.md)
- [Security and privacy review](docs/SECURITY.md)
- [Definition of done / quality checks](docs/QUALITY_CHECKLIST.md)
- [Feature, design, release and retrospective templates](docs/templates/)
- [Architecture decision record template](docs/decisions/ADR-0000-template.md)

`.github/workflows/site-quality.yml` checks every pull request and can be triggered manually. It installs from the lockfile, builds **before** tests, then validates the staged editorial queue. The existing editorial-specific review and publish workflows remain in place. The general workflow does not publish or deploy. For local browser QA, set `PLAYWRIGHT_BASE_URL` to the local preview instead of relying on the default production URL.
