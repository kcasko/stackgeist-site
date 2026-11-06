import { troubleshootingHubs } from '../data/troubleshootingHubs';
import { LABS, CERT_PAGES } from '../data/labs';

export const prerender = true;

const site = 'https://stackgeist.dev';
const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

type FeedItem = { href: string; title: string; description: string };

export function GET() {
  const guides: FeedItem[] = troubleshootingHubs.flatMap((hub) => hub.guides.map((guide) => ({
    href: `/guides/${guide.slug}/`,
    title: guide.title,
    description: guide.desc,
  })));
  const items: FeedItem[] = [
    ...guides,
    ...LABS.map((lab) => ({ href: lab.href, title: lab.title, description: lab.note })),
    ...CERT_PAGES.map((page) => ({ href: page.href, title: page.title, description: page.note })),
  ];
  const seen = new Set<string>();
  const xmlItems = items
    .filter((item) => (seen.has(item.href) ? false : (seen.add(item.href), true)))
    .map((item) => {
      const url = `${site}${item.href}`;
      return `<item><title>${escapeXml(item.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(item.description)}</description></item>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>StackGeist: tech fixes, IT home labs, and certification guides</title><link>${site}/</link><description>Step-by-step troubleshooting for USB-C, storage, charging, and Wi-Fi problems, plus documented IT home labs and certification guides.</description><language>en-us</language><atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>${xmlItems}</channel></rss>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
