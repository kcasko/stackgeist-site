# Gear page provenance inventory

Generated during the affiliate-growth overhaul on 2026-11-07.

## Scope

This inventory covers the **active catalog products** listed in `src/data/catalog.ts` plus the **top-priority content-plan products** from `stackgeist-content-plan.md`. Archived or noindexed gear pages are noted separately but are not the focus of this phase.

## Active catalog products

The active gear catalog grew from 5 to 11 products during this overhaul.

| Page | Product | Status | Image | Image source | Affiliate destination | Notes |
|---|---|---|---|---|---|---|
| `/gear/connectivity/anker-553-usb-c-hub/` | Anker 553 8-in-1 USB-C hub (A8380 / A83800A1) | Researched | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B0874M3KW4?tag=deskrespawn-20 | Anker spec source cited. Dual HDMI, 85 W pass-through. |
| `/gear/connectivity/caldigit-ts4/` | CalDigit TS4 Thunderbolt 4 dock | Researched | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B09GK8LBWS?tag=deskrespawn-20 | CalDigit spec source cited. 18 ports, 98 W PD, 2.5 GbE. |
| `/gear/input/logitech-mx-master-3s/` | Logitech MX Master 3S | Researched | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B09HM94VDS?tag=deskrespawn-20 | Logitech source cited. Right-handed caveat present. EvidencePanel added. |
| `/gear/budget-tech/sennheiser-momentum-4-wireless-noise-cancelling-headphones/` | Sennheiser Momentum 4 Wireless | Owned and used | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B0B6GHW1SX?tag=deskrespawn-20 | Owner notes + FAQ structured data. Real product photo needed. |
| `/gear/budget-tech/wd-my-passport-4tb/` | WD My Passport 4 TB portable drive | Owned and used | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon search link (generations vary) | Owned notes, fake-capacity warning. Real product photo needed. |
| `/gear/desk-power/anker-nano-a9196/` | Anker Nano Charging Station A9196 | Source-checked | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B0FFGZH2S2?tag=deskrespawn-20 | Strong page with Anker spec source. Added to active catalog. |
| `/gear/desk-lighting/govee-strip-light-2-pro/` | Govee Strip Light 2 Pro H61F6 | Source-checked | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B0D7MHH79D?tag=deskrespawn-20 | Page reviewed; ASIN verified. Added to active catalog. |
| `/gear/desk-lighting/benq-screenbar-pro/` | BenQ ScreenBar Pro | Source-checked | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B0CZ9P1QW9?tag=deskrespawn-20 | Page reviewed; ASIN verified. Added to active catalog. |
| `/gear/desk-surface/steelseries-qck-heavy-xxl/` | SteelSeries QcK Heavy XXL | Source-checked | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B00WAA2704?tag=deskrespawn-20 | Page reviewed; ASIN verified. Added to active catalog. |
| `/gear/accessories/razer-base-station-v2-chroma/` | Razer Base Station V2 Chroma | Source-checked | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B08J5WQTL5?tag=deskrespawn-20 | Page reviewed; ASIN verified. Added to active catalog. |
| `/gear/monitor-support/amazon-basics-dual-monitor-arm/` | Amazon Basics Dual Monitor Arm (DS-MADDBE) | Source-checked | `/gear/catalog-illustration.svg` | Generic StackGeist illustration | Amazon dp/B0CQXPGNCH?tag=deskrespawn-20 | Rewritten from research-pending. Specs verified against Amazon listing and manuals.plus. Added to active catalog. |

## Image policy status

All active and featured gear pages currently use the generic `/gear/catalog-illustration.svg` artwork with an explicit "Illustration only" caption. This is the correct fallback after the 2026-11-06 audit removed 145 Amazon/manufacturer images that lacked documented reuse permission.

### Products that need original photographs

- WD My Passport 4 TB (owned)
- Sennheiser Momentum 4 Wireless (owned)
- Anker Nano A9196 (if purchased)
- Logitech MX Master 3S (if purchased)
- Amazon Basics dual monitor arm (if purchased)

### Products that need manufacturer-provided assets with documented permission

- CalDigit TS4
- Anker 553 hub
- Govee Strip Light 2 Pro
- BenQ ScreenBar Pro
- SteelSeries QcK Heavy XXL
- Razer Base Station V2 Chroma

## Affiliate link verification

- Amazon Associates tag: `deskrespawn-20`.
- All active product pages use a single disclosed Amazon CTA with `rel="sponsored nofollow noopener noreferrer"`.
- Tracking attributes (`data-affiliate-link`) are present on `ProductDetailSimple` CTAs.
- `VerifiedLightingRoutes.astro` paid buttons now carry `data-affiliate-link="amazon"` and `data-affiliate-placement="verified-lighting-routes"`.

## Known issues

1. **No real product photography** on active pages. Per `docs/image-policy.md`, real photos are required only for owned hardware; researched pages may use manufacturer assets with documented permission.
2. **WD My Passport** uses an Amazon search link rather than a single ASIN because the product spans multiple generations.
3. ~~MX Master 3S does not use EvidencePanel~~ — **fixed**.
4. ~~Amazon Basics dual monitor arm is a noindex research-pending page~~ — **fixed**.
5. ~~VerifiedLightingRoutes.astro lacks affiliate tracking attributes~~ — **fixed**.

## Out-of-scope archived products

Approximately 52 archived/noindexed gear pages exist under `src/pages/gear/`. Many lack images or have removed affiliate CTAs. They are intentionally not indexed and are not part of this overhaul.
