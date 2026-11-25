# StackGeist security, privacy and release risks

This is an engineering threat-model baseline based on repository inspection (2026-11-14), **not** a completed security audit or validation of Cloudflare's live settings.

## Exposed assets and trust boundaries

- **Public pages:** untrusted readers, link destinations, search behavior, static assets, third-party analytics and affiliate outbound links.
- **Analytics collection:** `POST /api/events` handled by `functions/api/events.ts`. JSON type, schema, origin, body size and bounded fields are checked in source. A request without an `Origin` header is not automatically rejected. Review rate-limiting and abuse controls against deployed configuration; do not infer protection from source alone.
- **Data:** Cloudflare D1 `AFFILIATE_DB` stores event metadata. Source code includes 90-day cleanup in the write path. Confirm actual retention policy, backups and external observability separately.
- **Build/publishing:** GitHub workflows can approve, commit and indirectly deploy articles. Treat workflow permissions, branch protections, editorial queue approvals and secret handling as sensitive.
- **External tooling:** Cloudflare Pages, analytics, affiliate programs and the separate Pinterest Worker can incur privacy, supply-chain, account or cost risk.

## Required controls

1. **No secrets in Git or generated pages.** `PUBLIC_*` is client-visible. Keep local `.env`, `.dev.vars*`, tokens and keys out of commits. Use Cloudflare/GitHub supported secret stores and least-privilege rights.
2. **Treat analytics input as untrusted.** Bound body length and field sizes, validate event shape server-side, use D1 bound parameters, consider bot/replay abuse, and avoid logging personal details.
3. **Minimize tracking.** Do not add hidden conversion tracking, unnecessary analytics, fake consent, or test affiliate click events. Respect privacy disclosures and suppression during QA.
4. **Preserve reader safety and provenance.** Technical recovery instructions should warn before destructive operations. Never pass generated images off as owned/tested devices. Store media permissions and credit details under the established image policy.
5. **Safe CI and publishing.** Read-only checks run with `contents: read`; do not execute untrusted PR code with publishing credentials. Scheduled publisher retains its explicit owner-approval gates and production-specific permissions.
6. **Dependency changes:** Review security advisories, license and maintenance. Use `npm ci` with committed lockfile and review the separate Worker manifest independently.
7. **Live rollbacks/cost:** Verify Cloudflare deployment and D1 backup/restore methods with owner before changing data or deployments. Never assume a local static build tests Pages Functions.

## Risk questions before changing sensitive functionality

- Could an automated client flood `/api/events` or forge attribution without bypassing the current schema checks?
- Could changes expose third-party identifiers or credentials in generated HTML, logs or browser traces?
- Does an article change create a real-world safety risk (data loss, electrical hazard, account compromise) or a licensing problem?
- Can any PR/workflow publish staged content without explicit approval?
- Is a rollback or revocation path known for the changed Cloudflare binding, GitHub secret, affiliate destination or API?

## Open items: verify, don't assume

- Production rate limits/WAF rules for the analytics endpoint.
- Live GitHub branch protection, workflow token permissions, release approvals, Cloudflare secrets and environment separation.
- D1 backups, retention actually enforced independently of writes, and incident response monitoring.
- Dependency scanner results and Pinterest Worker secrets/permissions.

Document discovered issues with severity, evidence, owner and status; avoid publishing exploit details.
