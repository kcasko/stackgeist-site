## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Editorial scheduling

Before adding new articles or changing publication settings, read docs/editorial-publishing.md. Unapproved new articles stay under editorial/staged; never publish drafts by committing them directly to src/pages. Only owner-approved queue entries can be released. Keep the Monday/Wednesday/Friday schedule unless the owner requests a change.

## StackGeist editorial voice

Before creating or revising any article, read `docs/editorial-voice.md` and apply its human voice and sourcing checklist. Writing should sound like a practical troubleshooter, not a templated AI or SaaS page. Use the author’s verified WGU and homelab experiences for first-person context only when supported. Never fabricate ownership, testing, exam results, or personal anecdotes. Review the *whole* finished article for repetitive sections, not just the newly appended text.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)


## Environment variables

The build reads these public env vars at build time:

- `PUBLIC_GOOGLE_SITE_VERIFICATION` — optional; adds the `<meta name="google-site-verification">` tag when set.
- `PUBLIC_GA4_MEASUREMENT_ID` — optional; adds the Google Analytics 4 `gtag.js` snippet only when set. If you enable it, update `src/pages/privacy.astro` to disclose GA4 cookies and the Google measurement ID.

Cloudflare Web Analytics is injected by Cloudflare Pages at delivery time and does not need an env var here.

## Astro prose gotcha

Any `<lowercase-word>` appearing in prose inside an .astro file is parsed as a JSX/component tag and will break the build with 'Expected corresponding JSX closing tag.' This bites when you write CLI placeholders like `<interface>`, `<port>`, or `<onboard interface>` in guide bodies. Always HTML-escape the angle brackets: `&lt;interface&gt;`. Uppercase like `<Component>` is fine (real component). Also watch: writing `won\u2019t` (double-backslashed) in a JS string literal ships as a literal backslash-u \u2014 use the real character \u2019 or a single-backslash unicode escape `\u2019`.

## Engineering and creative-direction operating standard

These rules supplement, **not replace**, the StackGeist-specific editorial, Astro, privacy, and publishing rules above. Apply the ten-principle reusable playbook in `D:\Repos\engineering-design-playbook` when available, but this repository's instructions are sufficient on their own.

1. **Independent judgment:** Challenge weak product or implementation assumptions; show meaningful tradeoffs instead of agreeing by default.
2. **Research before reinvention:** Check current source and primary documentation before introducing an approach, library, or third-party claim.
3. **Original art direction:** Use the established StackGeist design identity, then solve each page's information problem with a deliberate composition. No generic SaaS hero, pointless bento grids, glowing blobs, fake terminals, stock illustrations, or templated AI prose. See `docs/DESIGN_GUIDELINES.md`.
4. **Adversarial review:** Look for security, privacy, affiliate-tracking, data-loss, content accuracy, accessibility, and regression issues, not just happy-path behavior.
5. **Evidence-based done:** Inspect the actual rendered/resulting experience and run applicable checks. Never represent proposed, untested, or unpublished work as verified.
6. **Persistent context:** Keep `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, and consequential decisions in `docs/decisions/` current when reality changes.
7. **Tool-assisted truth:** Read actual files, logs, test reports, and browser output rather than assuming a result. Protect unrelated user files and existing uncommitted work.
8. **Build and teach:** Explain important engineering and UX decisions in clear, practical language with verification steps.
9. **Product value:** Prioritize reader fixes, credible evidence, discoverability, site trust, and useful decisions over feature count or affiliate conversion.
10. **Continuous improvement:** Favor small reversible changes; record significant post-release lessons and address material debt deliberately.

### Required workflow

- Before editing, inspect `git status`, relevant source/tests, and `README.md`. Do not clean, reset, delete, stage, or overwrite unrelated work.
- Keep `src/data/catalog.ts`, routing, search, RSS, sitemap, structured data, and published URLs consistent. Do not invent SEO metadata, ownership claims, performance tests, product availability, or ratings.
- Code should be focused, maintainable, defensively validated at trust boundaries, and security-conscious. No credentials in source, docs, git, logs, or screenshots.
- On design changes, inspect `src/styles/site.css`, `docs/DESIGN_GUIDELINES.md`, and `docs/image-policy.md`. Preserve the four-section identity unless the owner explicitly requests a new direction; avoid wholesale redesigns for isolated fixes.
- On content changes, follow `docs/editorial-voice.md` and `docs/editorial-publishing.md` first. Editorial approval, staging, and scheduling safeguards take precedence.
- Run `npm run build` **before** `npm test` (tests inspect generated `dist/`). Use `npm run editorial:validate` for editorial/queue changes. For affected user flows, run local Playwright tests against a **local** server; the default Playwright URL points to the production site.
- Evaluate modified pages at 320, 390, 768, 1024, and 1440 CSS pixels with keyboard/focus checks and both themes. Prefer WCAG 2.2 AA where applicable.
- See `docs/QUALITY_CHECKLIST.md` before marking work complete; report **changed / verified / not verified / risks** with actual results.
- Proceed with scoped reversible research, edits, and local tests. Obtain explicit approval before merging/pushing to production branch, any public publication, production deployment, spending, destructive changes, or changing editorial approval data. A change under `src/pages/` can deploy on merge.
- Do not assume that adding CI or documentation is equivalent to running it on GitHub. Keep releases and published pages unchanged unless authorized.

### Repository-specific reference map

- Stack: Astro 7 (static build), TypeScript, Node.js 22.12+ and npm; Cloudflare Pages with a Pages Function and D1 analytics.
- Build and test: `npm ci`, `npm run build`, `npm test`; `npm run test:e2e` only with an explicit local `PLAYWRIGHT_BASE_URL` for local QA.
- Public pages: `src/pages/`; reusable UI `src/components/`, `src/layouts/`; styles `src/styles/site.css`.
- Catalog/search/feeds: `src/data/catalog.ts`; analytics API: `functions/api/events.ts`; editorial workflow: `editorial/`, `scripts/editorial-release.mjs`, and `.github/workflows/editorial-*.yml`.
- Architecture: `docs/ARCHITECTURE.md`; design: `docs/DESIGN_GUIDELINES.md`; security: `docs/SECURITY.md`; completion checklist: `docs/QUALITY_CHECKLIST.md`.
