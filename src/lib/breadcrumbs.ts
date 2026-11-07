type Breadcrumb = { name: string; path: string };
const LABELS: Record<string, string> = {
  guides: 'Fixes', labs: 'Labs', gear: 'Gear', learning: 'Learning',
  certs: 'Learning', kits: 'Buying lists', setups: 'Setups',
};

export function buildBreadcrumbs(pathname: string, title: string, knownRoutes: Set<string>, parents?: Breadcrumb[]): Breadcrumb[] {
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return [];
  const crumbs: Breadcrumb[] = [{ name: 'StackGeist', path: '/' }];
  if (parents) crumbs.push(...parents.filter(parent => knownRoutes.has(parent.path)));
  for (let i = 0; !parents && i < parts.length - 1; i++) {
    const path = `/${parts.slice(0, i + 1).join('/')}/`;
    if (knownRoutes.has(path)) crumbs.push({
      name: LABELS[parts[i]] ?? parts[i].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      path,
    });
  }
  crumbs.push({ name: title.replace(/\s*\|\s*StackGeist\s*$/, ''), path: `/${parts.join('/')}/` });
  return crumbs;
}
