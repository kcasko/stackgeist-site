export const prerender = true;

const pageModules = import.meta.glob('./**/*.astro');

const routes = Object.keys(pageModules)
  .map((file) => file
    .replace(/^\.\//, '/')
    .replace(/\/index\.astro$/, '')
    .replace(/\.astro$/, ''))
  .map((route) => route || '/')
  .filter((route) => route !== '/404' && !route.includes('['))
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
