#!/usr/bin/env node
// Audit static internal links among StackGeist Astro pages.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PAGES = join(ROOT, 'src', 'pages');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : name.endsWith('.astro') ? [p] : [];
  });
}
function route(file) {
  let r = '/' + relative(PAGES, file).split(sep).join('/').replace(/\.astro$/, '');
  r = r.replace(/\/index$/, '/');
  return r !== '/' ? r.replace(/\/$/, '') : r;
}
function normalize(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  const p = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  return p;
}

const files = walk(PAGES);
const routes = new Map(files.map((f) => [route(f), f]));
const inbound = new Map([...routes.keys()].map((r) => [r, new Set()]));
const outbound = new Map();
for (const [r, f] of routes) {
  const src = readFileSync(f, 'utf8');
  const links = new Set();
  for (const m of src.matchAll(/href\s*=\s*["']([^"']+)["']/g)) {
    const dest = normalize(m[1]);
    if (!dest || dest === r) continue;
    links.add(dest);
    if (routes.has(dest)) inbound.get(dest).add(r);
  }
  outbound.set(r, links);
}
const exempt = new Set(['/','/404','/privacy','/contact','/about','/affiliate-disclosure','/editorial-methodology']);
const orphans = [...routes.keys()].filter((r) => !exempt.has(r) && inbound.get(r).size === 0).sort();
const thin = [...routes.keys()].filter((r) => !exempt.has(r) && [...outbound.get(r)].filter((x) => x.startsWith('/gear') || x.startsWith('/guides') || x.startsWith('/setups')).length < 3).sort();
console.log(JSON.stringify({ pages: routes.size, orphanCount: orphans.length, orphans, thinOutboundCount: thin.length, thinOutbound: thin }, null, 2));
