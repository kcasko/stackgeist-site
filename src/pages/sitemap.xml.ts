export const prerender = true;

import { GENERATED_SETUPS } from '../data/gamingSetupOptions';

const pageModules = import.meta.glob('./**/*.astro');

const staticRoutes = Object.keys(pageModules)
  .map((file) => file
    .replace(/^\.\//, '/')
    .replace(/\/index\.astro$/, '')
    .replace(/\.astro$/, ''))
  .map((route) => route || '/')
  .filter((route) => route !== '/404' && !route.includes('['));

const dynamicRoutes = GENERATED_SETUPS.map((setup) => `/setups/${setup.slug}`);
const routes = [...new Set([...staticRoutes, ...dynamicRoutes])]
  .sort((a, b) => a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b));

export function GET() {
  const urls = routes
    .map((route) => `<url><loc>https://stackgeist.dev${route}</loc></url>`)
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
