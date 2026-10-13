export const prerender = true;

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { GENERATED_SETUPS } from '../data/gamingSetupOptions';
import { troubleshootingHubs } from '../data/troubleshootingHubs';
import { INCOME_KITS } from '../data/incomeKits';

const pageModules = import.meta.glob('./**/*.astro');

// astro build bundles this file into dist/.prerender/chunks, so import.meta.url
// at execution time no longer points at src/pages/. process.cwd() is reliably
// the project root during `astro build`.
const SITE_ROOT = process.cwd();
const PAGES_DIR = path.join(SITE_ROOT, 'src', 'pages');

const routeToSource = new Map<string, string>();
for (const file of Object.keys(pageModules)) {
  const route = (file
    .replace(/^\.\//, '/')
    .replace(/\/index\.astro$/, '')
    .replace(/\.astro$/, '') || '/');
  if (route === '/404' || route.includes('[')) continue;
  routeToSource.set(route, path.join(PAGES_DIR, file.replace(/^\.\//, '')));
}

const dynamicRoutes = [
  ...GENERATED_SETUPS.map((setup) => `/setups/${setup.slug}`),
  ...troubleshootingHubs.map((hub) => `/guides/${hub.slug}`),
  ...INCOME_KITS.map((kit) => `/kits/${kit.slug}`),
];
const dynamicSource = (route: string): string | undefined => {
  if (route.startsWith('/setups/')) return path.join(PAGES_DIR, 'setups', '[slug].astro');
  if (route.startsWith('/guides/')) return path.join(PAGES_DIR, 'guides', '[slug].astro');
  if (route.startsWith('/kits/')) return path.join(PAGES_DIR, 'kits', '[slug].astro');
  return undefined;
};
for (const route of dynamicRoutes) {
  if (!routeToSource.has(route)) {
    const src = dynamicSource(route);
    if (src) routeToSource.set(route, src);
  }
}

// Memoized per-file git log lookup. Build runs once, so a Map is enough.
const lastmodCache = new Map<string, string | undefined>();
function gitLastmod(file: string): string | undefined {
  if (lastmodCache.has(file)) return lastmodCache.get(file);
  let result: string | undefined;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: SITE_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).toString().trim();
    result = out || undefined;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[sitemap] git log failed for ${file}:`, (err as Error).message);
    result = undefined;
  }
  lastmodCache.set(file, result);
  return result;
}

function priorityFor(route: string): string {
  if (route === '/') return '1.0';
  if (['/gear', '/guides', '/setups', '/kits', '/gear/budget-tech', '/gear/budget-tech/compare'].includes(route)) return '0.9';
  if (route.startsWith('/gear/budget-tech/compare/')) return '0.8';
  if (route.startsWith('/gear/')) return '0.8';
  if (route.startsWith('/kits/')) return '0.7';
  if (route.startsWith('/setups/')) return '0.7';
  if (route.startsWith('/guides/')) return '0.6';
  return '0.5';
}

function changefreqFor(route: string): string {
  if (route === '/' || route.endsWith('/compare')) return 'weekly';
  return 'monthly';
}

const routes = Array.from(routeToSource.keys())
  .sort((a, b) => (a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)));

export function GET() {
  const urls = routes
    .map((route) => {
      const canonicalPath = route === '/' ? '/' : `${route.replace(/\/$/, '')}/`;
      const source = routeToSource.get(route);
      const lastmod = source ? gitLastmod(source) : undefined;
      const parts = [
        `<loc>https://stackgeist.dev${canonicalPath}</loc>`,
        lastmod ? `<lastmod>${lastmod}</lastmod>` : '',
        `<changefreq>${changefreqFor(route)}</changefreq>`,
        `<priority>${priorityFor(route)}</priority>`,
      ].filter(Boolean).join('');
      return `<url>${parts}</url>`;
    })
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
