export const prerender = true;
const routes = [
  '/', '/about', '/contact', '/privacy', '/affiliate-disclosure',
  '/setups/gaming', '/setups/midnight-shift', '/setups/small-bedroom-gaming', '/setups/budget-gaming-desk',
  '/guides/desk-layout-basics', '/guides/cable-management', '/guides/cheap-desk-upgrades', '/gear', '/gear/desk-lighting',
  '/gear/desk-lighting/benq-screenbar-pro', '/gear/desk-lighting/luminoodle',
  '/gear/desk-power/anker-525', '/gear/desk-power/anker-nano-a9196', '/gear/desk-surface/steelseries-qck-heavy-xxl',
];
export function GET() {
  const urls = routes.map((route) => `<url><loc>https://stackgeist.dev${route}</loc></url>`).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
