// StackGeist's search focus is troubleshooting fixes, then IT labs and certifications.
// Pages outside that focus stay online for existing links and social traffic,
// but are noindex and left out of the sitemap. Remove a route here to restore it.

const ARCHIVED_PREFIXES = [
  '/setups',
  '/gear/accessories',
  '/gear/audio',
  '/gear/budget-tech',
  '/gear/desk-lighting',
  '/gear/desk-power',
  '/gear/desk-surface',
  '/gear/input',
  '/gear/monitor-support',
  '/gear/video',
];

const ARCHIVED_GUIDES = [
  'better-video-calls',
  'cheap-desk-upgrades',
  'desk-layout-basics',
  'keyboard-mouse-fit',
];

// Exceptions inside an archived prefix that fit the focus.
const KEPT_ROUTES = new Set([
  '/setups/home-lab-dev-workstation',
  '/gear/input/logitech-mx-master-3s',
  '/gear/budget-tech/sennheiser-momentum-4-wireless-noise-cancelling-headphones',
  '/gear/budget-tech/wd-my-passport-4tb',
  '/gear/desk-power/anker-nano-a9196',
  '/gear/desk-lighting/govee-strip-light-2-pro',
  '/gear/desk-lighting/benq-screenbar-pro',
  '/gear/desk-surface/steelseries-qck-heavy-xxl',
  '/gear/accessories/razer-base-station-v2-chroma',
  '/gear/monitor-support/amazon-basics-dual-monitor-arm',
]);

const ARCHIVED_ROUTES = new Set(ARCHIVED_GUIDES.map((slug) => `/guides/${slug}`));

export function isArchivedRoute(pathname: string): boolean {
  const route = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  if (KEPT_ROUTES.has(route)) return false;
  if (ARCHIVED_ROUTES.has(route)) return true;
  return ARCHIVED_PREFIXES.some((prefix) => route === prefix || route.startsWith(`${prefix}/`));
}
