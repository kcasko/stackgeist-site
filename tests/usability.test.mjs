import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('shared layouts provide a keyboard skip link and pages expose a named main target', async () => {
  // One shell provides the skip link and the main target for every page.
  const shell = await read('src/layouts/Layout.astro');
  assert.match(shell, /class="skip-link" href="#main-content"/);
  assert.match(shell, /<main id="main-content"/);
  assert.match(await read('src/layouts/ContentLayout.astro'), /<Layout /);
  assert.match(await read('src/pages/index.astro'), /<Layout\s/);
});

test('homepage has a semantic primary heading', async () => {
  assert.match(await read('src/pages/index.astro'), /<h1\b/);
});

test('section navigation is always visible and needs no script on mobile', async () => {
  // The four sections fit one row on phones, so there is no hidden menu to open.
  const source = await read('src/components/Header.astro');
  assert.match(source, /<nav class="mast-nav" aria-label="Sections">/);
  assert.match(source, /SECTION_ORDER\.map/);
  assert.match(source, /aria-current=/);
  assert.doesNotMatch(source, /<script/);
  assert.doesNotMatch(source, /mast-nav[^}]*display:\s*none/);
});

test('budget catalog includes search, filtering, status, and section jumps', async () => {
  const source = await read('src/pages/gear/budget-tech/index.astro');
  for (const token of ['data-catalog-search', 'data-catalog-filter', 'data-catalog-status', 'catalog-jumps', 'data-catalog-card']) {
    assert.match(source, new RegExp(token));
  }
});

test('Logitech page uses first-party evidence and puts the retailer link after fit decisions', async () => {
  const source = await read('src/pages/gear/budget-tech/logitech-c920x-hd-webcam.astro');
  assert.match(source, /Logitech — C920x Know Your Product guide/);
  assert.match(source, /logitech\.com\/assets\/66173\/c920x-pro\.pdf/);
  assert.match(source, /Source-checked product decision/);
  assert.match(source, /Do you need it\?/);
  const fit = source.indexOf('Do you need it?');
  const retailer = source.indexOf('tag=deskrespawn-20');
  assert.ok(fit >= 0 && retailer > fit, 'retailer CTA should follow the fit/skip decision');
});

test('content CSS constrains prose to a readable measure', async () => {
  const content = await read('src/styles/site.css');
  assert.match(content, /--measure:\s*68ch/);
  assert.match(content, /\.article-body \{[^}]*max-width:\s*var\(--measure\)/);
});

test('primary navigation goes to hub pages, not deep-linked children', async () => {
  // Header and footer both link the department fronts defined in sections.ts.
  const header = await read('src/components/Header.astro');
  const footer = await read('src/components/SiteFooter.astro');
  const sections = await read('src/data/sections.ts');
  for (const href of ['/guides/', '/labs/', '/learning/', '/gear/']) assert.match(sections, new RegExp(`href: '${href}'`));
  assert.match(header, /SECTIONS\[key\]\.href/);
  assert.match(footer, /SECTIONS\[key\]\.href/);
  for (const src of [header, footer]) {
    assert.doesNotMatch(src, /\/setups\/gaming/);
    assert.doesNotMatch(src, /\/guides\/desk-layout-basics/);
    assert.doesNotMatch(src, /href="\/setups\/?"/);
  }
});

test('setups and guides hub pages exist with h1 and template every setup card', async () => {
  const setups = await read('src/pages/setups/index.astro');
  const guides = await read('src/pages/guides/index.astro');
  for (const src of [setups, guides]) assert.match(src, /<h1\b/);
  assert.match(setups, /\$\{s\.slug\}\.png/);
  for (const slug of ['midnight-shift', 'small-bedroom-gaming', 'budget-gaming-desk', 'gaming']) {
    assert.match(setups, new RegExp(`slug:'${slug}'`));
  }
});

