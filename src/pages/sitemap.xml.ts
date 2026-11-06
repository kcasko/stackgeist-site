export const prerender = true;

import { GENERATED_SETUPS } from '../data/gamingSetupOptions';
import { troubleshootingHubs } from '../data/troubleshootingHubs';
import { isArchivedRoute } from '../data/searchScope';
import { RESEARCH_PENDING_ROUTES } from '../data/researchPending';
import { INCOME_KITS, isKitIndexable } from '../data/incomeKits';

const pageModules = import.meta.glob('./**/*.astro');

const editorialNoindexRoutes = RESEARCH_PENDING_ROUTES;

const staticRoutes = Object.keys(pageModules)
  .map((file) => file
    .replace(/^\.\//, '/')
    .replace(/\/index\.astro$/, '')
    .replace(/\.astro$/, ''))
  .map((route) => route || '/')
  .filter((route) => route !== '/404' && route !== '/search' && !route.includes('['))
  .filter((route) => !editorialNoindexRoutes.has(route) && !route.startsWith('/gear/budget-tech/compare'));

const dynamicRoutes = [
  ...GENERATED_SETUPS.map((setup) => `/setups/${setup.slug}`),
  ...troubleshootingHubs.map((hub) => `/guides/${hub.slug}`),
  ...INCOME_KITS.filter(isKitIndexable).map((kit) => `/kits/${kit.slug}`),
];
const routes = [...new Set([...staticRoutes, ...dynamicRoutes])]
  .filter((route) => !isArchivedRoute(route))
  .sort((a, b) => a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b));

export function GET() {
  const urls = routes
    .map((route) => {
      const canonicalPath = route === '/' ? '/' : `${route.replace(/\/$/, '')}/`;
      return `<url><loc>https://stackgeist.dev${canonicalPath}</loc></url>`;
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
