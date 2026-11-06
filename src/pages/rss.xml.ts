import { CATALOG } from '../data/catalog';
import { SECTIONS, TYPE_LABEL } from '../data/sections';

export const prerender = true;

const site = 'https://stackgeist.dev';
const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

// The feed reads the same catalog as the site: every editorial page and product note,
// newest first. Buying lists and archived setups are left out.
const FEED_TYPES = new Set(['troubleshooting', 'topic', 'buying-guide', 'lab', 'lab-hardware', 'certification', 'course-review', 'study-log', 'product']);

export function GET() {
  const items = CATALOG
    .filter((e) => FEED_TYPES.has(e.type))
    .sort((a, b) => (b.updated || '').localeCompare(a.updated || ''));
  const xmlItems = items.map((e) => {
    const url = `${site}${e.href}`;
    const date = e.updated ? `<pubDate>${new Date(`${e.updated}T12:00:00Z`).toUTCString()}</pubDate>` : '';
    return `<item><title>${escapeXml(e.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid>${date}<category>${escapeXml(SECTIONS[e.section].label)}</category><description>${escapeXml(`${TYPE_LABEL[e.type]}: ${e.dek}`)}</description></item>`;
  }).join('');
  const newest = items.find((e) => e.updated)?.updated;
  const lastBuild = newest ? `<lastBuildDate>${new Date(`${newest}T12:00:00Z`).toUTCString()}</lastBuildDate>` : '';

  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>StackGeist: tech fixes, IT home labs, and certification guides</title><link>${site}/</link><description>Step-by-step fixes for Windows, storage, USB-C, and network problems, documented IT home labs, WGU course reviews, and hardware notes.</description><language>en-us</language>${lastBuild}<atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>${xmlItems}</channel></rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