test('gear hub cards and product decision pages only load images from the self-hosted /gear path', async () => {
  const hub = await read('src/pages/gear/index.astro');
  const forbidden = /https?:\/\/[^"'\s]*(?:image\.benq\.com|cdn\.shopify\.com|images\.ctfassets\.net|assets2\.razerzone\.com)[^"'\s]*/i;
  assert.doesNotMatch(hub, forbidden);
  for (const slug of [
    'gear/desk-lighting/benq-screenbar-pro',
    'gear/desk-power/anker-nano-a9196',
    'gear/desk-power/anker-525',
    'gear/desk-surface/steelseries-qck-heavy-xxl',
    'gear/monitor-support/amazon-basics-dual-monitor-arm',
    'gear/connectivity/anker-553-usb-c-hub',
    'gear/desk-lighting/govee-strip-light-2-pro',
    'gear/accessories/razer-base-station-v2-chroma',
  ]) {
    const src = await read(`src/pages/${slug}.astro`);
    assert.doesNotMatch(src, forbidden);
    assert.match(src, /\/gear\//);
  }
});

test('setup detail pages ship a hero illustration with alt text', async () => {
  for (const slug of ['midnight-shift', 'small-bedroom-gaming', 'budget-gaming-desk', 'gaming']) {
    const src = await read(`src/pages/setups/${slug}.astro`);
    assert.match(src, /SetupHero/);
    assert.match(src, new RegExp(`/setups/${slug}\\.png`));
    assert.match(src, /alt="/);
  }
});

test('expanded catalog ships six fit-first product pages with exact affiliate identities', async () => {
  const products = [
    ['src/pages/gear/input/logitech-mx-master-3s.astro', 'B09HM94VDS'],
    ['src/pages/gear/input/keychron-v6-max.astro', 'B0D14LQ9XW'],
    ['src/pages/gear/connectivity/caldigit-ts4.astro', 'B09GK8LBWS'],
    ['src/pages/gear/audio/elgato-wave-3.astro', 'B088HHWC47'],
    ['src/pages/gear/monitor-support/ergotron-lx.astro', 'B00689HXI4'],
    ['src/pages/gear/video/logitech-brio-500.astro', 'B09QW1WVRD'],
  ];
  for (const [path, asin] of products) {
    const source = await read(path);
    assert.match(source, new RegExp(asin));
    assert.match(source, /tag=deskrespawn-20/);
    assert.match(source, /Skip it|skip=/);
    assert.match(source, /makerUrl=/);
  }
});

test('new decision guides are discoverable from both hubs', async () => {
  const guides = [
    'usb-c-dock-compatibility',
    'keyboard-mouse-fit',
    'better-video-calls',
  ];
  for (const slug of guides) {
    const source = await read(`src/pages/guides/${slug}.astro`);
    assert.match(source, /Sources/);
    assert.match(source, /Check|check|measure|verify/);
  }
  // The indexed decision guide is linked from the Gear front. keyboard-mouse-fit and
  // better-video-calls are archived (noindex, see searchScope.ts), so hubs don't promote them.
  const gear = await read('src/pages/gear/index.astro');
  assert.match(gear, /\/guides\/usb-c-dock-compatibility/);
  const scope = await read('src/data/searchScope.ts');
  for (const slug of ['keyboard-mouse-fit', 'better-video-calls']) assert.match(scope, new RegExp(`'${slug}'`));
});

test('editorial provenance distinguishes owned products from sourced research', async () => {

  const evidence = await read('src/components/EvidencePanel.astro');
  assert.match(evidence, /owned-and-used/);
  assert.match(evidence, /researched/);
  assert.match(evidence, /reviewed/);

  const about = await read('src/pages/about.astro');
  const disclosure = await read('src/pages/affiliate-disclosure.astro');
  for (const source of [about, disclosure]) {
    assert.match(source, /personally purchased and used/i);
    assert.match(source, /laboratory test/i);
  }

  const footer = await read('src/components/SiteFooter.astro');

  const sourceChecked = [
    'logitech-c920x-hd-webcam',
    'sennheiser-momentum-4-wireless-noise-cancelling-headphones',
  ];
  for (const slug of sourceChecked) {
    const source = await read(`src/pages/gear/budget-tech/${slug}.astro`);
    assert.match(source, /import EvidencePanel/);
    assert.match(source, /status="owned-and-used"/);
    assert.match(source, /reviewed="2026-10-01"/);
    assert.match(source, /sources=\{\[/);
    assert.match(source, /https:\/\//);
  }

  for (const slug of [
    'iniu-usb-c-to-usb-c-cable-240w-6-6ft',
    'acodot-9-in-1-usb-c-hub',
    '500w-multi-port-gan-charging-station',
  ]) {
    const source = await read(`src/pages/gear/budget-tech/${slug}.astro`);
    assert.match(source, /noindex/);
    assert.match(source, /Research starting point|Research pending|research pending/i);
    assert.doesNotMatch(source, /tag=deskrespawn-20/);
  }
});

test('evidence-backed shortlist prioritizes source-checked pages without shrinking the catalog', async () => {
  const source = await read('src/pages/gear/budget-tech/index.astro');
  assert.match(source, /data-owned-shortlist/);
  assert.equal((source.match(/data-owned-pick/g) || []).length, 2);
  assert.equal((source.match(/<a class="card" data-catalog-card/g) || []).length, 30);
  assert.match(source, /Evidence-backed shortlist/);

  for (const slug of [
    'logitech-c920x-hd-webcam',
    'sennheiser-momentum-4-wireless-noise-cancelling-headphones',
  ]) assert.match(source, new RegExp(`/gear/budget-tech/${slug}`));

  assert.doesNotMatch(source, /Compare cable fit →|Compare with Anker 553 →|Compare ANC tiers →|Compare HDD and SSD fit →/);
});

test('featured owned pages do not retain unsupported precision from legacy copy', async () => {
  const prohibited = new Map([
    ['iniu-usb-c-to-usb-c-cable-240w-6-6ft', [/\$10 cable/i, /third-party PD-tester/i, /90 minutes/i]],
    ['acodot-9-in-1-usb-c-hub', [/~87W/i, /gets warm under sustained load/i, /works reliably across firmware/i]],
    ['logitech-c920x-hd-webcam', [/1080p60/i, /answer for 90%/i, /top 20%/i, /1\/4-inch sensor/i]],
    ['sennheiser-momentum-4-wireless-noise-cancelling-headphones', [/within a few dB/i, /20-30 dB/i, /55-65 hours/i, /works reliably across firmware/i]],
    ['wd-elements-portable-external-hard-drive', [/plug-and-play, reliable/i]],
  ]);
  for (const [slug, patterns] of prohibited) {
    const source = await read(`src/pages/gear/budget-tech/${slug}.astro`);
    for (const pattern of patterns) assert.doesNotMatch(source, pattern, `${slug} retains ${pattern}`);
  }
});
