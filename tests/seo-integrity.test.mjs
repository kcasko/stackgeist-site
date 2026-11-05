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

test('indexable kits contain no unchecked retailer searches', { skip: !existsSync(DIST) }, () => {
  const kitsDir = join(DIST, 'kits');
  for (const slug of readdirSync(kitsDir)) {
    const file = join(kitsDir, slug, 'index.html');
    if (!existsSync(file)) continue;
    const html = readFileSync(file, 'utf8');
    if (/<meta name="robots" content="index/.test(html) && slug !== 'index.html') {
      assert.doesNotMatch(html, /have not been individually source-checked/, `${slug} is indexable but has unchecked items`);
    }
  }
});

test('noindexed pages still let crawlers follow their links', { skip: !existsSync(DIST) }, () => {
  for (const file of htmlFiles(DIST)) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /<meta name="robots" content="noindex, nofollow/, routeOf(file));
  }
});
