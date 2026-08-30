import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('shared layouts provide a keyboard skip link and pages expose a named main target', async () => {
  for (const path of ['src/layouts/Layout.astro', 'src/layouts/ContentLayout.astro']) {
    assert.match(await read(path), /class="skip-link"/);
  }
  assert.match(await read('src/layouts/ContentLayout.astro'), /id="main-content"/);
  assert.match(await read('src/pages/index.astro'), /id="main-content"/);
});

test('homepage has a semantic primary heading', async () => {
  assert.match(await read('src/pages/index.astro'), /<h1\b/);
});

test('interactive mind map is not hidden from assistive technology', async () => {
  const source = await read('src/components/MindMap.astro');
  assert.doesNotMatch(source, /<pre[^>]*aria-hidden="true"[^>]*>[\s\S]*?<button/);
  assert.match(source, /aria-controls=/);
});

test('mobile menu exposes state, relationship, and focus-safe close behavior', async () => {
  const source = await read('src/components/Header.astro');
  assert.match(source, /aria-controls="mobile-menu"/);
  assert.match(source, /id="mobile-menu"/);
  assert.match(source, /Close menu/);
  assert.match(source, /toggle\.focus\(\)/);
});

test('budget catalog includes search, filtering, status, and section jumps', async () => {
  const source = await read('src/pages/gear/budget-tech/index.astro');
  for (const token of ['data-catalog-search', 'data-catalog-filter', 'data-catalog-status', 'catalog-jumps', 'data-catalog-card']) {
    assert.match(source, new RegExp(token));
  }
});

test('Logitech page uses the catalog image and decision jump navigation', async () => {
  const source = await read('src/pages/gear/budget-tech/logitech-c920x-hd-webcam.astro');
  assert.match(source, /71YN85pLGcL/);
  assert.doesNotMatch(source, /71YmyIWpVOL/);
  assert.match(source, /class="decision-nav"/);
  for (const id of ['verdict', 'specs', 'compatibility', 'alternatives', 'buy-or-skip']) {
    assert.match(source, new RegExp(`id="${id}"`));
  }
});

test('content CSS constrains prose and preserves mobile intent context', async () => {
  const content = await read('src/styles/content.css');
  const map = await read('src/components/MindMap.astro');
  assert.match(content, /max-width:\s*76ch/);
  assert.doesNotMatch(map, /\.node-intent,\s*\.leaf-note\s*\{\s*display:\s*none/);
});

test('primary navigation goes to hub pages, not deep-linked children', async () => {
  const header = await read('src/components/Header.astro');
  const footer = await read('src/components/SiteFooter.astro');
  assert.match(header, /href:'\/setups'/);
  assert.match(header, /href:'\/guides'/);
  assert.doesNotMatch(header, /href:'\/setups\/gaming'/);
  assert.doesNotMatch(header, /href:'\/guides\/desk-layout-basics'/);
  assert.match(footer, /href="\/setups"/);
  assert.match(footer, /href="\/guides"/);
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
  const gear = await read('src/pages/gear/index.astro');
  const map = await read('src/components/MindMap.astro');
  for (const slug of guides) {
    assert.match(`${gear}\n${map}`, new RegExp(`/guides/${slug}`));
  }
});

test('editorial provenance distinguishes owned products from sourced research', async () => {
  const methodology = await read('src/pages/editorial-methodology.astro');
  for (const token of ['Owned & used', 'Researched', 'Corrections', 'Affiliate independence']) {
    assert.match(methodology, new RegExp(token.replace('&', '&(?:amp;)?')));
  }

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
  assert.match(footer, /href="\/editorial-methodology"/);

  const featured = [
    'iniu-usb-c-to-usb-c-cable-240w-6-6ft',
    'acodot-9-in-1-usb-c-hub',
    'logitech-c920x-hd-webcam',
    'sennheiser-momentum-4-wireless-noise-cancelling-headphones',
    'wd-elements-portable-external-hard-drive',
  ];
  for (const slug of featured) {
    const source = await read(`src/pages/gear/budget-tech/${slug}.astro`);
    assert.match(source, /import EvidencePanel/);
    assert.match(source, /status="owned-and-used"/);
    assert.match(source, /reviewed="2026-08-30"/);
    assert.match(source, /sources=\{\[/);
    assert.match(source, /https:\/\//);
  }
});

test('owned shortlist prioritizes five used products without shrinking the catalog', async () => {
  const source = await read('src/pages/gear/budget-tech/index.astro');
  assert.match(source, /data-owned-shortlist/);
  assert.equal((source.match(/data-owned-pick/g) || []).length, 5);
  assert.equal((source.match(/<a class="card" data-catalog-card/g) || []).length, 30);
  assert.match(source, /Owned &amp; used|Owned & used/);
  assert.match(source, /\/editorial-methodology/);

  for (const slug of [
    'iniu-usb-c-to-usb-c-cable-240w-6-6ft',
    'acodot-9-in-1-usb-c-hub',
    'logitech-c920x-hd-webcam',
    'sennheiser-momentum-4-wireless-noise-cancelling-headphones',
    'wd-elements-portable-external-hard-drive',
  ]) assert.match(source, new RegExp(`/gear/budget-tech/${slug}`));

  for (const comparison of [
    'iniu-cable-vs-generic-usb-c',
    'acodot-hub-vs-anker-553',
    'sennheiser-momentum-4-vs-cheap-anc',
    'wd-elements-vs-samsung-t7',
  ]) assert.match(source, new RegExp(`/gear/budget-tech/compare/${comparison}`));
});
