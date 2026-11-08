import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import test from 'node:test';

const DIST = 'dist';

const htmlFiles = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  if (statSync(path).isDirectory()) return htmlFiles(path);
  return name.endsWith('.html') ? [path] : [];
});

const routeOf = (file) => {
  const route = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '');
  return route;
};

const resolves = (href) => {
  const path = decodeURIComponent(href.split(/[?#]/)[0]).replace(/^\//, '');
  return existsSync(join(DIST, path, 'index.html')) || (existsSync(join(DIST, path)) && statSync(join(DIST, path)).isFile());
};

test('every internal link in the built site resolves', { skip: !existsSync(DIST) }, () => {
  const broken = [];
  for (const file of htmlFiles(DIST)) {
    if (file.endsWith('404.html')) continue;
    const html = readFileSync(file, 'utf8');
    for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"#]*)/g)) {
      if (!href.startsWith('/cdn-cgi/') && !resolves(href)) broken.push(`${routeOf(file)} -> ${href}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('sitemap only lists indexable pages that exist', { skip: !existsSync(join(DIST, 'sitemap.xml')) }, () => {
  const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>https:\/\/stackgeist\.dev([^<]*)<\/loc>/g)].map((m) => m[1]);
  assert.ok(urls.length > 0);
  for (const url of urls) {
    const file = join(DIST, url, 'index.html');
    assert.ok(existsSync(file), `${url} is in the sitemap but was not built`);
    assert.doesNotMatch(readFileSync(file, 'utf8'), /<meta name="robots" content="noindex/, `${url} is in the sitemap but noindex`);
  }
});

test('noindexed pages still let crawlers follow their links', { skip: !existsSync(DIST) }, () => {
  for (const file of htmlFiles(DIST)) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /<meta name="robots" content="noindex, nofollow/, routeOf(file));
  }
});

test('search focus pages are indexable and in the sitemap', { skip: !existsSync(join(DIST, 'sitemap.xml')) }, () => {
  const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
  for (const route of ['/labs/', '/labs/active-directory-home-lab/', '/labs/osticket-docker-help-desk-lab/', '/labs/aws-cognito-private-crud-fix/', '/labs/help-desk-practice-without-experience/', '/certs/', '/certs/security-plus-v7-vs-v8/', '/guides/usb-c-dock-only-one-monitor/', '/guides/surge-protector-clicking/', '/guides/cable-management/', '/gear/input/logitech-mx-master-3s/', '/gear/budget-tech/sennheiser-momentum-4-wireless-noise-cancelling-headphones/']) {
    assert.ok(sitemap.includes(`https://stackgeist.dev${route}<`), route);
    assert.match(readFileSync(join(DIST, route, 'index.html'), 'utf8'), /<meta name="robots" content="index/, route);
  }
});

test('archived desk pages stay online but out of search', { skip: !existsSync(DIST) }, () => {
  for (const route of ['/gear/monitor-support/ergotron-lx/', '/guides/desk-layout-basics/']) {
    assert.match(readFileSync(join(DIST, route, 'index.html'), 'utf8'), /<meta name="robots" content="noindex, follow/, route);
  }
});

test('offers stay hidden until they have an approved link', { skip: !existsSync(DIST) }, () => {
  // The certs page lists the CompTIA and AWS slots: it shows paid options only when one of them has a link.
  const offers = readFileSync('src/data/partnerOffers.ts', 'utf8');
  const hasUrl = (key) => new RegExp(`${key}: \{[^}]*url: '[^']+'`).test(offers);
  const certs = readFileSync(join(DIST, 'certs', 'index.html'), 'utf8');
  if (hasUrl('comptiaPractice') || hasUrl('awsPractice')) assert.match(certs, /Paid options/);
  else assert.doesNotMatch(certs, /Paid options/);
  if (!hasUrl('comptiaPractice')) assert.doesNotMatch(certs, /CompTIA practice exams/);
});

test('public hubs do not expose internal marketing language', { skip: !existsSync(DIST) }, () => {
  for (const route of ['/guides/', '/gear/']) {
    assert.doesNotMatch(readFileSync(join(DIST, route, 'index.html'), 'utf8'), /social angles|income paths|monetized|ready to schedule/i, route);
  }
});

test('methodology page is gone and old links redirect', { skip: !existsSync(DIST) }, () => {
  assert.ok(!existsSync(join(DIST, 'editorial-methodology')));
  assert.match(readFileSync(join(DIST, '_redirects'), 'utf8'), /\/editorial-methodology\/ \/about\/ 301/);
});

test('gear hub lists the now-source-checked Amazon Basics dual monitor arm', { skip: !existsSync(DIST) }, () => {
  assert.match(readFileSync(join(DIST, 'gear', 'index.html'), 'utf8'), /amazon-basics-dual-monitor-arm/);
});

test('partner offers only render with a link and always carry the disclosure', { skip: !existsSync(DIST) }, () => {
  const offers = readFileSync('src/data/partnerOffers.ts', 'utf8');
  const live = new Set([...offers.matchAll(/id: '([^']+)'[\s\S]*?url: '([^']*)'/g)].filter((m) => m[2]).map((m) => m[1]));
  for (const file of htmlFiles(DIST)) {
    const html = readFileSync(file, 'utf8');
    if (!html.includes('aria-label="Paid options"')) continue;
    assert.equal(live.size > 0, true, `${file} shows paid options but no offer has a url`);
    assert.match(html, /Paid link: StackGeist may earn a commission/, file);
    assert.match(html, /rel="sponsored nofollow noopener noreferrer"[^>]*data-affiliate-link/, file);
  }
});
