# Release Checklist: [Version / change]

- **Target environment:** [staging/production/platform]
- **Release owner:** [who]
- **Requested/approved by:** [who, when]
- **Scope / user impact:** [what changes]

## Before release

- [ ] Quality checks run with recorded results (`docs/QUALITY_CHECKLIST.md`).
- [ ] Relevant security/privacy/accessibility concerns addressed.
- [ ] Migration strategy, compatibility, and data backup reviewed if applicable.
- [ ] Secrets/config/environment values validated without printing them.
- [ ] Monitoring, expected logs, error alerts, and cost guardrails reviewed.
- [ ] User-visible copy/assets and release notes reviewed.
- [ ] Rollback/recovery method documented and realistically executable.
- [ ] Explicit authorization received for public, production, destructive, or paid changes.

## During release

- [ ] Deploy only the intended ref/version to the intended destination.
- [ ] Record deployment outcome and reference.
- [ ] No unapproved infrastructure, budget, or access changes.

## After release

- [ ] Smoke-test the primary user journey in the actual target environment.
- [ ] Inspect error rate, key logs/metrics, and any relevant usage/cost indicators.
- [ ] Record issues, rollback decision if needed, and handoff.

**Results / evidence:** [links, commands, actual outputs]

**Known unknowns:** [anything not actually verified]
