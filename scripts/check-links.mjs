// Checks every internal link and asset reference in dist/ against built files and public/_redirects.
// Run after `npm run build`: node scripts/check-links.mjs
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const redirects = new Set(readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').map((l) => l.trim().split(/\s+/)[0]).filter(Boolean));
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p); });
walk(DIST);

const resolves = (url) => {
  const path = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!path || path === '/') return true;
  if (redirects.has(path) || redirects.has(path.replace(/\/$/, ''))) return true;
  const base = join(DIST, path);
  return existsSync(base) && statSync(base).isFile() || existsSync(join(base, 'index.html')) || existsSync(`${base}.html`);
};

const broken = new Map();
let checked = 0;
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (url.startsWith('//') || url.startsWith('/api/') || url.startsWith('/cdn-cgi/')) continue;
    checked++;
    if (!resolves(url)) {
      const page = f.replace(/\\/g, '/').replace(/^dist/, '').replace(/index\.html$/, '');
      if (!broken.has(url)) broken.set(url, new Set());
      broken.get(url).add(page);
    }
  }
}
console.log(`${files.length} pages, ${checked} internal references, ${broken.size} broken targets`);
for (const [url, pages] of broken) console.log(`  ${url}  <- ${[...pages].slice(0, 4).join(', ')}${pages.size > 4 ? ` (+${pages.size - 4})` : ''}`);
process.exitCode = broken.size ? 1 : 0;
