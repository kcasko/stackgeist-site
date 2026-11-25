# StackGeist quality checklist

Use proportionately: a documentation-only change needs doc review and repository checks; a published article, analytics change, or design change requires stronger evidence. Never call a step completed unless actually checked.

## Scope and preservation

- [ ] Understand the reader problem and acceptance criteria.
- [ ] Inspect `git status`, current source, relevant docs and tests; protect unrelated and untracked work.
- [ ] Confirm whether the change touches **published** pages or **staged** articles; follow the correct approval flow.
- [ ] Avoid unnecessary dependencies, rewrites, generic layout patterns, and scope creep.

## Engineering and security

- [ ] Inputs and external data are validated at trust boundaries; failures are intelligible.
- [ ] No credentials, personal information, license violations or invented test data added.
- [ ] Analytics, cookies, affiliate links, D1 writes, and external calls remain consent/privacy-safe.
- [ ] Published URLs, catalog entries, search, RSS, sitemap, schema and redirects remain consistent.
- [ ] Any changed hosting/workflow privilege or deployment cost is reviewed.
- [ ] Update `docs/ARCHITECTURE.md`, design guidelines, security notes, and ADRs if core assumptions changed.

## Automated verification

- [ ] `npm run build` succeeds (required **before** content/unit tests because some tests inspect `dist/`).
- [ ] `npm test` succeeds.
- [ ] `npm run editorial:validate` succeeds for editorial changes.
- [ ] Browser tests use a **local** `PLAYWRIGHT_BASE_URL` where appropriate; never mistake a pass against live production for a pass on local changes.
- [ ] Inspect `git diff --check`, `git diff`, and new untracked files.
- [ ] Report checks that were skipped, failed, or unavailable. Root repo has no configured lint or typecheck npm script as of 2026-11-14.

## Content trust, SEO and images

- [ ] Reader gets an actionable answer early, without filler or sales pressure.
- [ ] Review the entire article per `docs/editorial-voice.md`; first-person claims are evidenced.
- [ ] Verify model/OS/version specifics and safety stop conditions with authoritative sources when needed.
- [ ] Images have real provenance, permission, honest labels, dimensions and alt text; no fake product evidence.
- [ ] No invented schema/rating/review/availability metadata; discoverable URLs remain indexable as intended.
- [ ] Owner-approved new articles stay under `editorial/staged/` until scheduled release; unapproved articles are never added directly to public pages.

## Creative and accessibility review

- [ ] Layout has a credible editorial reason, not a generic AI-card/gradient pattern.
- [ ] Four-section color identity and existing typography remain consistent unless redesign approved.
- [ ] Check 320, 390, 768, 1024, 1440 CSS px in both themes for affected screens.
- [ ] Check keyboard/focus order, contrast, headings, descriptive links, reduced motion and overflow.
- [ ] Verify real rendered site and relevant interactions, including fallback/consent-denied states.
- [ ] Browser QA avoids production analytics, merchant click attribution and test purchases.

## Release authority

- [ ] No unapproved public publication, master push/merge, production deployment, destructive operation, or spending.
- [ ] For an approved release, confirm monitoring, rollback route, release owner and production smoke test.
- [ ] Provide completion report: **changed / verified / not verified / risks / next step**.
