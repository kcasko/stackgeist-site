## What changed?
Link the relevant editorial issue and summarize the reader problem.

## Before merging
- [ ] Clear answer early, no generic filler.
- [ ] Whole-article pass using `docs/editorial-voice.md`.
- [ ] Technical steps and vendor/OS/version claims verified.
- [ ] Firsthand experiences distinguished from sourced research and Reddit anecdotes.
- [ ] Diagrams/screenshots are useful, correctly labeled, and accessible.
- [ ] Safe stop conditions and no unnecessary product recommendations.
- [ ] Links, responsive layout, SEO metadata, and build/tests checked.
- [ ] New scheduled articles remain in `editorial/staged/` until released.
- [ ] Explicit `kcasko` approval recorded before scheduling.

**Note:** Merging changes to published pages in `src/pages/` deploys immediately. Only new articles staged outside `src/pages/` participate in the scheduled publisher.

## Engineering and design evidence

- [ ] Scoped change; existing routes/functionality and unrelated local work preserved.
- [ ] `npm run build` passes before `npm test`; `npm run editorial:validate` when relevant.
- [ ] For UI changes: real browser review at relevant widths, both themes, keyboard/focus, consent, and console checks.
- [ ] For new assets: provenance, permission, alt text, image dimensions and accurate captions recorded.
- [ ] For API/analytics/workflow changes: input validation, secrets, privacy and minimum privileges reviewed.
- [ ] Any skipped checks, risks, and rollback instructions documented below.

**Actual checks run (commands and results):**

**Not verified / known risks:**

**Owner approval required for publish/deploy?** Yes / No. Explain:
