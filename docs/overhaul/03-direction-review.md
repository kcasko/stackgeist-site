# Representative implementation: homepage and USB-C dock fix

This is for review before the identity is applied to the other pages. Screenshots are in [review/](review/), at desktop 1440 px and mobile 390 px, in light and dark.

## The identity

- **Base:** a neutral light grey (`#f1f1ee`) with white surfaces and near-black ink. Dark mode follows the system setting, and `data-theme` on `<html>` overrides it.
- **Colour:** each department has one colour, used on its nav tab, rules, slab labels, and step blocks.
  - Fixes is red `#df3f28`.
  - Labs is teal `#0b8774`.
  - Learning is cobalt `#3557d4`.
  - Gear is amber `#f09a0b`.
  - Geist yellow `#ffcf2e` is the brand colour. It also marks link hover, selection, focus, and "owned and used" evidence.
  - A four-colour stripe under the masthead ties the sections together.
- **Type:** one self-hosted variable font, Archivo (90 KB, latin). Headlines are condensed at weight 850–900, labels are expanded caps, and reading text is normal width. Monospace is kept for code.
- **The Geist:** the pixel-ghost mascot has a cable for a tail that ends in a plug. It appears in the logo tile, in "Geist note" asides (`.note`), and on the homepage "who's behind the ghost" block.
- **Shapes:** square corners, 2–3 px ink borders, and hard offset shadows in the department colour. These are used on the lead story and the quick-fix box only. There are no gradients, glass effects, or rounded cards.

## What each page shows

**Homepage**
- **Lead story:** a photo with an overlapping headline panel.
- **Two image stories** with different crops, plus a "Just updated" column built from catalog dates.
- **"Fix it before you buy it":** a dense, numbered dark panel.
- **Each department in its own layout:**
  - Fixes is a topic index with counts.
  - Labs is a two-column list with labels.
  - Learning is a ruled list of course reviews and certification pages.
  - Gear is a spec table with an evidence column.
- **About strip and newsletter.**

**USB-C dock article**
- Section slab and topic, a condensed headline, and a meta line that states the evidence basis ("Based on manufacturer documentation, not a bench test").
- A captioned hero image and a "Quick fix" box.
- The diagram, repainted for the light page.
- Numbered step blocks, with a sticky right rail holding contents, hardware links, and related pages. On phones the contents list moves under the quick fix.

## How it's built

- `src/styles/site.css` is the only stylesheet. Old variable names are mapped onto the new tokens, so existing components still render.
- `src/data/catalog.ts` and `src/data/sections.ts` are the single list of pages. The homepage, footer, search, the Learning front, and related links all read from them.
- `ContentLayout` has an opt-in `feature` prop. Only the USB-C dock article uses it. It builds step numbers, ids, and the contents list at build time, so nothing shifts on load.
- New pages:
  - `/search/` lists every page in HTML and filters client-side. It is noindexed and kept out of the sitemap.
  - `/learning/` is a provisional Learning front.
- The Pinterest "Privacy choices" control moved from a floating button into the footer.
- `astro.config.mjs` keeps scripts external. Inlining had copied the affiliate script's tag string into research pages that must not carry it.

## Image labelling (updated 2026-11-06)

- Generated desk and rack scenes are decorative, so they carry no caption or badge. Their alt text describes them accurately, and they are never used as evidence on product, lab, or owned-product pages.
- Manufacturer images carry a short credit, for example "Product image: Sennheiser".
- Wikimedia Commons photos carry the one-line attribution their licence requires, for example "Example photo · author, licence, Wikimedia Commons". Photos of the exact model name the model instead of "Example photo".
- The external-SSD guide's diagram keeps "not a screenshot", because it draws a Windows window.

## Not yet done (waiting on review)

- The other 194 pages already use the new tokens and base styles, because the stylesheet is shared. Their markup and layouts have not been reviewed in this identity. Hub pages, product pages, kits, setups, and legal pages need their own pass.
- The section fronts for Fixes, Labs, and Gear still use their old markup.
- The homepage topic lists are in catalog order, not curated order.
- Images are still draft resolution, about 980 px wide.
