# StackGeist creative direction and interaction standards

This is a **project-specific art-direction contract**, not instructions to recreate a fashionable AI-generated template. The visual source of truth is `src/styles/site.css`; editorial voice is defined in `docs/editorial-voice.md`.

## Creative thesis

A distinctive, useful computing publication with the curiosity of a late-1990s/early-2000s enthusiast magazine and the clarity of modern technical documentation. It should feel playful, opinionated and crafted by a real editor, **not** like a retro OS simulation or SaaS landing-page factory.

**Audience:** People arriving with a broken device, a configuration problem, an exam question, or a purchase decision. Their immediate question should be answered before decorative content or monetization.

## Existing visual system: preserve, don't reinvent casually

- **Typeface:** Archivo Variable across different width settings. Heavy condensed headlines, expanded label forms, legible normal-width copy. Monospace for actual code and diagnostics, not decorative terminals.
- **Canvas:** Neutral light gray/off-white with dark ink; distinct dark theme. Clear readability in both.
- **Brand:** Yellow Geist mark/highlight (`--geist: #ffcf2e`); other colors have meaning.
- **Four departments:** Fixes (red), Labs (teal), Learning (cobalt), Gear (amber), set via `[data-section]` and CSS custom properties. Their contrast-safe text variants are intentional.
- **Composition:** Square corners, strong rules, slab-like labels, purposeful changes in density/width, asymmetric editorial rhythm. Consistent spacing/tokens without making every page identical.
- **Width:** `--max: 1280px`, readable article measure `--measure: 68ch`, responsive `--page-pad`. Prefer readable copy and useful illustrations.
- **Implementation:** Reuse tokens and proven components; don't add a new CSS framework or design system to solve a single page.

## What to avoid

Do not default to centered full-height hero + two CTAs, repeating rounded bento grids, glassmorphism, ornamental glows, stock-looking AI people, giant empty whitespace, fake benchmark charts, fake hardware product photos, or generic terminal aesthetics. No repeated section scaffolding such as “Overview / Benefits / Key Takeaways” on every guide. Avoid cookie-cutter styling disguised with a new palette.

These aren't categorical technology bans: a card, gradient, or animation must earn its place by solving a specific hierarchy or interaction problem.

## Page-specific compositions

- **Troubleshooting guide:** State the likely issue, safe first check, observable branches, exact steps, failure/stop points. A decision tree, photograph, table or flowchart is useful only when it makes the diagnosis clearer.
- **Lab write-up:** Start with goal, topology/constraints, commands, checkpoints, failures and recovery. Genuine diagrams and actual interface captures where accuracy matters.
- **Exam/study guide:** Concepts, concrete scenarios, meaningful headings, diagrams for difficult distinctions; avoid fake claims about questions seen on a certification exam.
- **Gear comparison:** Show compatibility requirements and evidence first; disclose affiliate interest. No fabricated personal testing, prices, performance data, or consent to rehost product photos.

Use different compositions for different content needs but retain the four-department taxonomy and navigation patterns.

## Imagery, evidence and provenance

Read `docs/image-policy.md` before editing assets. Use realistic, properly art-directed computing photography when illustrative, meaningful original diagrams when explanatory, and **real screenshots** for exact UI instructions. Clearly distinguish illustrations from proof or owned hardware. Preserve licensing, credits and source records. Avoid baked-in slogans/logos/text in generated editorial imagery.

## Accessibility and QA

- Semantic landmarks/headings, keyboard-friendly menus, high-visible focus, descriptive links and useful image alt text.
- WCAG 2.2 AA where applicable, including color contrast, reduced motion, readable line length and minimum touch target considerations.
- Test 320, 390, 768, 1024 and 1440 CSS px in light and dark themes. Check navigation, keyboard focus, text wrapping, overflow, privacy/consent states and console errors.
- Test real rendered output, not just component source. A visual change without browser evidence should be reported as not visually verified.
- Never send real affiliate click events or production analytics as part of screenshot automation. Read README's `/?audit=1` guidance.

## Choosing a new direction

For a substantial redesign, write two or more genuinely different concepts in `docs/templates/DESIGN_CONCEPT_REVIEW.md` and compare readability, audience fit, originality, implementation cost and accessibility. Obtain owner direction before discarding established identity. For targeted UI fixes, preserve what's working and apply a restrained local solution.

**Creative quality test:** Would this still look intentional without a gradient, and can a reader solve the problem in the first minute?
