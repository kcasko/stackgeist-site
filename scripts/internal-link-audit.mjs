#!/usr/bin/env node
// Internal-link audit: scan built dist/*.html files, build an outbound-link
// graph, surface orphans (pages linked by nobody but the sitemap) and
// weak-linked pages (<=1 inbound link). Prints a markdown report.
//
// Run: node scripts/internal-link-audit.mjs
import { readdir, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE_ROOT = path.resolve(fileURLToPath(import.meta.url), '..', '..');
const DIST = path.join(SITE_ROOT, 'dist');

async function walk(dir, out = []) {
  for (const name of await readdir(dir)) {
    const full = path.join(dir, name);
    const s = await stat(full);
    if (s.isDirectory()) await walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function toRoute(file) {
  // dist\gear\budget-tech\compare\wd-elements-vs-samsung-t7\index.html -> /gear/budget-tech/compare/wd-elements-vs-samsung-t7/
  let rel = path.relative(DIST, file).replace(/\\/g, '/');
  if (rel.endsWith('/index.html')) rel = rel.slice(0, -'index.html'.length);
  else if (rel.endsWith('.html')) rel = rel.slice(0, -'.html'.length);
  return '/' + rel;
}

function extractInternalLinks(html) {
  const out = new Set();
  const re = /href="([^"#?]+)(?:[?#][^"]*)?"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let href = m[1];
    if (!href.startsWith('/') && !href.startsWith('https://stackgeist.dev/')) continue;
    if (href.startsWith('https://stackgeist.dev')) href = href.slice('https://stackgeist.dev'.length) || '/';
    if (!href.endsWith('/') && !href.includes('.')) href += '/';
    if (href.startsWith('/api/') || href.startsWith('/_astro/') || href === '/favicon.ico' || href === '/favicon.svg') continue;
    out.add(href);
  }
  return out;
}

function bucketOf(route) {
  if (route === '/') return 'home';
  if (route.startsWith('/gear/budget-tech/compare/')) return route === '/gear/budget-tech/compare/' ? 'hub' : 'compare';
  if (route.startsWith('/gear/')) return route === '/gear/' ? 'hub' : 'gear';
  if (route.startsWith('/guides/')) return route === '/guides/' ? 'hub' : 'guide';
  if (route.startsWith('/setups/')) return route === '/setups/' ? 'hub' : 'setup';
  if (route.startsWith('/kits/')) return route === '/kits/' ? 'hub' : 'kit';
  return 'other';
}

async function main() {
  const files = await walk(DIST);
  const pages = new Map(); // route -> {outbound: Set, inbound: Set, bucket}
  for (const file of files) {
    const route = toRoute(file);
    const html = await readFile(file, 'utf8');
    const outbound = extractInternalLinks(html);
    pages.set(route, { outbound, inbound: new Set(), bucket: bucketOf(route) });
  }
  // Build inbound.
  for (const [src, data] of pages) {
    for (const dest of data.outbound) {
      const d = pages.get(dest);
      if (d && src !== dest) d.inbound.add(src);
    }
  }

  // Report.
  const totals = {};
  for (const { bucket } of pages.values()) totals[bucket] = (totals[bucket] || 0) + 1;

  const weak = [];
  const orphans = [];
  for (const [route, data] of pages) {
    if (route === '/404/' || route.startsWith('/_astro/')) continue;
    const inboundCount = data.inbound.size;
    if (inboundCount === 0) orphans.push(route);
    else if (inboundCount <= 2) weak.push({ route, inboundCount, bucket: data.bucket });
  }

  // Cross-link opportunities: gear pages NOT linked from compare pages that cover their category.
  const crossMisses = [];
  for (const [route, data] of pages) {
    if (data.bucket !== 'compare') continue;
    // find gear detail pages NOT linked from this compare page
    const linked = new Set(Array.from(data.outbound).filter((h) => bucketOf(h) === 'gear'));
    const compared = Array.from(linked);
    if (compared.length < 2) {
      // compare page lists fewer than 2 full-detail gear pages
      crossMisses.push({ compare: route, gearLinked: compared.length, outboundSample: Array.from(data.outbound).slice(0, 5) });
    }
  }

  // Markdown report.
  const lines = [];
  lines.push('# Internal link audit\n');
  lines.push(`Pages scanned: ${pages.size}\n`);
  lines.push('## Totals by bucket');
  for (const [b, n] of Object.entries(totals).sort()) lines.push(`- ${b}: ${n}`);
  lines.push('');
  lines.push(`## Orphans (0 inbound internal links): ${orphans.length}`);
  for (const r of orphans.sort()) lines.push(`- \`${r}\``);
  lines.push('');
  lines.push(`## Weakly linked (<=2 inbound): ${weak.length}`);
  const weakByBucket = {};
  for (const w of weak) (weakByBucket[w.bucket] ||= []).push(w);
  for (const [b, arr] of Object.entries(weakByBucket).sort()) {
    lines.push(`\n### ${b} (${arr.length})`);
    for (const w of arr.sort((a, b) => a.inboundCount - b.inboundCount || a.route.localeCompare(b.route))) {
      lines.push(`- [${w.inboundCount}] \`${w.route}\``);
    }
  }
  lines.push('');
  lines.push(`## Compare pages linking to <2 gear detail pages: ${crossMisses.length}`);
  for (const m of crossMisses) {
    lines.push(`- \`${m.compare}\` -> only ${m.gearLinked} /gear/ link(s)`);
  }
  lines.push('');
  console.log(lines.join('\n'));
}
main().catch((err) => { console.error(err); process.exit(1); });
