import { SETUP_LIST } from '../data/gamingSetupOptions';

export const prerender = true;

const site = 'https://stackgeist.dev';
const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export function GET() {
  const items = SETUP_LIST.map((setup) => {
    const url = `${site}/setups/${setup.slug}`;
    const title = setup.headline ?? setup.title;
    return `<item><title>${escapeXml(title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(setup.summary)}</description></item>`;
  }).join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>StackGeist setup guides</title><link>${site}/setups</link><description>Fit-first desk, gaming, creator, workstation, and audio setup guides from StackGeist.</description><language>en-us</language><atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
