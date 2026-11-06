# StackGeist overhaul: audit and plan

Branch: `redesign/editorial-overhaul`, cut from `origin/master` at `c28007b` on 2026-11-06.

## Which checkout

The brief names `E:\Repos\stackgeist\stackgeist-site`. That checkout is on `seo-compare-schema-and-gsc`, 35 commits behind `origin/master`, and has uncommitted Pinterest and marketing edits. It is missing the v2 design rollout, the kit-to-guide merges, the WGU pages, and the SVG illustration set. The owner chose to do the work in `D:\Repos\stackgeist-site`, which is a clean checkout of `master`. Nothing was changed in the `E:` checkout.

## Stack and baseline

- Astro 7.2, static output, Cloudflare Pages. There are Pages Functions under `functions/` and a D1 database for affiliate events. No UI framework and no CSS tooling.
- The build produces 195 pages in about 4 s. `npm test` runs 54 `node:test` checks on the built `dist/` output, and all 54 pass.
- The sitemap has 86 URLs: 43 guides, 15 kits, 8 labs, 6 certs, 6 gear, plus the home and legal pages.

## Inventory

| Area | Routes | Status |
|---|---|---|
| Fixes (`/guides/`) | 43 guide pages, 5 topic hubs (`guides/[slug]`), and the hub | Core content, indexed. Four desk-styling guides are noindexed. |
| Labs (`/labs/`) | 7 labs and the hub | Firsthand. Indexed. |
| Learning (`/certs/`) | A cert comparison, which is also the hub, Security+ v7/v8, 3 WGU course reviews, and the WGU degree page | Firsthand WGU content. Indexed. |
| Gear (`/gear/`) | 5 kept product pages, about 50 archived product pages, and 10 compare pages | Most are noindexed by `searchScope.ts`. |
| Kits (`/kits/`) | 54 kit records, 15 indexable, 15 already 301-redirected | Thin, shopping-led content. |
| Setups (`/setups/`) | 4 hand-built and about 10 generated gaming setups | Noindexed, but Pinterest pins still link to them. |
| Other | about, contact, privacy, affiliate disclosure, 404, rss, sitemap, `native-iptv/privacy` | |

**Traffic and backlinks.** The domain is three months old. The D1 baseline from 25 September shows landings on `/`, `/setups/small-bedroom-gaming/`, `/gear/monitor-support/ergotron-lx/`, and `/kits/`. Pinterest pins point at `/setups/midnight-shift`, `/setups/small-bedroom-gaming`, `/setups/budget-gaming-desk`, `/guides/cable-management`, and about 20 guides. No Search Console export is in the repo. **Decision:** this pass removes no URLs. Archived areas stay online and noindexed, and pinned URLs keep working.

## Findings

1. **Two design systems are stacked on top of each other.** `global.css` and `content.css` hold the original terminal theme: monospace everywhere, a blinking cursor after every H1, `$ pwd` breadcrumbs, `[executive-summary]` labels, scanlines, and purple plus lime-green. `v2.css` sits on top with about 30 `!important` overrides to make that theme readable. Every page ships both.
2. **The visual identity is the AI cliché the brief rules out.** It has purple accents, neon-green "phosphor", `sg@local:~/` command-prompt branding, a `$ find --fix` header button, a footer written as `tree` output with a glowing "systems nominal" dot, and the same dark SVG thumbnail on most cards.
3. **Labels don't match.** Breadcrumbs say "Guides" on 41 pages and "Fixes" in the nav. The nav says "Certs" while the brief wants "Learning". Some breadcrumbs start at "StackGeist" and some don't, and some link `/guides` without the trailing slash, so they hit a redirect.
4. **Lists are duplicated by hand.** Article lists are hand-written separately on the homepage, the Fixes hub, the Labs hub, `labs.ts`, and the RSS feed. Titles and descriptions have already drifted apart.
5. **Dead components.** `ComparisonAffiliateCta`, `FeaturedSetup`, `MindMap`, and `Welcome` are imported nowhere.
6. **There is no site search,** even though the brief asks for it.
7. **Images.**
   - The 18 SVG illustrations are original and accurate, but every one is a dark-purple "plate". Thumbnails are reused on cards (`topic-wireless` appears twice on the homepage).
   - Three Gear cards hotlink `m.media-amazon.com` images. That adds a third-party request, gives no size control, and can break the Associates image rules.
   - Inline diagram SVGs embed `<style>` blocks with one-letter class names (`.t`, `.m`, `.box`). Those leak into the global stylesheet.
