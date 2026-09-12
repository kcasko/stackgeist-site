import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const slugs = [
  'help-desk-homelab-starter-kit',
  'wgu-software-engineering-desk-kit',
  'usb-c-desk-survival-kit',
  'budget-video-call-kit',
  'cheap-desk-upgrades-under-100',
];

test('income kits define monetized buyer-intent pages and social angles', async () => {
  const data = await read('src/data/incomeKits.ts');
  for (const slug of slugs) assert.match(data, new RegExp(`slug: '${slug}'`));
  assert.equal((data.match(/channel: 'reddit'/g) || []).length, 5);
  assert.match(data, /tag=\$\{TAG\}/);
  assert.match(data, /deskrespawn-20/);
  assert.doesNotMatch(data, /tested in our lab|guaranteed income|passive income/i);
});

test('income kit routes are linked from navigation, footer, homepage, and sitemap source', async () => {
  const header = await read('src/components/Header.astro');
  const footer = await read('src/components/SiteFooter.astro');
  const home = await read('src/pages/index.astro');
  const sitemap = await read('src/pages/sitemap.xml.ts');
  for (const src of [header, footer, sitemap]) assert.match(src, /\/kits/);
  for (const slug of ['help-desk-homelab-starter-kit', 'cheap-desk-upgrades-under-100', 'usb-c-desk-survival-kit']) {
    assert.match(home, new RegExp(`/kits/${slug}`));
  }
});

test('income kit component tracks paid links and keeps disclosure near the conversion area', async () => {
  const component = await read('src/components/IncomeKitPage.astro');
  assert.match(component, /data-affiliate-link/);
  assert.match(component, /sponsored nofollow noopener noreferrer/);
  assert.match(component, /data-affiliate-placement/);
  assert.match(component, /Paid Amazon links are marked/);
  assert.doesNotMatch(component, /document\.cookie|localStorage|userAgent|\.referrer/);
});

test('income campaign generator writes reusable social batch artifacts', async () => {
  const script = await read('scripts/generate-income-campaign.mjs');
  assert.match(script, /marketing\/income-engine\/social-batch\.csv/);
  assert.match(script, /marketing\/income-engine\/tiktok-scripts\.md/);
  assert.match(script, /utm_campaign=\$\{campaign\}/);
});
