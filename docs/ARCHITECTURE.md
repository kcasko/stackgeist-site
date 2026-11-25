# StackGeist architecture

_Last inspected: 2026-11-14. Based on the checked-out repository, not a production infrastructure audit._

## Product and users

StackGeist is a reader-first publication for device troubleshooting, practical homelab guidance, certification/study material, and evidence-based gear decisions. The first goal is to help readers solve their problem or choose responsibly without a purchase. The site is a static-first content publication, not a SaaS application.

## Stack and sources of truth

| Layer | Actual implementation | Location |
| --- | --- | --- |
| Site generator | Astro 7.2.x, static output | `package.json`, `astro.config.mjs` |
| UI | Astro components/layouts, TypeScript, Archivo Variable, CSS tokens | `src/components/`, `src/layouts/`, `src/styles/site.css` |
| Published routes | Astro page files | `src/pages/` |
| Content registry | Typed catalog that feeds discovery/search, listing and feed routes | `src/data/catalog.ts` |
| Analytics ingestion | Cloudflare Pages Function, JSON body validation, D1 batch insert and 90-day cleanup | `functions/api/events.ts` |
| Analytics storage | Cloudflare D1 binding `AFFILIATE_DB` | `wrangler.jsonc`, `migrations/` |
| Hosting | Cloudflare Pages Git integration, publishes built `dist/` from the production repository | `wrangler.jsonc`, `docs/editorial-publishing.md` |
| Scheduled content | Owner-approved queue and GitHub Actions release | `editorial/queue.json`, `editorial/staged/`, `.github/workflows/editorial-publish.yml` |
| Automated checks | Node built-in test runner, Playwright Chromium, Astro build, editorial validation | `package.json`, `tests/`, `e2e/`, `playwright.config.ts` |
| Separate automation | Pinterest scheduler Worker (its own package/build context) | `workers/pinterest-scheduler/` |

## Data flow and trust boundaries

```text
Reader browser -> Cloudflare Pages static site -> Astro-generated HTML/CSS/JS
              |                         |
              |                         +-> catalog -> search/RSS/sitemap
              +-> consent/attribution client -> POST /api/events
                                                |
                                   Cloudflare Pages Function (input checks)
                                                |
                                              D1 database

Editorial author -> editorial/staged + owner-approved queue
                 -> scheduled GitHub workflow -> validate/build/test
                 -> commit published page -> Cloudflare Git deployment
```

The public analytics endpoint is an untrusted input boundary. Never embed secrets in `PUBLIC_*` variables (they are shipped to clients). The D1 binding is server-side. Events and affiliate destinations require privacy and attribution discipline; see `docs/SECURITY.md` and `README.md`.

## Repository structure and change impact

- `src/pages/`: published pages, legal pages, sitemap and RSS. Changes on the production branch can go live immediately via Cloudflare.
- `src/layouts/`, `src/components/`, `src/styles/site.css`: presentation shared across many pages. Check both themes and viewport sizes for regressions.
- `src/data/catalog.ts`, `src/data/searchScope.ts`: listing, search and discoverability. Catalog and routes must remain synchronized.
- `public/`: public media and diagrams. Asset permission and evidence policies in `docs/image-policy.md` are mandatory.
- `editorial/`: staged unpublished articles and approval queue. Staged files are intentionally not built into public routes.
- `functions/api/events.ts`: analytics intake, length/schema checks and SQL binding; handle malformed requests without logging personal data.
- `scripts/` and `tests/`: editorial scripts, reporting and verification; avoid running external publishing or affiliate tools merely to test UI.
- `workers/pinterest-scheduler/`: distinct Worker; do not assume root tests cover it.

## Local commands

```powershell
cd D:\Repos\stackgeist-site
npm ci
npm run build
npm test
npm run editorial:validate
```

For browser QA, `npm run test:e2e` requires `PLAYWRIGHT_BASE_URL` explicitly pointing to a **local** server. Its default configuration targets the live site. The existing release workflow starts a local HTTP server against `dist/` and installs Chromium before invoking it. For local layout QA also use `/?audit=1` to suppress first-party landing/click tracking, and block third-party measurements.

No root `lint` or `typecheck` npm script is configured at time of inspection; do not invent or report these checks as passing.

## Deployment and recovery

- **Local**: Astro dev or compiled `dist/`; previews should not send analytics or track merchant clicks.
- **Review**: GitHub pull requests with editorial review and general quality CI.
- **Production**: Cloudflare Pages GitHub integration; publishing policy documented at `docs/editorial-publishing.md`.
- **Rollback**: Examine deployment history and production branch changes; choose a verified revert/redeploy strategy with owner approval. Actual Cloudflare recovery steps and incident monitoring were not verified in this review.

## Non-negotiable invariants

1. Never bypass explicit editorial approval or auto-publish unpublished content.
2. Preserve published URL structure, canonical URLs, sitemap, RSS, and catalog accuracy.
3. Do not fake ownership, benchmarking, sources, imagery permission, or product evidence.
4. Avoid unnecessary buyer tracking, fabricated review schema, and privacy regressions.
5. Do not merge/push/deploy without owner approval; CI changes are not themselves releases.

## Open verification items

- Verify real Cloudflare branch protection, alerts, environment variables, production and preview bindings, and rollback readiness separately before release-sensitive work.
- Evaluate dependency vulnerabilities and any analytics abuse controls against live configuration, not only source comments.
- Review the separate Pinterest worker's runtime and tests when modifying it.

Decision records: `docs/decisions/`; operating standard: `AGENTS.md`.