8. **Article layout is consistent at the markup level.** 56 articles share one class vocabulary (`article-page`, `article-summary`, `article-body`, `article-cards`, `article-list`, `article-steps`, `note`, `cards`). A new stylesheet aimed at these classes can restyle every article without rewriting the pages. That is the main lever for this overhaul.
9. **Metadata is solid.** Canonicals, the sitemap, robots, Article, HowTo, FAQ, and Product schema, and breadcrumb JSON-LD are all in place. One gap: breadcrumb names are derived from the URL slug, so they read "Guides" and "Certs".
10. **Accessibility is mostly sound.** There is a skip link, the menu responds to Escape, and focus styles exist. The mobile menu doesn't trap focus. Body text at 12.5–13.5px in v1 areas is too small.

## Image pack review

These are 5 WebP files at about 984×792 with heavy compression and sharpening.

| File | Verdict |
|---|---|
| `labs-network-rack` | Usable at 1× width up to about 490 CSS px. Has no text. Gear is generic and plausible. |
| `fixes-usb-c-dock` | Usable at small sizes. The port layout (2× HDMI, 2× USB-A, RJ45) is plausible. The laptop brand text is garbled, so crop or keep it small. |
| `learning-study-desk` | Usable once the 20 px white strip at the left edge is cropped off. Text is baked in ("CompTIA", "Microsoft", "AWS", a handwritten checklist). It is spelled correctly and is the subject, so it is kept with a caption. |
| `homepage-retro-computing` | The top book spine is garbled, an AI tell. A crop below that spine keeps the readable "Networking / Windows Internals / Linux / System Administration" stack, the CRT, and the mug. Usable at 1× only. |
| `gear-external-drive` | **Not used.** It is a generated render of a real branded product (WD Elements) next to a page that describes the owner's real WD Elements. It would read as photographic evidence. A real photo is needed. |

Every generated photo is captioned "Generated illustration", so none of them passes as a photo of tested equipment.

## Design direction: "the shop manual"

StackGeist should read like a well-edited enthusiast computing magazine from the era of beige towers and CRTs. Treat that era as editorial discipline, not as a costume.

- **Paper, ink, and one signal colour.** The base is a warm off-white page with near-black ink. The single accent is a signal red-orange, the colour of a service sticker. Each of the four sections gets a department colour, used only on its label tab and rule.
- **Type that fits the era.** Headlines are set in a serif (the Charter, Iowan, Georgia stack). Georgia and Verdana were the web's own early-2000s typefaces, and they cost nothing to load. Body text uses the system sans. Department labels are small caps. Monospace is reserved for code and command output.
- **Structure from rules, not cards.** Use hairline and double rules, column layouts, and a department tab on every page. Article lists are typographic indexes with section, title, and summary. Images appear only where they say something.
- **The brand mark is a pixel ghost** (the "geist") in a small square. It is the logo, not a filler icon.
- **Dark mode** follows `prefers-color-scheme`. Diagrams sit on a deliberate dark "plate" in both themes, so the existing accurate SVGs stay legible.

## Plan

1. **Design system.** Replace `global.css`, `content.css`, and `v2.css` with one token-based `site.css`. Add new shared components: Masthead, mobile menu, Breadcrumbs, SiteFooter, Department label, Search, ArticleIndex, and Byline.
2. **Single source of truth.** Add `src/data/catalog.ts`, which lists every published page with its section, type, title, summary, date, and image. The homepage, hubs, related links, search index, and RSS read from it.
3. **Pages.** Rebuild the homepage and the four section hubs. Add `/learning/` as the Learning hub and leave `/certs/…` URLs unchanged. Keep `/guides/` as the URL behind the "Fixes" label.
4. **Articles.** Restyle all articles through the shared classes. Fix breadcrumb labels. Give troubleshooting, lab, certification, and product pages distinct headers.
5. **Images.** Re-palette the SVG illustration generator. Add the three usable generated photos at their native size with captions. Write the missing-image report.
6. **Cleanup.** Delete dead components. Fix breadcrumb JSON-LD names. Stop hotlinking Amazon images where a local file exists. Check internal links.
7. **Tests and QA.** Extend the tests for the new IA, search index, and image rules. Review at desktop and mobile widths.
8. **Final cohesion review and report.**

URLs that must keep working: every current route, plus the 15 existing redirects. None is removed in this pass.
