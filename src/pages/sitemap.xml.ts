export const prerender = true;
const routes = [
  '/', '/about', '/contact', '/privacy', '/affiliate-disclosure',
  '/setups/gaming', '/setups/midnight-shift', '/gear/desk-lighting',
  '/gear/desk-lighting/benq-screenbar-pro', '/gear/desk-lighting/luminoodle',
];
export function GET() {
  const urls = routes.map((route) => `<url><loc>https://stackgeist.dev${route}</loc></url>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
