export const prerender = true;

import { GENERATED_SETUPS } from '../data/gamingSetupOptions';
import { troubleshootingHubs } from '../data/troubleshootingHubs';
import { INCOME_KITS } from '../data/incomeKits';

const pageModules = import.meta.glob('./**/*.astro');

const editorialNoindexRoutes = new Set([
  '/gear/budget-tech/14-portable-laptop-screen-extender-triple-display',
  '/gear/budget-tech/140-in-1-precision-screwdriver-repair-kit',
  '/gear/budget-tech/15ft-indoor-extension-cord-16-3-flat-black',
  '/gear/budget-tech/500w-multi-port-gan-charging-station',
  '/gear/budget-tech/80w-digital-soldering-iron-kit',
  '/gear/budget-tech/80w-soundbar-for-tv-pc-and-gaming',
  '/gear/budget-tech/acodot-9-in-1-usb-c-hub',
  '/gear/budget-tech/adjustable-aluminum-tablet-stand',
  '/gear/budget-tech/adjustable-desk-phone-stand',
  '/gear/budget-tech/alfa-ac1900-long-range-usb-wi-fi-adapter',
  '/gear/budget-tech/big-tall-high-back-office-chair-400lb-capacity',
  '/gear/budget-tech/canakit-raspberry-pi-5-starter-kit-pro-8gb-128gb',
  '/gear/budget-tech/clamp-on-led-desk-lamp',
  '/gear/budget-tech/clipboard-with-storage-compartment',
  '/gear/budget-tech/flat-plug-surge-protector-power-strip-8-outlets-usb',
  '/gear/budget-tech/iniu-usb-c-to-usb-c-cable-240w-6-6ft',
  '/gear/budget-tech/kroser-laptop-briefcase-up-to-17-3',
  '/gear/budget-tech/levo-g2-deluxe-rolling-laptop-stand',
  '/gear/budget-tech/microfiber-cleaning-cloths-18-pack',
  '/gear/budget-tech/sabrent-sata-to-usb-adapter-cable',
  '/gear/budget-tech/sabrent-usb-c-lay-flat-drive-dock-nvme-sata',
  '/gear/budget-tech/samsung-evo-select-512gb-microsd-card',
  '/gear/budget-tech/sandisk-ultra-128gb-microsd-card-2-pack',
  '/gear/budget-tech/sandisk-ultra-flair-128gb-usb-3-0-flash-drive',
  '/gear/budget-tech/texas-instruments-ti-84-plus-ce-graphing-calculator',
  '/gear/budget-tech/usb-c-to-usb-a-adapter-2-pack',
  '/gear/budget-tech/usb-to-3-5mm-audio-adapter-cable',
  '/gear/budget-tech/wd-elements-portable-external-hard-drive',
  '/gear/desk-lighting/luminoodle',
  '/gear/monitor-support/amazon-basics-dual-monitor-arm'
]);

const staticRoutes = Object.keys(pageModules)
  .map((file) => file
    .replace(/^\.\//, '/')
    .replace(/\/index\.astro$/, '')
    .replace(/\.astro$/, ''))
  .map((route) => route || '/')
  .filter((route) => route !== '/404' && !route.includes('['))
  .filter((route) => !editorialNoindexRoutes.has(route) && !route.startsWith('/gear/budget-tech/compare'));

const dynamicRoutes = [
  ...GENERATED_SETUPS.map((setup) => `/setups/${setup.slug}`),
  ...troubleshootingHubs.map((hub) => `/guides/${hub.slug}`),
  ...INCOME_KITS.map((kit) => `/kits/${kit.slug}`),
];
const routes = [...new Set([...staticRoutes, ...dynamicRoutes])]
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
