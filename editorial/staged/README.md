# Drafts stay out of production

Place a finished Astro article at `editorial/staged/<slug>.astro`. It must be written as if its final path were `src/pages/guides/<slug>.astro` (or the correct lab, learning or gear section) so relative imports work after publication.

If you need an original diagram, stage it at `editorial/staged/assets/<slug>/<filename>.svg` and list that source/destination in `editorial/queue.json`; the target should be `public/illustrations/<filename>.svg`.

**Never put unfinished new pages under `src/pages/` or their new assets under `public/`.** Cloudflare can build those immediately when `master` changes. The publisher validates files, approvals, scheduled dates, existing paths and imagery, and moves *one* approved article per scheduled run.

See `docs/editorial-publishing.md` and `docs/editorial-voice.md` before preparing a draft.
