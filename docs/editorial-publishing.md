# StackGeist editorial calendar and publishing

The editorial backlog lives in [GitHub Issues](https://github.com/kcasko/stackgeist-site/issues?q=is%3Aissue+label%3Aeditorial). Finished *new* articles stay in a staging folder outside the public site until the approved publication date. GitHub Actions checks the queue, builds and tests the release, commits it, and the existing Cloudflare Pages Git integration deploys it.

## Workflow

1. Create or open an editorial issue. Track its status with stage labels: idea, research, draft, review, approved, scheduled, published.
2. Define the exact reader problem, technical sources, the author's real experiences (if any), useful images or diagrams, and whether a purchase is genuinely necessary.
3. Draft using [the StackGeist voice guide](editorial-voice.md). Review the **entire** finished page. No fake tests, AI filler or unattributed Reddit anecdotes.
4. Stage the finished Astro article at editorial/staged/<slug>.astro. This path is intentionally not built by Astro.
5. Stage any new diagrams at editorial/staged/assets/<slug>/<filename>.svg, and reference their intended /illustrations/<filename>.svg URL in the article.
6. Review the draft locally in a temporary branch: copy it into its final src/pages path, run npm run build, npm test and npm run test:e2e, and remove the local temporary copy before merging the draft to master.
7. After owner review, add an APPROVED queue entry with explicit reviewer, real approval timestamp and publish date. Merge the queue entry and staged files, not the published page.
8. GitHub Actions publishes at most one approved, due new article, runs the build and all checks, commits to master, and Cloudflare Pages builds the site.

**Caution:** Editing an already published article inside src/pages and merging to master will go live immediately. The schedule only controls staged *new* articles, not revisions to live pages.

## Schedule and manual releases

- Monday, Wednesday and Friday, 9:00 AM America/Detroit. GitHub Actions supports timezone-aware cron and daylight saving time.
- GitHub scheduled workflows can be delayed or missed. The next scheduled run picks the oldest approved article whose publishDate is on or before the current Michigan date.
- Nothing approved or due means **nothing is published**. One release maximum per run. Failed tests mean no commit.
- [Publishing workflow](https://github.com/kcasko/stackgeist-site/actions/workflows/editorial-publish.yml): Run workflow, dry_run=true and no slug for a preview.
- To inspect a named approved article, dry_run=true with article_slug filled in.
- To publish an approved article ahead of schedule, dry_run=false **and** article_slug filled in. No name or no approval means no publication.
- Publication is complete only when the subsequent **Cloudflare Pages check** passes and the public article URL loads.

## Local commands

    npm run editorial:check
    npm run editorial:validate
    node scripts/editorial-release.mjs --dry-run --slug printer-offline-windows-11

The editorial:publish npm command stages one release locally. It does not deploy to Cloudflare by itself; do not run against master unless you intend to commit a release.

## Queue data

The production queue is editorial/queue.json. Initially it is empty. GitHub Issues track ideas and research; add a record to the queue only after the finished article has been reviewed.

Example APPROVED entry inside the articles array (this is an illustration, NOT live queue data):

    {
      "slug": "printer-offline-windows-11",
      "status": "approved",
      "section": "fixes",
      "type": "troubleshooting",
      "topic": "wireless",
      "title": "Printer says offline but is connected to Wi-Fi",
      "headline": "Printer says offline in Windows 11: find the actual cause.",
      "dek": "Check the queue, printer IP and connection before reinstalling drivers.",
      "publishDate": "2026-11-16",
      "approvedBy": "kcasko",
      "approvedAt": "2026-11-14T18:00:00-05:00",
      "assets": [
        {
          "source": "editorial/staged/assets/printer-offline-windows-11/printer-path.svg",
          "target": "public/illustrations/printer-path.svg"
        }
      ]
    }

The corresponding staged article goes at editorial/staged/printer-offline-windows-11.astro. When released, that file becomes src/pages/guides/printer-offline-windows-11.astro, its catalog entry is added, any staged illustration is copied into public/illustrations, the queue status changes to published, and the staging files are removed in the publication commit.

Section mappings: fixes -> guides; learning -> certs; labs -> labs; gear -> gear. Version 1 supports flat slugs and new pages; it **refuses to overwrite existing pages or assets**. It validates file paths, review fields, dates, image references, duplicate URLs, and queue structure.

Use editorial:validate on proposed changes before approving a future-dated article. It checks all approved staged files even when their publish date is weeks away.

The machine cannot verify facts or writing voice: those remain human approval requirements.

## Backlog versus publication

Use GitHub Issues for the idea, research, draft and review pipeline. Issue labels never approve publishing on their own; only the reviewed queue entry can release a page. The old [editorial depth audit](../reports/editorial-expansion-roadmap.md) is a separate ledger for improving existing articles.

The GitHub CLI session currently lacks the project permission needed to create a GitHub Projects V2 board. The **labeled Issues backlog** works immediately. A separate Projects board is optional after the owner authorizes that scope.

## Safety and operational limits

- Never put unreleased pages under src/pages or unreleased graphics under public on master.
- The scheduler only commits after build, unit tests, and Chromium browser tests pass.
- A Git push race fails rather than force-pushing over someone else's work.
- GitHub scheduling is best effort; a missed run can be recovered on the next slot or with Publish Now.
- Do not put private customer data, secrets, hotel room numbers, or real WGU assessment content in Issues or drafts.
- If GitHub Actions is disabled or Cloudflare Git integration stops working, automation will not deploy. Monitor the Actions run and Cloudflare Pages checks.
