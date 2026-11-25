# StackGeist repository instructions for GitHub Copilot

Read and honor `AGENTS.md` as the canonical standard, including its existing editorial scheduling, privacy, Astro, and approval rules. This is a live Astro/Cloudflare Pages publication, not a generic SaaS starter. Inspect files and `git status` before edits; preserve routes, existing designs, uncommitted work, and user-facing behavior.

For visual work read `docs/DESIGN_GUIDELINES.md`; preserve purposeful four-department colors, Archivo typography and the editorial identity without slipping into bento-grid/gradient/glassmorphism templates. For content follow `docs/editorial-voice.md`, `docs/editorial-publishing.md`, and `docs/image-policy.md`; never invent firsthand evidence.

For code follow `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, and `docs/QUALITY_CHECKLIST.md`. Run `npm run build` before `npm test` and use a local base URL for browser tests. Report verified results and remaining risks. No credentials in Git. No public publishing, production deploys, pushes or destructive work without explicit authorization.
