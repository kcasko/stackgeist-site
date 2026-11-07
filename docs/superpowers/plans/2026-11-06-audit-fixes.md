# StackGeist audit fixes implementation plan

**Goal:** Resolve all 22 audit findings with targeted changes, preserving existing work and documenting external verification dependencies.

**Architecture:** Keep Astro's static pages, existing catalog and shared components. Use small tested helpers for search, breadcrumbs, consent and attribution. Retain original illustrations and factual firsthand content. Do not invent ownership, permissions, contact deliverability, account settings, prices or rich-result fields.

**Tech stack:** Existing Astro/TypeScript, Node tests, Cloudflare Pages, Python PDF tooling.

**Spec:** reports/comprehensive-audit-2026-11-06/REPORT.md and FINDINGS.md. The user's instruction to complete all fixes approves this targeted plan.

## Constraints

- Preserve the four existing tracked edits and all original untracked work.
- No commits, pushes, deployment, real subscriptions, conversions or messages without authorization extending to those actions.
- Leave historical audit evidence intact; record implementation results separately.
- Source/API fixes are test-first where behavior changes. Prose and reversible styling corrections use appropriate output/browser checks.

## Execution

- [x] SG-01/02: correct DisplayLink and TS4 statements, including schema and catalog revision dates.
- [x] SG-04/11/12: make privacy and contact copy truthful, finish editorial policy text, verify/configure newsletter ownership/branding where access permits.
- [x] SG-06/07/08/15: preserve and regression-test existing responsive/contrast/focus/beacon fixes.
- [x] SG-10/13/16/21: test then fix breadcrumb destinations, AD aliases, storage failures and landmark names.
- [x] SG-09/14: correct paid source-link handling, offer identifiers, noncommercial classifications and test-traffic exclusion without collecting extra personal data.
- [x] SG-03: replace stale PDF copy with dated, sourced, safe guidance; render and inspect the final files at the existing URLs.
- [x] SG-05/20: record image provenance, replace unverified imagery with clearly labeled original illustrations where rights cannot be established, and add intrinsic dimensions without changing URLs/page intent.
- [x] SG-17/18/19/22: patch reachable dependency advisories deliberately, disable unsupported submissions, add tested security headers and document honest rich-result scope.
- [x] Run build, full tests, route/asset/schema checks and responsive/theme/accessibility/browser regressions. Review the diff and map each finding to final evidence or a specific unresolved external dependency.

## Review focus

Storage getters can throw before a helper is entered; consent must default off and remain operable. Breadcrumbs must resolve in the built output, not merely parse. Event changes must preserve historical rows and existing tracking IDs. Image substitution must never imply a real product photo or test. Account facts need verification, and local fixes do not prove a live release.

## Pending external verification

- [x] Authorize and release the reviewed build to Cloudflare Pages production, then verify the actual production headers, redirects, analytics beacon count, homepage and site signup.
- [x] Verify Kit inbox delivery, confirmation and unsubscribe with an authorized test address. Support mailbox delivery is a separate optional check.