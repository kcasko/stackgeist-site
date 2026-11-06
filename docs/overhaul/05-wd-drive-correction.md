# Correction: the owned WD drive is a My Passport 4TB, not an Elements 5TB

The owner confirmed on 2026-11-06 that the drive they own is a **WD My Passport 4TB**. Their image shows the diagonal-stripe 2019 design; black is model WDBPKJ0040BBK-WESN. Confirm the exact model on the drive's label. The site currently says the owned drive is a **WD Elements Portable 5TB** (WDBU6Y0050BBK-WESN) in these places:

## Firsthand claims (must change)

| Where | What it says |
|---|---|
| `src/pages/gear/budget-tech/wd-elements-portable-external-hard-drive.astro` | The whole page: title "WD Elements 5TB: notes from owning one", "Owned since January 2026", model WDBU6Y0050BBK-WESN, ASIN B07X41PWTY, "5 TB" tags, "A 5 TB drive shows as roughly 4.5 TB in Windows", product schema, Amazon link, and the evidence panel |
| `src/pages/guides/back-up-windows-pc-before-replacing-drive.astro:77` | "I own a 5 TB WD Elements portable hard drive" |
| `src/pages/labs/homelab-equipment-for-beginners.astro:32` | "I own a 5 TB WD Elements portable hard drive" |
| `src/pages/labs/homelab-equipment-for-beginners.astro:116` | "I own the WD Elements drive mentioned above" |

## Listings that point at the owned-drive page

| Where | What it says |
|---|---|
| `src/data/catalog.ts` (around line 594) | Title "WD Elements 5TB portable drive", headline, and dek |
| `src/pages/gear/index.astro:8` | "Owned and used", "Owned since January 2026" |
| `src/pages/index.astro:42` | Homepage gear table: "Owned and used" |
| `src/components/SiteFooter.astro` | Gear column links the page by its catalog title |

## Not ownership claims (no change needed)

These cover WD Elements drives in general, for readers who own one, and are accurate as written:

- `guides/wd-elements-not-showing-up`
- `gear/budget-tech/compare/wd-elements-vs-samsung-t7`
- The storage guides that mention Elements as an example

## Image

- No official image could be fetched. westerndigital.com refuses automated requests.
- Wikimedia Commons only has photos of the **My Passport Ultra**, a different, metal-cased model.
- `Pictures/AI Generated/downloaded/wd_elements_4tb.jpg` is the right design but has an unknown source.
- **Best option:** a phone photo of the owner's own drive, which also supports the "Owned and used" label.

## Decision needed

The product page's URL is `/gear/budget-tech/wd-elements-portable-external-hard-drive/`. Rewriting it for the My Passport means either:

- keeping that URL with My Passport content, which is confusing; or
- creating `/gear/budget-tech/wd-my-passport-4tb/` and adding a 301 redirect from the old URL. This is recommended.

Firsthand details need the owner's input: when it was bought, what it's used for, and Windows's reported capacity (a 4 TB drive shows about 3.63 TB).
